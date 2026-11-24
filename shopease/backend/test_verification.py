import os
import sys
import django
from decimal import Decimal

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.test import Client
from django.contrib.auth import get_user_model
from categories.models import Category
from products.models import Product
from orders.models import Order, OrderItem
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

def run_tests():
    print("=" * 60)
    print("SHOPEASE COMPREHENSIVE AUTOMATED VERIFICATION SUITE")
    print("=" * 60)
    client = Client()

    # 1. Verify Customer Registration
    test_user_email = "newbuyer@test.com"
    User.objects.filter(email=test_user_email).delete()
    reg_res = client.post('/api/auth/register/', {
        'username': 'newbuyer',
        'email': test_user_email,
        'password': 'password123',
        'confirm_password': 'password123'
    }, content_type='application/json')
    assert reg_res.status_code == 201, f"Customer registration failed: {reg_res.status_code} {reg_res.content}"
    assert reg_res.json()['user']['role'] == 'customer', "Registration must create customer role!"
    print("✓ Scenario 1: Customer registration works (Role: customer)")

    # 2. Customer Login
    login_res = client.post('/api/auth/login/', {
        'username': 'customer',
        'password': 'customer123'
    }, content_type='application/json')
    assert login_res.status_code == 200, f"Customer login failed: {login_res.status_code}"
    customer_token = login_res.json()['access']
    customer_refresh = login_res.json()['refresh']
    assert login_res.json()['user']['role'] == 'customer'
    print("✓ Scenario 2: Customer login works")

    # 3. Admin Login
    admin_login_res = client.post('/api/auth/login/', {
        'username': 'admin',
        'password': 'admin123'
    }, content_type='application/json')
    assert admin_login_res.status_code == 200, f"Admin login failed: {admin_login_res.status_code}"
    admin_token = admin_login_res.json()['access']
    assert admin_login_res.json()['user']['role'] == 'admin'
    print("✓ Scenario 3: Admin login works")

    # 4. JWT Refresh
    refresh_res = client.post('/api/auth/token/refresh/', {
        'refresh': customer_refresh
    }, content_type='application/json')
    assert refresh_res.status_code == 200, f"Token refresh failed: {refresh_res.status_code}"
    assert 'access' in refresh_res.json()
    print("✓ Scenario 4: JWT refresh works")

    # 5. Admin Category Creation, Edit, Delete
    admin_auth = {'HTTP_AUTHORIZATION': f'Bearer {admin_token}'}
    cust_auth = {'HTTP_AUTHORIZATION': f'Bearer {customer_token}'}

    Order.objects.filter(items__product__name__startswith='Test Velocity Zoom').delete()
    Product.objects.filter(name__startswith='Test Velocity Zoom').delete()
    Category.objects.filter(name__startswith='Test New Category').delete()

    cat_res = client.post('/api/categories/', {'name': 'Test New Category'}, content_type='application/json', **admin_auth)
    assert cat_res.status_code == 201, f"Category creation failed: {cat_res.content}"
    test_cat_id = cat_res.json()['id']
    print("✓ Scenario 5: Admin can create categories")

    # Verify customer cannot create categories (Authorization check)
    unauth_cat = client.post('/api/categories/', {'name': 'Hacker Cat'}, content_type='application/json', **cust_auth)
    assert unauth_cat.status_code == 403, "Customer must NOT be able to create categories!"
    print("✓ Scenario 18a: Unauthorized category creation rejected (403)")

    # 6 & 7. Admin Product Creation and Editing
    prod_data = {
        'name': 'Test Velocity Zoom',
        'category_id': test_cat_id,
        'price': '199.99',
        'stock': '15'
    }
    prod_res = client.post('/api/products/', prod_data, **admin_auth)
    assert prod_res.status_code == 201, f"Product creation failed: {prod_res.content}"
    test_prod_id = prod_res.json()['id']
    print("✓ Scenario 6 & 7a: Admin can create products")

    # Edit product
    edit_res = client.put(f'/api/products/{test_prod_id}/', {
        'name': 'Test Velocity Zoom v2',
        'category_id': test_cat_id,
        'price': '179.99',
        'stock': '20'
    }, content_type='application/json', **admin_auth)
    assert edit_res.status_code == 200
    assert edit_res.json()['stock'] == 20
    print("✓ Scenario 7b: Admin can edit products")

    # 8. Customer Browsing Products
    browse_res = client.get('/api/products/')
    assert browse_res.status_code == 200
    assert len(browse_res.json()) >= 1
    print("✓ Scenario 8: Customer can browse products")

    # 9. Category Filtering
    filter_res = client.get(f'/api/products/?category={test_cat_id}')
    assert filter_res.status_code == 200
    assert all(p['category']['id'] == test_cat_id for p in filter_res.json())
    print("✓ Scenario 9: Category filtering works (?category=id)")

    # 10, 11, 12, 13, 14. Critical Business Logic for Orders
    # Current stock is 20, unit price is 179.99
    # Test 13: Insufficient stock rejected
    overstock_res = client.post('/api/orders/', {
        'items': [{'product_id': test_prod_id, 'quantity': 999}]
    }, content_type='application/json', **cust_auth)
    assert overstock_res.status_code == 400, "Ordering beyond available stock must be rejected!"
    print("✓ Scenario 13: Ordering beyond available stock is rejected (400)")

    # Test 11 & 12: Backend calculates total_amount server-side (Never trust frontend total)
    # Quantity: 3 -> Total should be 179.99 * 3 = 539.97
    # Even if frontend tampered payload attempts to pass total_amount = 0.01!
    order_res = client.post('/api/orders/', {
        'items': [{'product_id': test_prod_id, 'quantity': 3}],
        'total_amount': '0.01'  # Tamper attempt!
    }, content_type='application/json', **cust_auth)
    assert order_res.status_code == 201, f"Order placement failed: {order_res.content}"
    placed_order = order_res.json()['order']
    order_id = placed_order['id']
    expected_total = Decimal('179.99') * 3
    actual_total = Decimal(placed_order['total_amount'])
    assert actual_total == expected_total, f"Tampered total was not ignored! Expected {expected_total}, got {actual_total}"
    print(f"✓ Scenario 11 & 12: Server-side total calculated ({actual_total}) and tampering ignored")

    # Test 14: Stock decreased after purchase
    updated_prod = Product.objects.get(id=test_prod_id)
    assert updated_prod.stock == 17, f"Stock was not decremented! Expected 17, got {updated_prod.stock}"
    print(f"✓ Scenario 14: Stock successfully decremented from 20 to {updated_prod.stock}")

    # 15 & 16. Order Permissions
    # Customer only sees their orders
    cust_orders = client.get('/api/orders/', **cust_auth)
    assert cust_orders.status_code == 200
    for o in cust_orders.json():
        assert o['user'] == User.objects.get(username='customer').id
    print("✓ Scenario 16: Customers can only view their own orders")

    # Admin can view all orders
    admin_orders = client.get('/api/orders/', **admin_auth)
    assert admin_orders.status_code == 200
    assert len(admin_orders.json()) >= len(cust_orders.json())
    print("✓ Scenario 15: Admin can view all orders across all customers")

    # 17. Admin complete order
    complete_res = client.patch(f'/api/orders/{order_id}/complete/', **admin_auth)
    assert complete_res.status_code == 200
    assert complete_res.json()['order']['status'] == 'completed'
    print(f"✓ Scenario 17: Admin can mark orders as completed (Order #{order_id})")

    # 18. Customer cannot complete orders
    unauth_complete = client.patch(f'/api/orders/{order_id}/complete/', **cust_auth)
    assert unauth_complete.status_code == 403, "Customer must NOT be able to complete orders!"
    print("✓ Scenario 18b: Customers unauthorized from completing orders (403)")

    # 19. Cleanup test order, product & category
    Order.objects.filter(id=order_id).delete()
    Product.objects.filter(id=test_prod_id).delete()
    Category.objects.filter(id=test_cat_id).delete()

    print("=" * 60)
    print("ALL 20 VERIFICATION CHECKS PASSED WITH ZERO ERRORS!")
    print("=" * 60)

if __name__ == '__main__':
    run_tests()

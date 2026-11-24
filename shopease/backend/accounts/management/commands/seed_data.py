import os
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.conf import settings
from PIL import Image, ImageDraw, ImageFont

from categories.models import Category
from products.models import Product
from orders.models import Order, OrderItem

User = get_user_model()

def generate_product_image(name, filename, bg_color, accent_color):
    media_dir = settings.MEDIA_ROOT / 'products'
    os.makedirs(media_dir, exist_ok=True)
    file_path = media_dir / filename

    width, height = 600, 450
    img = Image.new('RGB', (width, height), color=bg_color)
    draw = ImageDraw.Draw(img)

    # Draw modern geometric background accents
    draw.rectangle([0, 0, width, 12], fill=accent_color)
    draw.ellipse([width - 150, -50, width + 100, 200], outline=accent_color, width=3)
    draw.ellipse([-50, height - 150, 180, height + 80], outline=accent_color, width=2)
    
    # Draw product card badge in center
    badge_box = [60, 80, width - 60, height - 80]
    draw.rounded_rectangle(badge_box, radius=16, fill=(255, 255, 255), outline=accent_color, width=2)

    # Draw shoe icon representation (stylized polygon)
    shoe_points = [
        (160, 260), (220, 200), (320, 190), (370, 210), (430, 250), 
        (450, 275), (440, 295), (150, 295), (145, 280)
    ]
    draw.polygon(shoe_points, fill=accent_color)
    # Sole
    draw.rounded_rectangle([140, 290, 455, 312], radius=6, fill=(40, 40, 40))

    # Text
    draw.text((width // 2 - 80, 110), "SHOPEASE", fill=(100, 116, 139))
    draw.text((width // 2 - 100, 140), name[:22], fill=(15, 23, 42))

    img.save(file_path, quality=90)
    return f'products/{filename}'

class Command(BaseCommand):
    help = "Seeds initial categories, products, admin and customer accounts, and demo orders."

    def handle(self, *args, **options):
        self.stdout.write("Seeding ShopEase database...")

        # 1. Admin user
        admin_user, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@shopease.com',
                'role': User.ROLE_ADMIN,
                'is_staff': True,
                'is_superuser': True,
            }
        )
        if created or not admin_user.check_password('admin123'):
            admin_user.set_password('admin123')
            admin_user.role = User.ROLE_ADMIN
            admin_user.is_staff = True
            admin_user.is_superuser = True
            admin_user.save()
            self.stdout.write(self.style.SUCCESS("Created admin user: admin / admin123"))
        else:
            self.stdout.write("Admin user already exists.")

        # 2. Customer user
        customer_user, created = User.objects.get_or_create(
            username='customer',
            defaults={
                'email': 'customer@shopease.com',
                'role': User.ROLE_CUSTOMER,
                'is_staff': False,
                'is_superuser': False,
            }
        )
        if created or not customer_user.check_password('customer123'):
            customer_user.set_password('customer123')
            customer_user.role = User.ROLE_CUSTOMER
            customer_user.save()
            self.stdout.write(self.style.SUCCESS("Created customer user: customer / customer123"))
        else:
            self.stdout.write("Customer user already exists.")

        # 3. Categories
        categories_data = [
            'Running Shoes',
            'Casual Sneakers',
            'Basketball & Court',
            'Formal & Dress',
            'Trail & Outdoor'
        ]
        cat_objs = {}
        for cname in categories_data:
            cat, _ = Category.objects.get_or_create(name=cname)
            cat_objs[cname] = cat
        self.stdout.write(self.style.SUCCESS(f"Seeded {len(cat_objs)} categories."))

        # 4. Products
        products_data = [
            {
                'name': 'Air Zoom Pegasus Pulse',
                'category': cat_objs['Running Shoes'],
                'price': Decimal('129.99'),
                'stock': 24,
                'img': ('pegasus.jpg', (241, 245, 249), (37, 99, 235))
            },
            {
                'name': 'CloudStrider Carbon Max',
                'category': cat_objs['Running Shoes'],
                'price': Decimal('189.50'),
                'stock': 12,
                'img': ('carbon_max.jpg', (238, 242, 255), (99, 102, 241))
            },
            {
                'name': 'Urban Retro Low Pro',
                'category': cat_objs['Casual Sneakers'],
                'price': Decimal('89.99'),
                'stock': 35,
                'img': ('retro_low.jpg', (243, 244, 246), (16, 185, 129))
            },
            {
                'name': 'StreetVibe Canvas White',
                'category': cat_objs['Casual Sneakers'],
                'price': Decimal('64.95'),
                'stock': 18,
                'img': ('canvas_white.jpg', (254, 242, 242), (239, 68, 68))
            },
            {
                'name': 'Court Dominator Elite',
                'category': cat_objs['Basketball & Court'],
                'price': Decimal('149.00'),
                'stock': 15,
                'img': ('court_dom.jpg', (254, 249, 195), (202, 138, 4))
            },
            {
                'name': 'Hoop Glide Hyper Dunk',
                'category': cat_objs['Basketball & Court'],
                'price': Decimal('135.00'),
                'stock': 8,
                'img': ('hyper_dunk.jpg', (245, 243, 255), (147, 51, 234))
            },
            {
                'name': 'Oxford Classic Leather',
                'category': cat_objs['Formal & Dress'],
                'price': Decimal('119.99'),
                'stock': 20,
                'img': ('oxford_classic.jpg', (250, 250, 250), (71, 85, 105))
            },
            {
                'name': 'Apex Peak Waterproof Boot',
                'category': cat_objs['Trail & Outdoor'],
                'price': Decimal('159.95'),
                'stock': 10,
                'img': ('apex_peak.jpg', (236, 253, 245), (5, 150, 105))
            },
        ]

        created_products = []
        for pdata in products_data:
            img_rel_path = generate_product_image(
                pdata['name'], 
                pdata['img'][0], 
                pdata['img'][1], 
                pdata['img'][2]
            )
            prod, created = Product.objects.get_or_create(
                name=pdata['name'],
                defaults={
                    'category': pdata['category'],
                    'price': pdata['price'],
                    'stock': pdata['stock'],
                    'image': img_rel_path
                }
            )
            if not created:
                prod.price = pdata['price']
                prod.stock = pdata['stock']
                if not prod.image:
                    prod.image = img_rel_path
                prod.save()
            created_products.append(prod)

        self.stdout.write(self.style.SUCCESS(f"Seeded {len(created_products)} products."))

        # 5. Sample Order for Customer
        if not Order.objects.filter(user=customer_user).exists():
            p1 = created_products[0]
            p2 = created_products[2]
            tot = (p1.price * 1) + (p2.price * 2)
            sample_order = Order.objects.create(
                user=customer_user,
                total_amount=tot,
                status=Order.STATUS_PLACED
            )
            OrderItem.objects.create(
                order=sample_order,
                product=p1,
                quantity=1,
                price=p1.price
            )
            OrderItem.objects.create(
                order=sample_order,
                product=p2,
                quantity=2,
                price=p2.price
            )
            self.stdout.write(self.style.SUCCESS(f"Created sample order #{sample_order.id} for customer."))

        self.stdout.write(self.style.SUCCESS("Database seeding completed successfully!"))

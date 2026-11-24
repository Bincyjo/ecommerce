from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied, ValidationError
from django.db import transaction
from django.db.models import Sum
from decimal import Decimal

from accounts.models import User
from accounts.permissions import IsAdminUserRole, IsCustomerUserRole
from categories.models import Category
from products.models import Product
from .models import Order, OrderItem
from .serializers import OrderSerializer, CreateOrderInputSerializer

class OrderListCreateView(generics.ListCreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Admin can view all orders; Customer can only view their own
        if user.is_staff or user.is_superuser or user.role == User.ROLE_ADMIN:
            return Order.objects.select_related('user').prefetch_related('items__product').all()
        return Order.objects.filter(user=user).select_related('user').prefetch_related('items__product').all()

    def create(self, request, *args, **kwargs):
        # Enforce customer-only role check server-side for placing orders
        if request.user.role == User.ROLE_ADMIN:
            return Response(
                {"error": "Administrators cannot place customer orders. Please use a customer account."},
                status=status.HTTP_403_FORBIDDEN
            )

        input_serializer = CreateOrderInputSerializer(data=request.data)
        input_serializer.is_valid(raise_exception=True)
        items_data = input_serializer.validated_data['normalized_items']

        product_ids = [item['product_id'] for item in items_data]

        try:
            with transaction.atomic():
                # Acquire database row lock using select_for_update to prevent race conditions / overselling
                products = {
                    p.id: p 
                    for p in Product.objects.select_for_update().filter(id__in=product_ids)
                }

                # Verify all products exist
                for item in items_data:
                    pid = item['product_id']
                    if pid not in products:
                        raise ValidationError(f"Product with ID {pid} does not exist.")

                # Validate stock availability
                for item in items_data:
                    pid = item['product_id']
                    p = products[pid]
                    req_qty = item['quantity']
                    if p.stock < req_qty:
                        raise ValidationError(
                            f"Insufficient stock for '{p.name}'. Requested: {req_qty}, Available: {p.stock}."
                        )

                # Server-side price calculation directly from DB snapshot
                total_amount = Decimal('0.00')
                items_to_create = []

                for item in items_data:
                    p = products[item['product_id']]
                    req_qty = item['quantity']
                    unit_price = p.price
                    subtotal = unit_price * req_qty
                    total_amount += subtotal

                    # Stock decrement
                    p.stock -= req_qty
                    p.save(update_fields=['stock'])

                    items_to_create.append({
                        'product': p,
                        'quantity': req_qty,
                        'price': unit_price,
                    })

                # Create Order record
                order = Order.objects.create(
                    user=request.user,
                    total_amount=total_amount,
                    status=Order.STATUS_PLACED
                )

                # Create OrderItem records with unit price snapshot
                for item_dict in items_to_create:
                    OrderItem.objects.create(
                        order=order,
                        product=item_dict['product'],
                        quantity=item_dict['quantity'],
                        price=item_dict['price']
                    )

            output_serializer = OrderSerializer(order, context={'request': request})
            return Response({
                'message': 'Order placed successfully!',
                'order': output_serializer.data
            }, status=status.HTTP_201_CREATED)

        except ValidationError as e:
            return Response({'error': e.detail if hasattr(e, 'detail') else str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': f"Failed to place order: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.select_related('user').prefetch_related('items__product').all()

    def get_object(self):
        order = super().get_object()
        user = self.request.user
        is_admin = user.is_staff or user.is_superuser or user.role == User.ROLE_ADMIN
        
        # Customers can only view their own orders
        if not is_admin and order.user != user:
            raise PermissionDenied("You do not have permission to view this order.")
        return order

class OrderCompleteView(APIView):
    permission_classes = [IsAdminUserRole]

    def patch(self, request, pk):
        try:
            order = Order.objects.get(pk=pk)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)

        if order.status == Order.STATUS_COMPLETED:
            return Response({'message': 'Order is already marked as completed.', 'order': OrderSerializer(order, context={'request': request}).data}, status=status.HTTP_200_OK)

        order.status = Order.STATUS_COMPLETED
        order.save(update_fields=['status'])
        
        serializer = OrderSerializer(order, context={'request': request})
        return Response({
            'message': f"Order #{order.id} marked as completed.",
            'order': serializer.data
        }, status=status.HTTP_200_OK)

class DashboardStatsView(APIView):
    permission_classes = [IsAdminUserRole]

    def get(self, request):
        total_products = Product.objects.count()
        total_categories = Category.objects.count()
        total_orders = Order.objects.count()
        total_customers = User.objects.filter(role=User.ROLE_CUSTOMER).count()
        
        total_revenue_result = Order.objects.aggregate(rev=Sum('total_amount'))
        total_revenue = total_revenue_result['rev'] or Decimal('0.00')

        placed_orders = Order.objects.filter(status=Order.STATUS_PLACED).count()
        completed_orders = Order.objects.filter(status=Order.STATUS_COMPLETED).count()

        recent_orders = Order.objects.select_related('user').prefetch_related('items__product').order_by('-created_at')[:5]
        recent_orders_data = OrderSerializer(recent_orders, many=True, context={'request': request}).data

        return Response({
            'total_products': total_products,
            'total_categories': total_categories,
            'total_orders': total_orders,
            'total_customers': total_customers,
            'total_revenue': str(total_revenue),
            'placed_orders': placed_orders,
            'completed_orders': completed_orders,
            'recent_orders': recent_orders_data,
        })

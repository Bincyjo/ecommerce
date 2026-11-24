from rest_framework import serializers
from decimal import Decimal
from .models import Order, OrderItem
from products.models import Product

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_image = serializers.SerializerMethodField()
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ('id', 'product', 'product_name', 'product_image', 'quantity', 'price', 'subtotal')
        read_only_fields = ('id', 'product_name', 'product_image', 'price', 'subtotal')

    def get_product_image(self, obj):
        if obj.product and obj.product.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.product.image.url)
            return obj.product.image.url
        return None

    def get_subtotal(self, obj):
        return str(obj.subtotal())

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    customer_name = serializers.CharField(source='user.username', read_only=True)
    customer_email = serializers.CharField(source='user.email', read_only=True)
    items_count = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = (
            'id', 
            'user', 
            'customer_name', 
            'customer_email', 
            'total_amount', 
            'status', 
            'created_at', 
            'items',
            'items_count'
        )
        read_only_fields = ('id', 'user', 'customer_name', 'customer_email', 'total_amount', 'status', 'created_at', 'items', 'items_count')

    def get_items_count(self, obj):
        return sum(item.quantity for item in obj.items.all())

class OrderItemInputSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)

class CreateOrderInputSerializer(serializers.Serializer):
    # Support either list of items or single item buy-now
    items = OrderItemInputSerializer(many=True, required=False)
    product_id = serializers.IntegerField(required=False)
    quantity = serializers.IntegerField(min_value=1, required=False)

    def validate(self, attrs):
        items = attrs.get('items')
        single_product_id = attrs.get('product_id')
        single_quantity = attrs.get('quantity')

        normalized_items = []
        if items:
            normalized_items = items
        elif single_product_id and single_quantity:
            normalized_items = [{'product_id': single_product_id, 'quantity': single_quantity}]
        else:
            raise serializers.ValidationError("Order must include at least one item.")

        if not normalized_items:
            raise serializers.ValidationError("Order items list cannot be empty.")

        # Check for duplicates, missing fields, or malformed quantities
        seen_ids = set()
        for item in normalized_items:
            pid = item.get('product_id')
            qty = item.get('quantity')
            if not pid or not isinstance(pid, int):
                raise serializers.ValidationError(f"Invalid product ID: {pid}")
            if not qty or not isinstance(qty, int) or qty <= 0:
                raise serializers.ValidationError(f"Quantity for product {pid} must be a positive integer.")
            if pid in seen_ids:
                raise serializers.ValidationError(f"Duplicate product ID {pid} found in order request.")
            seen_ids.add(pid)

        attrs['normalized_items'] = normalized_items
        return attrs

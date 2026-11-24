from rest_framework import serializers
from decimal import Decimal
from .models import Product
from categories.models import Category
from categories.serializers import CategorySerializer

class ProductSerializer(serializers.ModelSerializer):
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True
    )
    category = CategorySerializer(read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = (
            'id', 
            'name', 
            'price', 
            'stock', 
            'image', 
            'image_url', 
            'category_id', 
            'category', 
            'category_name', 
            'created_at'
        )
        read_only_fields = ('id', 'created_at', 'category_name', 'category', 'image_url')

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

    def validate_price(self, value):
        if value <= Decimal('0.00'):
            raise serializers.ValidationError("Price must be a positive number greater than 0.")
        return value

    def validate_stock(self, value):
        if value < 0:
            raise serializers.ValidationError("Stock cannot be negative.")
        return value

    def validate_image(self, value):
        if value:
            # Check maximum size: 5MB
            max_size_mb = 5
            if value.size > max_size_mb * 1024 * 1024:
                raise serializers.ValidationError(f"Image file size cannot exceed {max_size_mb}MB.")
            # Check extension
            valid_extensions = ['jpg', 'jpeg', 'png', 'webp', 'gif']
            ext = value.name.split('.')[-1].lower()
            if ext not in valid_extensions:
                raise serializers.ValidationError(f"Unsupported image format: .{ext}. Allowed: {', '.join(valid_extensions)}")
        return value

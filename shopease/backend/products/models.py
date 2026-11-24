from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal
from categories.models import Category

class Product(models.Model):
    name = models.CharField(max_length=255)
    price = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        validators=[MinValueValidator(Decimal('0.01'), message="Price must be greater than zero.")]
    )
    stock = models.PositiveIntegerField(
        default=0,
        validators=[MinValueValidator(0, message="Stock quantity cannot be negative.")]
    )
    image = models.ImageField(upload_to='products/', null=True, blank=True)
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - ₹{self.price} ({self.stock} in stock)"

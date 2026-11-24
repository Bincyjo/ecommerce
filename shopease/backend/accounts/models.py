from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_ADMIN = 'admin'
    ROLE_CUSTOMER = 'customer'
    ROLE_CHOICES = (
        (ROLE_ADMIN, 'Admin'),
        (ROLE_CUSTOMER, 'Customer'),
    )

    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=ROLE_CUSTOMER)

    REQUIRED_FIELDS = ['email']

    def is_admin_role(self):
        return self.role == self.ROLE_ADMIN or self.is_staff or self.is_superuser

    def is_customer_role(self):
        return self.role == self.ROLE_CUSTOMER

    def __str__(self):
        return f"{self.username} ({self.role})"

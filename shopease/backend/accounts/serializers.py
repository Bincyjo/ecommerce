from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model, authenticate
from django.db.models import Q

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role', 'date_joined')
        read_only_fields = ('id', 'role', 'date_joined')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6, style={'input_type': 'password'})
    confirm_password = serializers.CharField(write_only=True, min_length=6, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'confirm_password')

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value.lower()

    def validate_username(self, value):
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("An account with this username already exists.")
        return value

    def validate(self, attrs):
        if attrs.get('password') != attrs.get('confirm_password'):
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        # Enforce that public registration ALWAYS creates a customer account
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=User.ROLE_CUSTOMER,
            is_staff=False,
            is_superuser=False
        )
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'username'

    def validate(self, attrs):
        login_input = attrs.get(self.username_field)
        password = attrs.get('password')

        if not login_input or not password:
            raise serializers.ValidationError("Must include both username/email and password.")

        # Check if the user entered an email address instead of username
        user_obj = None
        if '@' in login_input:
            user_obj = User.objects.filter(email__iexact=login_input).first()
        else:
            user_obj = User.objects.filter(username__iexact=login_input).first()

        if user_obj and user_obj.check_password(password):
            if not user_obj.is_active:
                raise serializers.ValidationError("User account is disabled.")
            refresh = self.get_token(user_obj)
            # Add custom claims to the token
            refresh['username'] = user_obj.username
            refresh['email'] = user_obj.email
            refresh['role'] = user_obj.role
            
            return {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {
                    'id': user_obj.id,
                    'username': user_obj.username,
                    'email': user_obj.email,
                    'role': user_obj.role,
                }
            }
        else:
            raise serializers.ValidationError("No active account found with the given credentials.")

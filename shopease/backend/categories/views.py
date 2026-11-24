from rest_framework import generics, status
from rest_framework.response import Response
from accounts.permissions import IsAdminUserRole, IsAdminOrReadOnly
from .models import Category
from .serializers import CategorySerializer

class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all().prefetch_related('products')
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]

class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all().prefetch_related('products')
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        product_count = instance.products.count()
        if product_count > 0:
            return Response(
                {"error": f"Cannot delete category '{instance.name}' because it contains {product_count} product(s). Please reassign or delete the products first."},
                status=status.HTTP_400_BAD_REQUEST
            )
        self.perform_destroy(instance)
        return Response({"message": f"Category '{instance.name}' deleted successfully."}, status=status.HTTP_200_OK)

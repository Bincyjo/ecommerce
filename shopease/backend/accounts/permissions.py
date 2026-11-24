from rest_framework import permissions

class IsAdminUserRole(permissions.BasePermission):
    """
    Allows access only to users with the 'admin' role or staff/superuser.
    """
    message = "Administrator privileges are required to perform this action."

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            (request.user.role == 'admin' or request.user.is_staff or request.user.is_superuser)
        )

class IsCustomerUserRole(permissions.BasePermission):
    """
    Allows access only to authenticated users with the 'customer' role.
    """
    message = "Customer account is required to perform this action."

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == 'customer'
        )

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Read-only permissions for any request (or authenticated), write permissions for admins only.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(
            request.user and
            request.user.is_authenticated and
            (request.user.role == 'admin' or request.user.is_staff or request.user.is_superuser)
        )

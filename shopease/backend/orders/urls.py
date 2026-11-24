from django.urls import path
from .views import OrderListCreateView, OrderDetailView, OrderCompleteView, DashboardStatsView

urlpatterns = [
    path('', OrderListCreateView.as_view(), name='order_list_create'),
    path('dashboard-stats/', DashboardStatsView.as_view(), name='dashboard_stats'),
    path('<int:pk>/', OrderDetailView.as_view(), name='order_detail'),
    path('<int:pk>/complete/', OrderCompleteView.as_view(), name='order_complete'),
]

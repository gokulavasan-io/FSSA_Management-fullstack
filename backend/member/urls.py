from django.urls import path
from .views import (
    RoleListCreateAPIView,
    RoleRetrieveUpdateDestroyAPIView,
    MemberListCreateAPIView,
    MemberRetrieveUpdateDestroyAPIView
)

urlpatterns = [
    # Role
    path('roles/', RoleListCreateAPIView.as_view(), name='role-list-create'),
    path('roles/<int:pk>/', RoleRetrieveUpdateDestroyAPIView.as_view(), name='role-detail'),

    # Member
    path('members/', MemberListCreateAPIView.as_view(), name='member-list-create'),
    path('members/<int:pk>/', MemberRetrieveUpdateDestroyAPIView.as_view(), name='member-detail'),
]

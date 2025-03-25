from django.urls import path
from .views import *

urlpatterns = [
    path('roles/', RoleListCreateAPIView.as_view()),
    path('roles/<int:pk>/', RoleRetrieveUpdateDestroyAPIView.as_view()),

    path('', MemberListCreateAPIView.as_view()),
    path('<int:pk>/', MemberRetrieveUpdateDestroyAPIView.as_view()),
]
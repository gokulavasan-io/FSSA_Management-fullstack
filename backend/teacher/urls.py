from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RoleViewSet, MemberViewSet, UserInfoView

router = DefaultRouter()
router.register(r'roles', RoleViewSet)
router.register(r'members', MemberViewSet)  

urlpatterns = [
    path('', include(router.urls)),
    path('user-info/', UserInfoView.as_view()), 
]

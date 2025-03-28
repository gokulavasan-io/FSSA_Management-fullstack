from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'students', StudentViewSet)
router.register(r'sections', SectionViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('batches/', BatchListCreateView.as_view()),
    path('batches/<int:pk>/', BatchDetailView.as_view()),
    path('base-data-choices/', StudentBaseDataChoicesView.as_view()), 
]

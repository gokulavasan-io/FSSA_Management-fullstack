from django.urls import path
from .views import *

urlpatterns = [
    path('students/', StudentListCreateAPIView.as_view()),
    path('students/<int:pk>/', StudentRetrieveUpdateDeleteAPIView.as_view()),
    path('sections/', SectionListCreateAPIView.as_view()),
    path('sections/<int:pk>/', SectionRetrieveUpdateDeleteAPIView.as_view()),
    path('batches/', BatchListCreateView.as_view()),
    path('batches/<int:pk>/', BatchDetailView.as_view()),
    path('base-data-choices/', StudentBaseDataChoicesView.as_view()),
]

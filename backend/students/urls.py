from django.urls import path
from .views import *

urlpatterns = [
    path('students/', StudentListCreateAPIView.as_view(), name='student-list-create'),
    path('students/<int:pk>/', StudentRetrieveUpdateDeleteAPIView.as_view(), name='student-rud'),
    path('choices/', ChoicesAPIView.as_view(), name='choices'),
     path('sections/', SectionListCreateAPIView.as_view(), name='section-list-create'),
    path('sections/<int:pk>/', SectionRetrieveUpdateDeleteAPIView.as_view(), name='section-rud'),
     path('batches/', BatchListView.as_view(), name='batch-list'),        # GET
    path('batches/create/', BatchCreateView.as_view(), name='batch-create'),  # POST
    path('batches/<int:pk>/', BatchDetailView.as_view(), name='batch-detail'), 
]

from django.urls import path
from .views import *

urlpatterns = [
    path('months/',MonthListView.as_view()),
    path("subjects/",SubjectListCreateView.as_view()),
    path("subjects/<int:pk>/",SubjectRetrieveUpdateDeleteView.as_view()),
    path("test-details/",TestDetailListView.as_view()),
    path("test-details/<int:pk>/",TestDetailsRetrieveUpdateDestroyView.as_view()),
    path('tests/', TestCreateView.as_view()),
    path('tests/<int:test_detail_id>/', TestDataRetrieveUpdateView.as_view()),
    path('level-tests/<int:test_detail_id>/',LevelTestRetrieveUpdateView.as_view()),
    path("monthly-data/",MonthlyData.as_view()),
   
]
    
from django.urls import path
from .views import *

urlpatterns = [
    path('months/',MonthListView.as_view()),
    path("subjects/",SubjectListCreateView.as_view()),
    path("subjects/<int:subject_id>",SubjectRetrieveUpdateDeleteView.as_view()),
    path("test-details/",TestDetailListView.as_view()),
    path("test-details/<int:test_detail_id>",TestDetailsRetrieveUpdateDestroyView.as_view()),
    path('tests/', TestCreateView.as_view()),
    path('tests/<int:test_detail_id>/', TestDataRetrieveUpdateView.as_view()),
    path('level-tests/',LevelTestView.as_view()),
    path("monthly-data/",MonthlyData.as_view()),
   
]
    
from django.urls import path
from .views import StudentScoresByMonthView

urlpatterns = [
    path('scores/<int:month_id>/', StudentScoresByMonthView.as_view(), name='student_scores_by_month'),
]

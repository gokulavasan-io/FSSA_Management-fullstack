from django.urls import path
from .views import *

urlpatterns = [
    path('<int:month_id>/', MonthlyReportView.as_view(), name='student_scores_by_month'),
]


from django.urls import path
from .views import *

urlpatterns = [
    path("attendance-report/",AttendanceReport.as_view()),
    path("monthly-analytics/",MonthlyAnalytics.as_view()),
    path("subject-analytics/",SubjectAnalytics.as_view()),
    
]
from django.urls import path
from .views import *

urlpatterns = [
    path('attendance_data/', AttendanceView.as_view()),
    path('update_data/', BulkUpdateAttendanceView.as_view()),
]

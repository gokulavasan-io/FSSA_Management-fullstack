from django.urls import path
from .views import *

urlpatterns = [
    path('attendance_data/', AttendanceView.as_view()),
    path('update_data/', BulkUpdateAttendanceView.as_view()),
    path('add_remark/',AddOrUpdateRemarkView.as_view()),
    path('add_holiday/',AddOrUpdateHolidayView.as_view()),
    path('fetch_remarks/',FetchStudentsWithRemarksView.as_view()),
    path('fetch_holidays/',FetchHolidaysView.as_view()),
]



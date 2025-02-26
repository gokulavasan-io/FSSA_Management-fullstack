from django.urls import path
from .views import *

urlpatterns = [
    path('attendance_data/', AttendanceView.as_view()),
    path('update_data/', BulkUpdateAttendanceView.as_view()),
    path('add_remark/',AddOrUpdateRemarkView.as_view()),
    path('add_holiday/',AddOrUpdateHolidayView.as_view()),
    path('fetch_remarks/',FetchStudentsWithRemarksView.as_view()),
    path('fetch_holidays/',FetchHolidaysView.as_view()),
    path('check_holiday/',CheckHolidayView.as_view()),
    path('fetch_students_status_count/',AllStudentsStatusCountView.as_view()),
    path('fetch_daily_statistics/',DailyStatisticsView.as_view()),
]



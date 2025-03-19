from django.urls import path
from .views import *

urlpatterns = [
    path('attendance/', AttendanceView.as_view()),
    path('remarks/',RemarkView.as_view()),
    path('holidays/',HolidayView.as_view()),
    path('check_holiday/',CheckHolidayView.as_view()),
    path('fetch_student_statistics/',StudentStatistics.as_view()),
    path('fetch_daily_statistics/',DailyStatisticsView.as_view()),
     path('fetch_holidays/', HolidayListCreateView.as_view(), name='fetch_holidays'),
    path('fetch_holidays/<int:pk>/', HolidayRetrieveUpdateDeleteView.as_view(), name='fetch_holiday_detail'),
]



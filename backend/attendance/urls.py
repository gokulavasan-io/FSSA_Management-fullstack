from django.urls import path
from .views import *

urlpatterns = [
    path('attendance/', AttendanceView.as_view()),
    path('remarks/',RemarkView.as_view()),
    path('holidays/',HolidayView.as_view()),
    path('check-holiday/',CheckHolidayView.as_view()),
    path('student-statistics/',StudentStatistics.as_view()),
    path('daily-statistics/',DailyStatisticsView.as_view()),
    path('holidays-admin/', HolidayListCreateView.as_view()),
    path('holidays-admin/<int:pk>/', HolidayRetrieveUpdateDeleteView.as_view()),
]



from django.urls import path
from .views import *

urlpatterns = [
    path("attendance-report/",AttendanceReport.as_view(),name='sectionCreate'),
    
]
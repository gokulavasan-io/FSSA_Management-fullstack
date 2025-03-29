from django.contrib import admin
from django.urls import path,include

urlpatterns = [
    path('api/v1/students/', include("students.urls")),
    path('api/v1/marks/', include("marks.urls")),
    path('api/v1/attendance/', include("attendance.urls")),
    path('api/v1/members/', include("teacher.urls")),
    path('api/v1/home/', include("home.urls")),
    path('api/v1/monthly-report/', include("monthly_report.urls")),
    path('api/v1/auth/', include("authentication.urls")),
    
]
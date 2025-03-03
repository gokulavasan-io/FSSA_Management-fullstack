from django.contrib import admin
from django.urls import path,include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('students/', include("students.urls")),
    path('marks/', include("marks.urls")),
    path('attendance/', include("attendance.urls")),
    path('member/', include("member.urls")),
    path('home/', include("home.urls")),
    
]
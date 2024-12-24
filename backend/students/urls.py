from django.urls import path
from .views import *

urlpatterns = [
    path('studentsData/', StudentDataView.as_view()),
    path('studentsName/', StudentNamesView.as_view(),),
]


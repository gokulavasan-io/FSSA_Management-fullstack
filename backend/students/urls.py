from django.urls import path
from .views import *

urlpatterns = [
    path("section/",SectionCreateView.as_view()),
    path('students/', StudentCreateView.as_view(), name='student-create'),
]


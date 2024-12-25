
from django.urls import path
from .views import *

urlpatterns = [
    path("section/",SectionCreateView.as_view(),name='sectionCreate'),
    path('studentsData/', StudentsData.as_view(), name='studentsData'),
    path('studentsName/', StudentNamesView.as_view(), name='studentsName'),
]
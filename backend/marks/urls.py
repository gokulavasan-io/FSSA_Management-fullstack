from django.urls import path
from .views import *

urlpatterns = [
    path('add_mark/', AddTestAndMarksView.as_view(), name='add_test_and_marks'),
    path('fetch_test_names/', FetchTestNamesView.as_view(), name='fetch_test_names'),
]

from django.urls import path
from .views import AddTestAndMarksView

urlpatterns = [
    path('add_mark/', AddTestAndMarksView.as_view(), name='add_test_and_marks'),
]

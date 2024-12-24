from django.urls import path
from .views import MarkCreateView

urlpatterns = [
    path('new_mark/', MarkCreateView.as_view()),
]

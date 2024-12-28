from django.urls import path
from .views import *

urlpatterns = [
    path('chat_with_ai/', GenerateResponseView.as_view()),
    path('get_chat_data/', ChatData.as_view()),
    path('delete_chat_data/<int:id>/', DeleteChat.as_view()),
]

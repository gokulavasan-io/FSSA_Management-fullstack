from django.urls import path
from .views import *

urlpatterns = [
    path("google/", GoogleAuthView.as_view(), name="google-auth"),
    path("check-session/", CheckSessionView.as_view(), name="check_session"),
    path("logout/", LogoutView.as_view(), name="check_session"),
]

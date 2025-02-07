from django.urls import path
from .views import *

urlpatterns = [
    path("add_member/", MemberCreateView.as_view(), name="add-member"),
    path("members/", MemberListView.as_view(), name="member-list"),
    path("delete-member/<int:pk>/", MemberDeleteView.as_view(), name="delete-member"),
    path("verify/",FirebaseTokenVerifyView.as_view() ),
    
]

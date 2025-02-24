from django.urls import path
from .views import *

urlpatterns = [
    path("add_member/", MemberCreateView.as_view()),
    path("members/", MemberListView.as_view()),
    path("update_member/<int:id>/", MemberUpdateView.as_view()),
    path("delete_member/<int:id>/", MemberDeleteView.as_view()),
    path("verify/",FirebaseTokenVerifyView.as_view() ),
    path('roles/', RoleListView.as_view()),
    path('<int:id>/', MemberDetailView.as_view()),
]

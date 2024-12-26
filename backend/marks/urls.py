from django.urls import path
from .views import *

urlpatterns = [
    path('add_mark/', AddTestAndMarksView.as_view()),
    path('get_mark/<int:test_detail_id>/', GetTestAndMarksView.as_view()),
    path('update_mark/<int:test_detail_id>/', UpdateTestAndMarksView.as_view()),
    path('update_archive/<int:test_detail_id>/', UpdateArchiveStatusView.as_view()),
    path('get_all_test_data/', GetAllTestDataView.as_view()),
]

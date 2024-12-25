from django.urls import path
from .views import *

urlpatterns = [
    path('add_mark/', AddTestAndMarksView.as_view()),
    path('get_mark/', GetTestAndMarksView.as_view()),
    path('update_mark/', UpdateTestAndMarksView.as_view()),
    path('fetch_test_names/', FetchTestNamesView.as_view()),
    path('rename_test/', RenameTestView.as_view()),
    path('archive_status_change/', ChangeTestArchiveStatusView.as_view()),
]

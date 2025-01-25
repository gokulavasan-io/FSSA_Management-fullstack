from django.urls import path
from .views import *

urlpatterns = [
    # for test  marks
    path('add_mark/', AddTestAndMarksView.as_view()),
    path('get_mark/<int:test_detail_id>/', GetTestAndMarksView.as_view()),
    path('update_mark/<int:test_detail_id>/', UpdateTestAndMarksView.as_view()),
    
    # for levels - tests
    path('add_level_mark/', AddLevelTestView.as_view()),
    path('get_level_mark/<int:test_detail_id>/', GetLevelTestView.as_view()),
    path('update_level_mark/<int:test_detail_id>/', UpdateLevelTestView.as_view()),
    
    # for get all test data
    path('get_all_test_data/', GetAllTestDataView.as_view()),
]

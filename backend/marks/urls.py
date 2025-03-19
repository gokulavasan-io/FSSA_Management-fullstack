from django.urls import path
from .views import *

urlpatterns = [
    # for test  marks
    path('add_mark/', AddTestView.as_view()),
     path('tests/', TestDetailListCreateView.as_view(), name='test-list-create'),
    path('tests/<int:pk>/', TestDetailRetrieveUpdateDestroyView.as_view(), name='test-detail'),
    path('get_mark/<int:test_detail_id>/', GetTestAndMarksView.as_view()),
    path('update_mark/<int:test_detail_id>/', UpdateMarksView.as_view()),
    
    # for levels - tests
    path('get_level_mark/<int:test_detail_id>/', GetLevelTestView.as_view()),
    path('update_level_mark/<int:test_detail_id>/', UpdateLevelTestView.as_view()),
    
    # for get all test data
    path('get_all_test_data/', GetAllTestDataView.as_view()),
    path('get_all_test_details/', GetAllTestDetailsView.as_view()),
    
    # for get months and subject
    path('fetch_months/', MonthListView.as_view()),
    path('subjects/', SubjectListCreateView.as_view()),
    path('subjects/<int:pk>/', SubjectRetrieveUpdateDeleteView.as_view(), name='subject-detail'),
]
    
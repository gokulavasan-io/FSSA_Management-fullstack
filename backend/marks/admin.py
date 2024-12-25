from django.contrib import admin
from .models import *

class TestDetailAdmin(admin.ModelAdmin):
    list_display = ('test_name', 'section', 'subject', 'month', 'total_marks', 'created_at')
    search_fields = ('test_name', 'section__name', 'subject__subject_name', 'month__month_name')
    list_filter = ('section', 'month', 'subject')  

class MarksAdmin(admin.ModelAdmin):
    list_display = ('student', 'test_detail', 'mark', 'average_mark', 'remark')
    search_fields = ('students__name', 'test_detail__test_name', 'test_detail__subject__subject_name')
    list_filter = ('test_detail__section', 'test_detail__subject','test_detail')

admin.site.register(Month)
admin.site.register(Subject)
admin.site.register(TestDetail, TestDetailAdmin)
admin.site.register(Marks, MarksAdmin)

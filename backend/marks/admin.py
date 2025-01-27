from django.contrib import admin
from .models import *

class TestDetailAdmin(admin.ModelAdmin):
    list_display = ('test_name', 'subject', 'month', 'total_marks', 'created_at')
    search_fields = ('test_name', 'subject__subject_name', 'month__month_name')
    list_filter = ( 'month', 'subject')  


class MarksAdmin(admin.ModelAdmin):
    list_display = ('student_name', 'test_detail', 'mark', 'average_mark', 'remark')
    search_fields = ('student__name', 'test_detail__test_name', 'test_detail__subject__subject_name')
    list_filter = ('test_detail__subject', 'test_detail')

    @admin.display(description='Student Name')
    def student_name(self, obj):
        return obj.student.name  # Decrypted name

    @admin.display(description='Mark (100)')
    def average_mark(self, obj):
        decrypted_mark = obj.mark  # Decrypted mark
        if decrypted_mark == 'Absent':
            return 'Absent'

        if not decrypted_mark or not decrypted_mark.strip().isdigit():
            return "N/A"

        if obj.test_detail.total_marks:  
            return round((float(decrypted_mark) / float(obj.test_detail.total_marks)) * 100)  
        return "N/A"


    
admin.site.register(Month)
admin.site.register(Subject)
admin.site.register(TestDetail, TestDetailAdmin)
admin.site.register(Marks, MarksAdmin)

from django.contrib import admin
from .models import Mark, Subject, Month

class MarkAdmin(admin.ModelAdmin):
    list_display = ('student', 'subject', 'month', 'mark', 'remark', 'created_at')
    search_fields = ('student__name', 'subject__name', 'month__name')
    list_filter = ('subject', 'month')
    
    


admin.site.register(Mark, MarkAdmin)
admin.site.register(Subject)
admin.site.register(Month)

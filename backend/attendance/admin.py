from django.contrib import admin
from .models import Attendance, Status
from students.models import Students



class AttendanceAdmin(admin.ModelAdmin):
    # Fields to display in the admin list view
    list_display = ('student_name', 'date', 'status', 'remark')

    # Fields that are clickable links to the detail page
    list_display_links = ('student_name',)

    # Fields to filter by in the sidebar
    list_filter = ('date', 'status', 'student__section')

    # Fields to search by in the search bar
    search_fields = ('student__name', 'remark')

    # Custom method to display the student's name
    def student_name(self, obj):
        return obj.student.name  # Accessing the correct field in the Student model
    student_name.short_description = "Student Name"  # Label for the column
    
    # Custom method to display the status, handling None values
    def status(self, obj):
        return obj.status.status if obj.status else 'No Status'
    status.short_description = 'Status'

    # Optional: Ordering by date (descending)
    ordering = ('-date',)  # Descending order



class StatusAdmin(admin.ModelAdmin):
    # Fields to display in the admin list view
    list_display = ('id', 'status', 'short_form')
    search_fields = ('status',)

admin.site.register(Attendance, AttendanceAdmin)
admin.site.register(Status, StatusAdmin)
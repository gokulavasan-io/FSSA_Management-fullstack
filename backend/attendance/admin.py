# admin.py

from django.contrib import admin
from .models import Attendance, Status
from students.models import Students


@admin.register(Attendance)
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
        return obj.student.name  # Fixed: Accessing the correct field in the Student model
    student_name.short_description = "Student Name"  # Label for the column

    # Optional: Ordering by date
    ordering = ('-date',)  # Descending order


@admin.register(Status)
class StatusAdmin(admin.ModelAdmin):
    # Fields to display in the admin list view
    list_display = ('id', 'status','short_form')
    search_fields = ('status',)

# admin.py
from django.contrib import admin
from .models import *

class StudentsAdmin(admin.ModelAdmin):
    list_display = ('name', 'section', 'age', 'gender', 'category', 'medium', 'school')
    search_fields = ('name',)
    list_filter = ('section', 'gender', 'medium', 'school','category')
    

admin.site.register(Students, StudentsAdmin)

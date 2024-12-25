# admin.py
from django.contrib import admin
from .models import *

class StudentsAdmin(admin.ModelAdmin):
    list_display = ('name', 'section', 'age', 'gender', 'category', 'medium', 'school')
    search_fields = ('name',)
    list_filter = ('section', 'gender', 'medium', 'school','category','age')
    
class SectionAdmin(admin.ModelAdmin):
    list_display = ('name',)
    

admin.site.register(Section, SectionAdmin)
admin.site.register(Students, StudentsAdmin)

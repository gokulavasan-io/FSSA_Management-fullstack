from django.contrib import admin
from .models import Member, Role

@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ("id", "name")  # Display role ID and name
    search_fields = ("name",)  # Enable search for roles


@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "email", "role", "section", "is_admin", "created_at")  # Display all fields
    search_fields = ("name", "email", "role__name")  # Enable search by name, email, and role name
    list_filter = ("role", "section", "is_admin", "created_at")  # Filters for better data management
    ordering = ("-created_at",) 

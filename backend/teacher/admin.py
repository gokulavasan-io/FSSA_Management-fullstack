from django.contrib import admin
from .models import Role, Member

@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    search_fields = ("name",)

@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "email", "role", "section", "is_admin", "created_at")
    list_filter = ("role", "is_admin", "section")
    search_fields = ("name", "email")
    ordering = ("-created_at",)

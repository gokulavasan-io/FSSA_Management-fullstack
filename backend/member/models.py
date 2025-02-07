from django.db import models

class Member(models.Model):
    email = models.EmailField(unique=True)  # Only unique emails allowed
    name = models.CharField(max_length=255)
    role = models.CharField(max_length=50, choices=[("student", "Student"), ("teacher", "Teacher")])
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email

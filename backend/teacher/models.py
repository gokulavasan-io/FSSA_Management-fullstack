from django.db import models
from students.models import *
import base64

class Role(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name
    

class Member(models.Model):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    role = models.ForeignKey(Role, on_delete=models.CASCADE)
    section = models.ForeignKey(Section, on_delete=models.CASCADE)
    is_admin = models.BooleanField(default=False)
    image_link = models.TextField(null=True, blank=True)  
    created_at = models.DateTimeField(auto_now_add=True)
    
    @property
    def is_active(self):
        return True

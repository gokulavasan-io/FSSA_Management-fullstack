from django.db import models
from students.models import *
from .models import *


class Month(models.Model):
    name = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return self.name

class Subject(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name



class Mark(models.Model):
    student = models.ForeignKey(Students, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    month = models.ForeignKey(Month, on_delete=models.CASCADE)
    mark = models.DecimalField(max_digits=5, decimal_places=2, default=0) 
    remark = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)  

    def __str__(self):
        return f"{self.student.name} - {self.subject.name} ({self.month.name})"

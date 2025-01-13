from django.db import models
from students.models import *

class Status(models.Model):
    status = models.CharField(max_length=20, unique=True)
    short_form=models.CharField(max_length=8,unique=True,null=True)

    def __str__(self):
        return self.status



class Attendance(models.Model):
    student = models.ForeignKey(Students, on_delete=models.CASCADE, related_name='attendances')
    date = models.DateField()
    status = models.ForeignKey(Status, on_delete=models.CASCADE, null=True, blank=True)
    remark = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        indexes = [
            models.Index(fields=['date', 'remark']),
        ]

    def __str__(self):
        return f"{self.student.name} - {self.date} - {self.status.status if self.status else 'No Status'}"


class Holiday(models.Model):
    date = models.DateField()
    section = models.ForeignKey(Section, on_delete=models.CASCADE)
    reason = models.TextField()

    def __str__(self):
        return f"Holiday on {self.date} for Section {self.section.name}"
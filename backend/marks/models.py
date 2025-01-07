from django.db import models
from students.models import *


class Month(models.Model):
    month_name = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return self.month_name

class Subject(models.Model):
    subject_name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.subject_name


class TestDetail(models.Model):
    section = models.ForeignKey(Section, on_delete=models.CASCADE)
    test_name = models.CharField(max_length=100)
    month = models.ForeignKey(Month, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    total_marks = models.PositiveIntegerField()
    created_at = models.DateTimeField()
    about_test = models.CharField(max_length=500, null=True)
    isArchived = models.BooleanField(default=False)

    def __str__(self):
        month_str = self.month.strftime('%b') if hasattr(self.month, 'strftime') else str(self.month)[:3]
        return f"{self.test_name} - {month_str} ({self.subject})"

class Marks(models.Model):
    student = models.ForeignKey(Students, on_delete=models.CASCADE)
    mark = models.CharField(max_length=255, blank=True, null=True)
    remark = models.CharField(max_length=255, blank=True, null=True)
    test_detail = models.ForeignKey(TestDetail, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.student.name}: {self.mark}/{self.test_detail.total_marks}"

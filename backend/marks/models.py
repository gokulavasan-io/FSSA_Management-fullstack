from django.db import models
from students.models import *


class Month(models.Model):
    month_name = models.CharField(max_length=20, unique=True)  # E.g., 'January', 'February', etc.

    def __str__(self):
        return self.month_name

class Subject(models.Model):
    subject_name = models.CharField(max_length=50, unique=True)  # E.g., 'Mathematics', 'English', etc.

    def __str__(self):
        return self.subject_name


class TestDetail(models.Model):
    section = models.ForeignKey(Section, on_delete=models.CASCADE)  # Relationship to Section
    test_name = models.CharField(max_length=100)  # Name of the test
    month = models.ForeignKey(Month, on_delete=models.CASCADE)  # Relationship to Month
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)  # Relationship to Subject
    total_marks = models.PositiveIntegerField()  # Maximum marks of the test
    created_at = models.DateTimeField(auto_now_add=True)  # Timestamp when the test was created
    isArchived = models.BooleanField(default=False)

    def __str__(self):
        month_str = self.month.strftime('%b') if hasattr(self.month, 'strftime') else str(self.month)[:3]
        return f"{self.test_name} - {month_str} ({self.subject})"

class Marks(models.Model):
    student = models.ForeignKey(Students, on_delete=models.CASCADE)  # Relationship to School (Student)
    mark = models.CharField(max_length=255, blank=True, null=True)  # Marks scored in the test
    average_mark = models.CharField(max_length=255, blank=True, null=True) # Average marks of the student
    remark = models.CharField(max_length=255, blank=True, null=True)  # Optional remark about the student
    test_detail = models.ForeignKey(TestDetail, on_delete=models.CASCADE)  # Relationship to TestDetail

    def __str__(self):
        return f"{self.student.name}: {self.mark}/{self.test_detail.total_marks}"


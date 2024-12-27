from rest_framework import serializers
from .models import *

class StudentMarkSerializer(serializers.Serializer):
    student_name = serializers.CharField(max_length=100)
    mark = serializers.CharField(max_length=255, required=False, allow_blank=True)
    average_mark = serializers.CharField(max_length=255, required=False, allow_blank=True)
    remark = serializers.CharField(max_length=255, required=False, allow_blank=True)  # Allow blank remarks


class AddTestAndMarksSerializer(serializers.Serializer):
    test_name = serializers.CharField(max_length=100)
    section = serializers.CharField(max_length=10)
    month = serializers.CharField(max_length=20)
    subject = serializers.CharField(max_length=50)
    total_marks = serializers.IntegerField()
    students = StudentMarkSerializer(many=True)
    isArchived = serializers.BooleanField(default=False)
    created_at = serializers.DateTimeField(required=False)  

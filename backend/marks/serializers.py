from rest_framework import serializers
from .models import *

class StudentMarkSerializer(serializers.Serializer):
    student_name = serializers.CharField(max_length=100)
    mark = serializers.FloatField()
    average_mark = serializers.FloatField()
    remark = serializers.CharField(max_length=255, required=False)

class AddTestAndMarksSerializer(serializers.Serializer):
    test_name = serializers.CharField(max_length=100)
    section = serializers.CharField(max_length=10)
    month = serializers.CharField(max_length=20)
    subject = serializers.CharField(max_length=50)
    total_marks = serializers.IntegerField()
    students = StudentMarkSerializer(many=True)

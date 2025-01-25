from rest_framework import serializers
from .models import *

class StudentMarkSerializer(serializers.Serializer):
    student_name = serializers.CharField(max_length=100)
    mark = serializers.CharField(max_length=255, required=False, allow_blank=True,allow_null=True)
    remark = serializers.CharField(max_length=255, required=False, allow_blank=True)  
    level = serializers.CharField(max_length=10, required=False, allow_blank=True,allow_null=True)


class AddTestAndMarksSerializer(serializers.Serializer):
    test_name = serializers.CharField(max_length=100)
    month = serializers.CharField(max_length=20)
    year = serializers.IntegerField()
    subject = serializers.CharField(max_length=50)
    total_marks = serializers.IntegerField()
    about_test = serializers.CharField(max_length=500, allow_blank=True, required=False)
    created_at = serializers.DateTimeField(required=False)
    isLevelTest = serializers.BooleanField(default=False)

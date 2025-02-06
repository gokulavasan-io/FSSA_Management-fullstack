from rest_framework import serializers
from .models import *

class StudentMarkSerializer(serializers.Serializer):
    student_id = serializers.IntegerField()
    mark = serializers.CharField(max_length=255, required=False, allow_blank=True,allow_null=True)
    remark = serializers.CharField(max_length=255, required=False, allow_blank=True, allow_null=True)  
    

class StudentLevelMarkSerializer(serializers.Serializer):
    student_id = serializers.CharField()
    level = serializers.CharField(allow_blank=True, required=False, allow_null=True)
    remark = serializers.CharField(allow_blank=True, required=False, allow_null=True)


class UpdateLevelMarkSerializer(serializers.Serializer):
    studentsMark = StudentLevelMarkSerializer(many=True)
    
    
class UpdateMarksSerializer(serializers.Serializer):
    studentsMark = StudentMarkSerializer(many=True)
    

class AddTestAndMarksSerializer(serializers.Serializer):
    test_name = serializers.CharField(max_length=100)
    month=serializers.IntegerField()
    batch = serializers.IntegerField()
    subject = serializers.IntegerField()
    total_marks = serializers.IntegerField()
    about_test = serializers.CharField(max_length=500, allow_blank=True, required=False)
    created_at = serializers.DateTimeField(required=False)
    isLevelTest = serializers.BooleanField(default=False)


class UpdateTestDetailSerializer(serializers.Serializer):
    test_name = serializers.CharField(max_length=100)
    batch = serializers.IntegerField()
    subject = serializers.IntegerField()
    total_marks = serializers.IntegerField()
    about_test = serializers.CharField(max_length=500, allow_blank=True, required=False)
    created_at = serializers.DateTimeField(required=False)
    isLevelTest = serializers.BooleanField(default=False)
    
    


class MonthSerializer(serializers.ModelSerializer):
    class Meta:
        model = Month
        fields = ['id', 'month_name']

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'subject_name']

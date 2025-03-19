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
    

class TestDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestDetail
        fields = '__all__'

    def to_representation(self, instance):
        data = super().to_representation(instance)

        data['month'] = {
            "id": instance.month.id, 
            "name": instance.month.month_name
        } if instance.month else None

        data['subject'] = {
            "id": instance.subject.id, 
            "name": instance.subject.subject_name
        } if instance.subject else None

        return data
    

class MonthSerializer(serializers.ModelSerializer):
    class Meta:
        model = Month
        fields = ['id', 'month_name']

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'subject_name']

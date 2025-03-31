from rest_framework import serializers
from .models import *

class StudentMarkSerializer(serializers.Serializer):
    model=Marks
    fields='__all__'
    

class StudentLevelMarkSerializer(serializers.Serializer):
    model=TestLevels
    fields='__all__'



class TestDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestDetail
        fields = '__all__'

    def to_representation(self, instance):                   # ref:   https://testdriven.io/blog/drf-serializers/#to_representation
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

from rest_framework import serializers
from .models import *


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Students
        fields = ['id', 'name', 'section', 'age', 'gender', 'category', 'medium', 'school']
        
class StudentNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Students
        fields = ['name'] 
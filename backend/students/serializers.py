from rest_framework import serializers
from .models import *

class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = ["id", "name"]

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Students
        fields = "__all__"

class ChoiceSerializer(serializers.Serializer):
    value = serializers.CharField()
    label = serializers.CharField()

class BatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Batch
        fields = ["id", "batch_no"]

class ChoicesAPIResponseSerializer(serializers.Serializer):
    categories = ChoiceSerializer(many=True)
    mediums = ChoiceSerializer(many=True)
    schools = ChoiceSerializer(many=True)
    genders = ChoiceSerializer(many=True)  
    batches = BatchSerializer(many=True)
    sections = SectionSerializer(many=True)


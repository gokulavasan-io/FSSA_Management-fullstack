from rest_framework import serializers
from .models import *

class PromptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prompt
        fields = ['id', 'prompt', 'created_at']

class AiResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = AiResponse
        fields = ['id', 'prompt', 'answer', 'created_at']

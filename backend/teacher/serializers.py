from rest_framework import serializers
from .models import *
from students.models import Section 
import base64


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = '__all__'


class MemberSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    section_name = serializers.CharField(source='section.name', read_only=True)
    role_name = serializers.CharField(source='role.name', read_only=True)
    
    class Meta:
        model = Member
        fields = '__all__'

    def get_image(self, obj):
        """Convert BLOB to base64 for API responses"""
        if obj.image:
            return base64.b64encode(obj.image).decode('utf-8')
        return None

    def create(self, validated_data):
        """Handle base64 image during object creation"""
        image_data = self.context['request'].data.get('image')
        if image_data:
            validated_data['image'] = base64.b64decode(image_data)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        """Handle base64 image during object update"""
        image_data = self.context['request'].data.get('image')
        if image_data:
            instance.image = base64.b64decode(image_data)
        return super().update(instance, validated_data)

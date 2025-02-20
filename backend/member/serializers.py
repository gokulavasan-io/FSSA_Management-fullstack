from rest_framework import serializers
from validate_email_address import validate_email
from .models import *
import re

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ["id","name"]


class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = ["id", "name"]

class MemberSerializer(serializers.ModelSerializer):
    role = RoleSerializer(read_only=True) 
    section = SectionSerializer(read_only=True) 
    
    class Meta:
        model = Member
        fields = "__all__"

    def validate_email(self, value):
        if not validate_email(value):
            raise serializers.ValidationError("Invalid email address.")
        return value

    def validate_name(self, value):
        value = value.strip()
        
        if not value:
            raise serializers.ValidationError("Name cannot be empty.")
        
        if not any(char.isalpha() for char in value):
            raise serializers.ValidationError("Name must contain at least one letter.")
        
        if not re.match(r"^[A-Za-z\s]+$", value):
            raise serializers.ValidationError("Name must contain only letters and spaces.")
        
        if len(value) < 3:
            raise serializers.ValidationError("Name must be at least 3 characters long.")

        return value



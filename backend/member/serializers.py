from rest_framework import serializers
from validate_email_address import validate_email
from .models import *
import re

class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = "__all__"

    def validate_email(self, value):
        if not validate_email(value, check_mx=True):
            raise serializers.ValidationError("Invalid email address.")
        return value

    def validate_name(self, value):
        value = value.strip()
        
        # Check if the name is empty
        if not value:
            raise serializers.ValidationError("Name cannot be empty.")
        
        # Ensure it contains at least one letter
        if not any(char.isalpha() for char in value):
            raise serializers.ValidationError("Name must contain at least one letter.")

        # Ensure it only contains letters and spaces
        if not re.match(r"^[A-Za-z\s]+$", value):
            raise serializers.ValidationError("Name must contain only letters and spaces.")
        
        # Ensure the length is at least 3 characters
        if len(value) < 3:
            raise serializers.ValidationError("Name must be at least 3 characters long.")

        return value


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['id', 'name']


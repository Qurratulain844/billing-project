from django.contrib.auth.models import User
from rest_framework import serializers


class UpdateAccountSerializer(serializers.Serializer):
    username = serializers.CharField(required=False)
    old_password = serializers.CharField(required=False)
    new_password = serializers.CharField(required=False)

    def validate(self, data):
        user = self.context['request'].user

        # If changing password, old password must be correct
        if data.get("new_password"):
            if not data.get("old_password"):
                raise serializers.ValidationError(
                    {"old_password": "Old password is required to change password."}
                )

            if not user.check_password(data.get("old_password")):
                raise serializers.ValidationError(
                    {"old_password": "Old password is incorrect."}
                )

        return data

    def save(self, **kwargs):
        user = self.context['request'].user

        # Update username if provided
        if self.validated_data.get("username"):
            user.username = self.validated_data.get("username")

        # Update password if provided
        if self.validated_data.get("new_password"):
            user.set_password(self.validated_data.get("new_password"))

        user.save()
        return user
    

    
from rest_framework import serializers
from .models import Company

class CompanySerializer(serializers.ModelSerializer):

    class Meta:
        model = Company
        fields = "__all__"

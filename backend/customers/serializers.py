from rest_framework import serializers
from .models import Customer

class CustomerSerializer(serializers.ModelSerializer):
    total_due = serializers.ReadOnlyField()

    class Meta:
        model = Customer
        fields = '__all__'

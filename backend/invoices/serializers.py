from rest_framework import serializers
from django.db import transaction
from .models import Invoice, InvoiceItem


class InvoiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceItem
        exclude = ["invoice"] 
        


class InvoiceSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source="customer.name", read_only=True)
    items = InvoiceItemSerializer(many=True)
    
    class Meta:
        model = Invoice
        fields = "__all__"
        read_only_fields = ['invoice_number', 'subtotal', 'gst_amount', 'total_amount']
    
    def create(self, validated_data):
        items_data = validated_data.pop('items')

        with transaction.atomic():

            invoice = Invoice.objects.create(**validated_data)

            for item_data in items_data:
                InvoiceItem.objects.create(
                    invoice=invoice,
                    **item_data
                )

        return invoice



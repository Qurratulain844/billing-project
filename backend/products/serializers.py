from rest_framework import serializers
from .models import Product, ProductVariant
from invoices.models import InvoiceItem


from rest_framework import serializers
from .models import Product, ProductVariant


class ProductVariantSerializer(serializers.ModelSerializer):
    display_name = serializers.SerializerMethodField()

    class Meta:
        model = ProductVariant
        fields = "__all__"

    def get_display_name(self, obj):
        return f"{obj.product.name} - {obj.thickness_mm}mm - {obj.length_ft}x{obj.width_ft}"


class ProductSerializer(serializers.ModelSerializer):
    variants = ProductVariantSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = ["id", "name", "hsn_code", "variants"]


class InvoiceItemSerializer(serializers.ModelSerializer):
    product_variant_name = serializers.CharField(
        source="product_variant.display_name",
        read_only=True
    )

    class Meta:
        model = InvoiceItem
        fields = "__all__"


    # def create(self, validated_data):
    #     variants_data = validated_data.pop('variants')
    #     product = Product.objects.create(**validated_data)

    #     for variant_data in variants_data:
    #         ProductVariant.objects.create(
    #             product=product,
    #             **variant_data
    #         )

    #     return product
# def get_display_name(self, obj):
#         return f"{obj.product.name} - {obj.thickness_mm}mm - {obj.length_ft}x{obj.width_ft}"
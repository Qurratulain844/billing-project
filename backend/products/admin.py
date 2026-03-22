from django.contrib import admin
from .models import Product, ProductVariant


# Inline for ProductVariant inside Product
class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 1
    fields = (
        "thickness_mm",
        "length_ft",
        "width_ft",
        "price_type",
        "price",
        "stock_sheets",
        "minimum_stock",
    )


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "hsn_code")
    search_fields = ("name", "hsn_code")
    inlines = [ProductVariantInline]


@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
    list_display = (
        "product",
        "thickness_mm",
        "size_display",
        "price_type",
        "price",
        "stock_sheets",
        "stock_status_display",
    )

    list_filter = ("product", "price_type")
    search_fields = ("product__name",)

    # Display size like 8x4
    @admin.display(description="Size (ft)")
    def size_display(self, obj):
        return f"{obj.length_ft} x {obj.width_ft}"

    # Dynamic stock status
    @admin.display(description="Stock Status")
    def stock_status_display(self, obj):
        if obj.stock_sheets <= 0:
            return "Out of Stock"
        elif obj.stock_sheets <= obj.minimum_stock:
            return "Low Stock"
        return "In Stock"

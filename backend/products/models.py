from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=50)
    hsn_code = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class ProductVariant(models.Model):

    PRICE_TYPE_CHOICES = (
        ("SHEET", "Per Sheet"),
        ("SQFT", "Per Square Feet"),
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="variants"
    )
    thickness_mm = models.DecimalField(max_digits=5, decimal_places=2)
    length_ft = models.DecimalField(max_digits=5, decimal_places=2)
    width_ft = models.DecimalField(max_digits=5, decimal_places=2)

    price_type = models.CharField(
        max_length=10,
        choices=PRICE_TYPE_CHOICES,
        default="SHEET"
    )
    
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock_sheets = models.PositiveIntegerField(default=0)
    minimum_stock = models.PositiveIntegerField(default=50)
    stock_status = models.CharField(max_length=100, editable=False)

    def size_sqft(self):
        return self.length_ft * self.width_ft
    
    def save(self, *args, **kwargs):
        # Update stock status
        if self.stock_sheets <= 0:
            self.stock_status = "Out of Stock"
        elif self.stock_sheets <= self.minimum_stock:
            self.stock_status = "Low Stock"
        else:
            self.stock_status = "In Stock"

        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.product.name} - {self.thickness_mm}mm - {self.length_ft}x{self.width_ft}"

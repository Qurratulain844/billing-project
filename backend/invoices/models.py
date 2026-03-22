from django.db import models, transaction
from django.utils import timezone
from decimal import Decimal
from django.core.exceptions import ValidationError
from customers.models import Customer
from products.models import ProductVariant


class Invoice(models.Model):
    STATUS_CHOICES = (
        ("PAID", "Paid"),
        ("PARTIAL", "Partial"),
        ("UNPAID", "Unpaid"),
    )

    invoice_number = models.CharField(max_length=20, unique=True, blank=True, editable=False)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    date = models.DateTimeField(default=timezone.now)

    gst_percent = models.DecimalField(max_digits=5, decimal_places=2, default=18)
    paid_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0, editable=False)
    gst_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0, editable=False)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0, editable=False)
    payment_status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="UNPAID", editable=False)
    note = models.TextField(blank=True)

    def save(self, *args, **kwargs):
        if not self.invoice_number:
            with transaction.atomic():
                last_invoice = (
                    Invoice.objects
                    .filter(invoice_number__startswith="INV-")
                    .order_by('-id')
                    .first()
                )
                if last_invoice:
                    try:
                        last_number = int(last_invoice.invoice_number.split('-')[1])
                    except (IndexError, ValueError):
                        last_number = 0
                    new_number = last_number + 1
                else:
                    new_number = 1
                self.invoice_number = f"INV-{new_number:04d}"

        super().save(*args, **kwargs)

    def update_totals(self):
        subtotal = sum(item.total for item in self.items.all())
        gst_amount = (subtotal * Decimal(self.gst_percent)) / Decimal(100)
        total_amount = subtotal + gst_amount

        if self.paid_amount == 0:
            payment_status = "UNPAID"
        elif self.paid_amount < total_amount:
            payment_status = "PARTIAL"
        else:
            payment_status = "PAID"

        Invoice.objects.filter(pk=self.pk).update(
            subtotal=subtotal,
            gst_amount=gst_amount,
            total_amount=total_amount,
            payment_status=payment_status
        )

        # super().save(*args, **kwargs)


class InvoiceItem(models.Model):
    invoice = models.ForeignKey(
        Invoice,
        on_delete=models.CASCADE,
        related_name="items"
    )

    product_variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0, editable=False)
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0, editable=False)

    def save(self, *args, **kwargs):
        with transaction.atomic():
            variant = self.product_variant

            # Restore old stock if updating
            if self.pk:
                old_item = InvoiceItem.objects.get(pk=self.pk)
                variant.stock_sheets += old_item.quantity

            # Check stock availability
            if variant.stock_sheets < self.quantity:
                raise ValidationError("Not enough stock available.")

            # Pricing logic
            if variant.price_type == "SHEET":
                self.price = variant.price
                self.total = self.price * self.quantity
            elif variant.price_type == "SQFT":
                sqft = variant.size_sqft()
                self.price = variant.price
                self.total = Decimal(self.price) * Decimal(sqft) * Decimal(self.quantity)

            # Deduct stock
            variant.stock_sheets -= self.quantity
            variant.save()

            super().save(*args, **kwargs)

            # Update parent invoice totals
            # self.invoice.save()
            self.invoice.update_totals()


# def save(self, *args, **kwargs):

#     with transaction.atomic():

#         variant = self.product_variant

#         # Restore stock if updating existing item
#         if self.pk:
#             old_item = InvoiceItem.objects.get(pk=self.pk)
#             variant.stock_sheets += old_item.quantity

#         # Check stock
#         if variant.stock_sheets < self.quantity:
#             raise ValidationError("Not enough stock available.")

#         qty = Decimal(self.quantity)

#         # ---------- PRICE CALCULATION ----------

#         if variant.price_type == "SHEET":

#             # price per sheet
#             self.price = Decimal(variant.price)
#             self.total = self.price * qty

#         elif variant.price_type == "SQFT":

#             # price per sqft
#             sqft = Decimal(variant.size_sqft())

#             self.price = Decimal(variant.price)

#             self.total = self.price * sqft * qty

#         else:
#             raise ValidationError("Invalid price type")

#         # ---------- STOCK DEDUCTION ----------

#         variant.stock_sheets -= self.quantity
#         variant.save()

#         super().save(*args, **kwargs)

#         # ---------- UPDATE INVOICE TOTALS ----------

#         self.invoice.update_totals()
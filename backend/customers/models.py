from django.db import models

# Create your models here.
from django.db import models
from django.db.models import Sum, F, DecimalField
from django.db.models.functions import Coalesce

class Customer(models.Model):
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    address = models.TextField(blank=True)
    gst_number = models.CharField(max_length=20, blank=True, null=True)

    @property
    def total_due(self):
        from invoices.models import Invoice

        return Invoice.objects.filter(customer=self).aggregate(
            total=Coalesce(
                Sum(F('total_amount') - F('paid_amount')),
                0,
                output_field=DecimalField()
            )
        )['total']

    def __str__(self):
        return self.name


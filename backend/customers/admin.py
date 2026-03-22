from django.contrib import admin
from .models import Customer


class InvoiceAdmin(admin.ModelAdmin):
    list_display = ["name", "phone","address","gst_number", "total_due"]
    
    
admin.site.register(Customer, InvoiceAdmin)
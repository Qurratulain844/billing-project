# from django.contrib import admin
# from .models import Invoice, InvoiceItem


# class InvoiceItemInline(admin.TabularInline):
#     model = InvoiceItem
#     extra = 1  # how many empty rows to show


# @admin.register(Invoice)
# class InvoiceAdmin(admin.ModelAdmin):
    # inlines = [InvoiceItemInline]
    # list_display = ['id','invoice_number', 'customer','subtotal','gst_percent', 'gst_amount', 'total_amount','paid_amount', 'payment_status',]
    # search_fields = ('invoice_number', 'customer__name', 'note')
    # list_filter = ('payment_status', 'date')
from django.contrib import admin
from .models import Invoice, InvoiceItem


class InvoiceItemInline(admin.TabularInline):
    model = InvoiceItem
    extra = 1


@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    inlines = [InvoiceItemInline]
    list_display = ['id','invoice_number', 'customer','subtotal','gst_percent', 'gst_amount', 'total_amount','paid_amount', 'payment_status',]
    search_fields = ('invoice_number', 'customer__name', 'note')
    list_filter = ('payment_status', 'date')

    def save_related(self, request, form, formsets, change):
        super().save_related(request, form, formsets, change)
        form.instance.update_totals()
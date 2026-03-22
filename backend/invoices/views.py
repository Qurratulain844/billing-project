from django.shortcuts import render
from django.http import HttpResponse
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.pagesizes import A4
from reportlab.platypus import Paragraph
# from reportlab.lib.styles import ParagraphStyle
# from reportlab.pdfbase.ttfonts import TTFont
# from reportlab.pdfbase import pdfmetrics
# from django.shortcuts import get_object_or_404
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny

# Create your views here.
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Invoice
from .serializers import InvoiceSerializer

class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all().order_by('-id')
    serializer_class = InvoiceSerializer
    permission_classes = [IsAuthenticated]
        
    @action(detail=True, methods=["get"], permission_classes=[AllowAny])
    def pdf(self, request, pk=None):
        invoice = self.get_object()

        response = HttpResponse(content_type="application/pdf")
        response["Content-Disposition"] = (
            f'attachment; filename="Invoice_{invoice.invoice_number}.pdf"'
        )

        doc = SimpleDocTemplate(response, pagesize=A4)
        elements = []
        styles = getSampleStyleSheet()

        elements.append(Paragraph(
            f"INVOICE - {invoice.invoice_number}",
            styles["Title"]
        ))
        elements.append(Spacer(1, 0.5 * inch))

        elements.append(Paragraph(
            f"Customer: {invoice.customer.name}",
            styles["Normal"]
        ))
        elements.append(Paragraph(
            f"Phone: {invoice.customer.phone}",
            styles["Normal"]
        ))
        elements.append(Spacer(1, 0.5 * inch))
        if invoice.note:
            elements.append(Paragraph("<b>Note:</b>", styles["Heading3"]))
            elements.append(Spacer(1, 0.2 * inch))
            elements.append(Paragraph(invoice.note, styles["Normal"]))
        data = [["Product", "Quantity", "Price", "Total"]]

        for item in invoice.items.all():
            data.append([
                str(item.product_variant),
                item.quantity,
                item.price,
                item.total
            ])

        # Add summary rows
        data.append(["", "", "Subtotal", invoice.subtotal])
        data.append(["", "", f"GST ({invoice.gst_percent}%)", invoice.gst_amount])
        data.append(["", "", "Grand Total", invoice.total_amount])
        data.append(["", "", "Paid", invoice.paid_amount])
        data.append(["", "", "Payment Status", invoice.payment_status])

        table = Table(data, colWidths=[2.5 * inch, 1 * inch, 1 * inch, 1 * inch])
        table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.lightgrey),
            ("GRID", (0, 0), (-1, -1), 1, colors.black),
            ("ALIGN", (1, 1), (-1, -1), "CENTER"),
        ]))

        elements.append(table)

        doc.build(elements)
        return response
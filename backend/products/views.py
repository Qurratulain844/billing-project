from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from .models import Product, ProductVariant
from .serializers import ProductSerializer, ProductVariantSerializer
from rest_framework.response import Response
from django.db.models import F
from rest_framework.decorators import action

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('-id')
    serializer_class = ProductSerializer
    permission_classes = [AllowAny, ]


class ProductVariantViewSet(viewsets.ModelViewSet):
    queryset = ProductVariant.objects.all().order_by('-id')
    serializer_class = ProductVariantSerializer
    permission_classes = [IsAuthenticated]


    @action(detail=False, methods=["get"])
    def low_stock(self, request):
        variants = ProductVariant.objects.filter(
            stock_sheets__lte=F("minimum_stock")
        )
        serializer = self.get_serializer(variants, many=True)
        return Response(serializer.data)
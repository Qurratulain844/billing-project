from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from .serializers import UpdateAccountSerializer
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework import status

from .models import Company
from .serializers import CompanySerializer
from rest_framework.parsers import MultiPartParser, FormParser

class UpdateAccountView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = UpdateAccountSerializer(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Account updated successfully"})


class LoginView(APIView):

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)

        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                "token": token.key,
                "message": "Login successful"
            })

        return Response(
            {"error": "Invalid credentials"},
            status=status.HTTP_401_UNAUTHORIZED
        )
class LogoutView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.user.auth_token.delete()
        return Response({"message": "Logged out successfully"})


class CompanySettingsView(APIView):

    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request):

        company = Company.objects.first()

        if not company:
            return Response({})

        serializer = CompanySerializer(company)
        return Response(serializer.data)

    def post(self, request):

        company = Company.objects.first()

        if company:
            serializer = CompanySerializer(company, data=request.data)
        else:
            serializer = CompanySerializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)
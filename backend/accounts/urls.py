from django.urls import path
from .views import UpdateAccountView, LoginView,LogoutView

from .views import CompanySettingsView

urlpatterns = [
    path("login/", LoginView.as_view()),
    path("logout/", LogoutView.as_view()),
    path("settings/", UpdateAccountView.as_view()),

    path("company/", CompanySettingsView.as_view()),

]
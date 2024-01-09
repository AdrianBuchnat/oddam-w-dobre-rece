from django.shortcuts import render
from django.views import View


# Create your views here.
class IndexView(View):
    def get(self, request):
        return render(request, "charity_donation/index.html")


class MainFormView(View):
    def get(self, request):
        return render(request, "charity_donation/form.html")


class RegisterView(View):
    def get(self, request):
        return render(request, "charity_donation/register.html")


class LoginView(View):
    def get(self, request):
        return render(request, "charity_donation/login.html")


class FormConfirmationView(View):
    def get(self, request):
        return render(request, "charity_donation/form-confirmation.html")
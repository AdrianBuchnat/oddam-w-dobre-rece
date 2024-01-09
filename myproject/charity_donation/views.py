from django.shortcuts import render
from django.views import View
from .models import Institution, Donation, Category


# Create your views here.
class IndexView(View):
    def get(self, request):

        institutions = Institution.objects.all()
        donations = Donation.objects.all()

        organistaion_supported = set()
        quantity_of_bags = 0
        for donation in donations:
            quantity_of_bags += donation.quantity
            organistaion_supported.add(donation.user)

        ctx = {
            'instituions': institutions,
            'quantity_of_bags': quantity_of_bags,
            'organistaion_supported': len(organistaion_supported),
        }

        return render(request, "charity_donation/index.html", ctx)


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
from django.shortcuts import render, redirect
from django.views import View
from .models import Institution, Donation, Category
from .forms import UserCreationForm
from django.contrib.auth import authenticate, login, logout


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

    def post(self, request):
        form = UserCreationForm(request.POST)

        if form.is_valid():
            form.save()
            return redirect("LoginPage")
        else:
            form = UserCreationForm()
            return render(request, "charity_donation/register.html")


class LoginView(View):
    def get(self, request):
        return render(request, "charity_donation/login.html")
    
    def post(self, request):
        email = request.POST["email"]
        password = request.POST["password"]
        user = authenticate(request, email=email, password=password)
        if user is not None:
            login(request, user)
            return redirect('MainPage')
        else:
            return redirect('RegisterPage')
    


class FormConfirmationView(View):
    def get(self, request):
        return render(request, "charity_donation/form-confirmation.html")
    

def logout_view(request):
    logout(request)
    return redirect('MainPage')
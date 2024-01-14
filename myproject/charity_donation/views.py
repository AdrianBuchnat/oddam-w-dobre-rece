from django.shortcuts import render, redirect
from django.views import View
from .models import Institution, Donation, Category
from .forms import UserCreationForm
from django.contrib.auth import authenticate, login, logout
from django.core import serializers
from django.db.models import Count, Sum


# Create your views here.
class IndexView(View):
    def get(self, request):

        institutions = Institution.objects.all()

        quantity_of_bags = Donation.objects.aggregate(Sum("quantity"))  # anotate agregate
        organistaion_supported = [org['institution_id'] for org in Donation.objects.values('institution_id').annotate(total=Count('institution_id'))]

        ctx = {
            'instituions': institutions,
            'quantity_of_bags': quantity_of_bags['quantity__sum'],
            'organistaion_supported': len(organistaion_supported),
        }

        return render(request, "charity_donation/index.html", ctx)


class MainFormView(View):
    def get(self, request):
        if request.user.is_authenticated: 
            categories = Category.objects.all()
            institutions = Institution.objects.all()
            institutionsJSON = serializers.serialize('json', Institution.objects.all())

            ctx = {
                'categories': categories,
                'instituions': institutions,
                'institutionsJSON': institutionsJSON,
            }

            return render(request, "charity_donation/form.html", ctx)
        else:
            return redirect('LoginPage')



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
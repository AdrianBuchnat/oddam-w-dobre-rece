from django.shortcuts import render, redirect, get_object_or_404
from django.views import View
from .models import Institution, Donation, Category
from .forms import UserCreationForm, DonationForm
from django.contrib.auth import authenticate, login, logout
from django.core import serializers
from django.db.models import Sum
from django.http import JsonResponse



# Create your views here.
class IndexView(View):
    def get(self, request):

        institutions = Institution.objects.all()

        quantity_of_bags = Donation.objects.aggregate(Sum("quantity"))  # anotate agregate
        organistaion_supported_distninct = Donation.objects.values('institution_id').distinct().count()
        
        # Donation.objects.distinct("institution_id").count()
        # Donation.objects.values('institution_id').distinct().count()
        

        ctx = {
            'instituions': institutions,
            'quantity_of_bags': quantity_of_bags['quantity__sum'],
            'organistaion_supported': organistaion_supported_distninct,
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
    
    def post(self, request):
        form = DonationForm(request.POST)
        if form.is_valid():
            donation = form.save(commit=False)
            donation.user = request.user
            donation.save()
            return JsonResponse({'massage': 'Data send succesful!'})
        else:
            return JsonResponse({'massage': 'Something goes wrong, try again.'})


def logout_view(request):
    logout(request)
    return redirect('MainPage')

class UserPanelView(View):
    def get(self, request):
        if request.user.is_anonymous:
            return redirect('LoginPage')
        else:
            donations = Donation.objects.filter(user_id=request.user).order_by('is_taken')
            ctx = {
                'donations': donations,
            }
            return render(request, "charity_donation/userpanel.html", ctx)
        

class TekenDonationTrue(View):
        def get(self, request, pk):
            donation = get_object_or_404(Donation, pk=pk)
            if request.user == donation.user:
                donation.is_taken = True
                donation.save()
            return redirect('UserPanel')
        
class UpdateUser(View):
    def get(self, request, pk):
        return render(request, "charity_donation/user-update.html")

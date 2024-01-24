from django.shortcuts import render, redirect
from django.views import View
from .models import Institution, Donation, Category
from .forms import UserCreationForm
from django.contrib.auth import authenticate, login, logout
from django.core import serializers
from django.db.models import Sum
from django.http import HttpResponse


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
        donation = Donation()
        donation.quantity = request.POST['bags']
        donation.institution = Institution.objects.get(pk=request.POST['organization'])
        donation.address = request.POST['address']
        donation.city = request.POST['city']
        donation.zip_code = request.POST['postcode']
        donation.phone_number = request.POST['phone']
        donation.pick_up_date = request.POST['data']
        donation.pick_up_time = request.POST['time']
        donation.pick_up_comment = request.POST['more_info']
        donation.user = request.user
        donation.save()

        for category in request.POST['categories']:
            donation.categories.add(Category.objects.get(pk=int(category)))

        return HttpResponse('Data send successful')
    

def logout_view(request):
    logout(request)
    return redirect('MainPage')
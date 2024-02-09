from .models import User, Donation
from django.contrib.auth.forms import UserCreationForm as DjangoUserCreationForm
from django.forms import ModelForm


class UserCreationForm(DjangoUserCreationForm):
    class Meta:
        model = User
        fields = ("first_name", "last_name", "email", "password1", "password2")


class DonationForm(ModelForm):
    class Meta:
        model = Donation
        exclude = ('user',)


class UserUpdateForm(ModelForm):
    class Meta:
        model = User
        fields = ("first_name", "last_name",)
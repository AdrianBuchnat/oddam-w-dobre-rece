from .models import User
from django.contrib.auth.forms import UserCreationForm as DjangoUserCreationForm


class UserCreationForm(DjangoUserCreationForm):

    class Meta:
        model = User
        fields = ("first_name", "last_name", "email", "password1", "password2")

    def save(self, commit=True):
        user = super(UserCreationForm, self).save()
        if commit:
            user.save()
        return user
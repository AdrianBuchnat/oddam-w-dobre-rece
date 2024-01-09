from django.db import models
from django.utils.text import gettext_lazy as _
from django.core.validators import RegexValidator
from django.contrib.auth.models import AbstractUser, UserManager as DjangoUserManager 


# Create your models here.

class UserManager(DjangoUserManager): # 1.
    use_in_migrations = True # TODO: dowiedzieć się skąd się wzięło 

    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('Users require an email field')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, password, **extra_fields)


class User(AbstractUser):
    username = None
    email = models.EmailField(unique=True)
    objects = UserManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []


class Category(models.Model):
    name = models.CharField(max_length=255, unique=True)
    def __str__(self):
        return self.name


class Institution(models.Model):
    name = models.CharField("Nazwa", max_length=255, unique=True)
    description = models.TextField("Opis", max_length=512)

    FOUNDATION = 'FOU'
    NON_GOVERMENT_ORGANISATION = 'NGO'
    LOCAL_COLLECTION = 'LC'
    INSTITUTION_TYPE_CHOICE = {
        FOUNDATION: 'Fundacja',
        NON_GOVERMENT_ORGANISATION: 'Organizacja pozarządowa',
        LOCAL_COLLECTION: 'Zbiórka lokalna'
    }
    institution_type = models.CharField(
        "Rodzaj instytucji",
        max_length = 3,
        choices = INSTITUTION_TYPE_CHOICE,
        default = FOUNDATION
    )
    categories = models.ManyToManyField(Category)

    def __str__(self):
        return self.name


class Donation(models.Model):
    quantity = models.PositiveIntegerField()
    categories = models.ManyToManyField(Category)
    institution = models.ForeignKey(Institution, on_delete=models.CASCADE)
    address = models.CharField(max_length=255)
    phone_number = models.IntegerField()
    city = models.CharField(max_length=255)
    zip_code = models.CharField(
        max_length=6,
        validators=[RegexValidator('^[0-9]{2}-[0-9]{3}$', _('Invalid postal code'))],
        )
    pick_up_date = models.DateField()
    pick_up_time = models.TimeField()
    pick_up_comment = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)

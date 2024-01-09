from django.db import models

# Create your models here.

class Category(models.Model):
    name = models.CharField(max_length=255, unique=True)


class Institution(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField()

    FOUNDATION = 'FOU'
    NON_GOVERMENT_ORGANISATION = 'NGO'
    LOCAL_COLLECTION = 'LC'
    INSTITUTION_TYPE_CHOICE = {
        FOUNDATION: 'Fundacja',
        NON_GOVERMENT_ORGANISATION: 'Organizacja pozarządowa',
        LOCAL_COLLECTION: 'Zbiórka lokalna'
    }

    institution_type = models.CharField(
        max_lenght = 3,
        choices = INSTITUTION_TYPE_CHOICE,
        default = FOUNDATION
    )
    
    categories = models.ManyToManyField(Category)
# Generated by Django 5.0.1 on 2024-01-09 21:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('charity_donation', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='institution',
            name='description',
            field=models.CharField(max_length=512, verbose_name='Celi i misja'),
        ),
        migrations.AlterField(
            model_name='user',
            name='email',
            field=models.EmailField(max_length=254, unique=True, verbose_name='Email Adress'),
        ),
    ]

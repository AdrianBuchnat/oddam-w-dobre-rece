# Generated by Django 5.0.1 on 2024-01-09 15:22

import charity_donation.models
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('charity_donation', '0003_rename_user_myuser'),
    ]

    operations = [
        migrations.AlterModelManagers(
            name='myuser',
            managers=[
                ('objects', charity_donation.models.CustomUserManager()),
            ],
        ),
    ]

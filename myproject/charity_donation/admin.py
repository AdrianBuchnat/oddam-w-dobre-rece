from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin
from .models import User, Category, Institution, Donation
from django.utils.text import gettext_lazy as _


# Register your models here.

class UserAdmin(DjangoUserAdmin):
    """Define admin model for custom User model with no username field."""
    fieldsets = (
        (None, 
        {'fields': ('email', 'password')}),
        (_('Personal info'), 
        {'fields': ('first_name', 'last_name')}),
        (_('Permissions'), 
        {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        (_('Important dates'),
        {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2'),
        }),
    )
    list_display = ('email', 'first_name', 'last_name', 'is_staff')
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)


admin.site.register(User, UserAdmin)
admin.site.register(Category)
admin.site.register(Institution)
admin.site.register(Donation)

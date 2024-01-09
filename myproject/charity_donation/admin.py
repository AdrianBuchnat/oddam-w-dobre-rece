from django.contrib import admin
# from django.contrib.auth.admin import UserAdmin
from .models import MyUser

# Register your models here.

class CustomUserAdmin(admin.ModelAdmin):
    exclude = ('password',)
    ordering = ('email',)
    list_display = ('email', 'first_name', 'last_name', 'is_superuser')
    search_fields = ('email', 'first_name', 'last_name')
    list_filter = ('is_superuser',)
    readonly_fields = ('email',)


admin.site.register(MyUser, CustomUserAdmin)
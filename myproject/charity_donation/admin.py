from django.contrib import admin
# from django.contrib.auth.admin import UserAdmin
from .models import User, Category, Institution, Donation

# Register your models here.

class UserAdmin(admin.ModelAdmin):
    exclude = ('password',)
    ordering = ('email',)
    list_display = ('email', 'first_name', 'last_name', 'is_superuser')
    search_fields = ('email', 'first_name', 'last_name')
    list_filter = ('is_superuser',)
    readonly_fields = ('email',)


admin.site.register(User, UserAdmin)
admin.site.register(Category)
admin.site.register(Institution)
admin.site.register(Donation)

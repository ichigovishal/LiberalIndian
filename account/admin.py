from django.contrib import admin
from .models import CustomerUser
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import Permission


# Register your models here.

admin.site.register(CustomerUser)
admin.site.register(Permission)

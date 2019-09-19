from django.db import models

# Create your models here.


class ContactUs(models.Model):
    contact_id = models.AutoField(primary_key=True)
    name = models.CharField(editable=False, max_length=20)
    email = models.EmailField(editable=False)
    detail = models.CharField(max_length=100, editable=False)
    is_user = models.BooleanField(default=False, editable=False)
    time = models.TimeField(auto_now=True, editable=False)

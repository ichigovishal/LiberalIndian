from rest_framework import serializers
from .models import ContactUs
from django.contrib.auth import get_user_model as user
from django.core.exceptions import ObjectDoesNotExist
from django.core.mail import EmailMessage
from django.template.loader import render_to_string


class ContactUsSerializers(serializers.ModelSerializer):
    class Meta:
        model = ContactUs
        fields = '__all__'

    name = serializers.CharField(max_length=20)
    email = serializers.EmailField()
    detail = serializers.CharField(max_length=200)

    def check(self, email):
        user_model = user()
        do_exist = True

        try:
           user_model.objects.get(email=email)
        except ObjectDoesNotExist:
            do_exist = False
        return do_exist

    def sent_email(self, name, email, detail, is_user):
        mail_subject = f'Liberal Indian Got A Message From {email}.'
        message = render_to_string('home/contactUs/email/message_email.html', {
            'name': name,
            'email': email,
            'message': detail,
            'member': is_user,
        })
        to_email = user().objects.filter(is_staff=True).values_list('email', flat=True)
        email = EmailMessage(
            mail_subject, message, to=to_email
        )
        email.send()

    def create(self, validated_data):
        name = validated_data["name"]
        email = validated_data["email"]
        detail = validated_data["detail"]
        is_user = self.check(email)
        contact_us = ContactUs(name=name, email=email, detail=detail, is_user=is_user)
        contact_us.save()
        self.sent_email(name, email, detail, is_user)
        return contact_us

    def update(self, instance, validated_data):
        return instance

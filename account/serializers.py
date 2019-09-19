from rest_framework import serializers
from django.contrib.auth import get_user_model as user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = user()
        fields = ['first_name', 'last_name']
        read_only_fields = ['first_name', 'last_name']

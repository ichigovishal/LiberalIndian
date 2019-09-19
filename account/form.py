from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import authenticate, login
from django import forms

class CreateUser:

    def __init__(self, request):
        self.user_model = get_user_model()
        self.request = request
        self.name = self.request.POST['name'].lower()
        self.name = self.name.split()
        self.first_name = self.name[0]
        self.last_name = self.name[len(self.name) - 1]
        self.email = self.request.POST['email']
        self.password = self.request.POST['password']
        self.confirm_password = self.request.POST['confirm_password']
        self.error = []
        self.middle_name = ''
        if len(self.name) > 2:
            for a in self.name[1: len(self.name) - 1]:
                self.middle_name = self.middle_name + a + " "



    def confirm(self):
        def check(email):
            user_model = self.user_model
            do_exist = True

            try:
                user_model.objects.get(email=email)
            except ObjectDoesNotExist:
                do_exist = False
            return do_exist
        def checkPassword(password1, password2):
            if password1 == password2:
                return True
            else:
                return False

        if check(self.email)and not checkPassword(self.confirm_password, self.password):
            self.error.append('already_exits')

            return False
        elif not check(self.email)and not checkPassword(self.confirm_password, self.password):
            self.error.append('password_is_not_confirm')
            return False
        elif not check(self.email) and checkPassword(self.confirm_password, self.password) is True:
            return True

    def get_error(self):
        return self.error

    def save(self):
        user = self.user_model.objects.create_user(email=self.email,
                                                   password=self.password,
                                                   first_name=self.first_name,
                                                   last_name=self.last_name,
                                                   middle_name=self.middle_name
                                                   )
        return user


class LoginUser:
    def __init__(self, request):
        self.request = request
        self.username = request.POST['username']
        self.password = request.POST['password']
        self.error = []

    def get_error(self):
        return self.error

    def check(self):
        user = authenticate(self.request, username=self.username, password=self.password)
        if user is not None:
            if user.is_verified:
                login(self.request, user)
                return [user, True, True]

            else:
                return [user, True, False]

        else:
            self.error.append('invalid')
            return [user, False, False]



class ProfileForm(forms.Form):
    """Image upload form."""
    profile = forms.ImageField()

class ChangePasswordForm(forms.Form):
    """Image upload form."""
    old_password = forms.CharField(min_length=8, widget=forms.PasswordInput)
    new_password = forms.CharField(min_length=8, widget=forms.PasswordInput)
    confirm_password = forms.CharField(min_length=8, widget=forms.PasswordInput)

    def check_password(self, request):
        print(self.cleaned_data.get('old_password'))
        m = get_user_model().objects.get(email=request.user.get_username())
        if m.check_password(self.cleaned_data.get('old_password'))  and self.cleaned_data.get('new_password') == self.cleaned_data.get('confirm_password'):
            return True
        else:
            return False

from django.contrib.auth import login
from django.contrib.sites.shortcuts import get_current_site
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.template.loader import render_to_string
from .token import account_activation_token
from django.core.mail import EmailMessage
from django.shortcuts import render, redirect
from.form import CreateUser, LoginUser
from django.http import HttpResponseRedirect, HttpResponseNotFound, HttpResponseForbidden, HttpResponseBadRequest
from django.contrib.auth import logout
from django.http.response import JsonResponse
from django.contrib.auth import get_user_model
from .form import ProfileForm, ChangePasswordForm
# Create your views here.


class LogView:

    @staticmethod
    def main_view(request, slug):
        custom_type = slug
        template_name = "login&signup/index.html"

        def error_check(req):
            try:
                return req.GET['error']
            except:
                return None

        if custom_type == 'login' or custom_type == 'signup':
            context = {'type': custom_type,
                       'url': request.GET['next'],
                       'error': error_check(request),
                       }
            print(context)
            return render(request, template_name, context)
        else:
            return HttpResponseNotFound("page not found")

    @staticmethod
    def create_view(request):
        template_name = "login&signup/index.html"
        url = request.GET['next']
        form = CreateUser(request)
        if form.confirm():
            user = form.save()
            user.is_active = False
            user.is_verified = False
            user.save()
            current_site = get_current_site(request)
            mail_subject = 'Activate your Liberal Indian account.'
            message = render_to_string('login&signup/email/acc_active_email.html', {
                'user': user,
                'domain': current_site.domain,
                'uid':urlsafe_base64_encode(force_bytes(user.pk)),
                'token': account_activation_token.make_token(user),
                'next': request.GET['next'],
            })
            to_email = form.email
            email = EmailMessage(
                mail_subject, message, to=[to_email]
            )
            email.send()
            return render(request,
                          template_name,
                          {'type': 'confirm_email',
                           'message': 'Please confirm your email address to complete the registration',
                           })

        elif not form.confirm():
            error = form.get_error()
            return HttpResponseRedirect(f'log/signup?next={url}&error={error[0]}')
    @staticmethod
    def activate(request, uidb64, token):
        template_name = "login&signup/index.html"
        next = request.GET['next']
        try:
            uid = force_text(urlsafe_base64_decode(uidb64))
            user = get_user_model().objects.get(pk=uid)
        except(TypeError, ValueError, OverflowError, get_user_model().DoesNotExist):
            user = None
        if user is not None and account_activation_token.check_token(user, token):
            user.is_verified = True
            user.save()
            login(request, user)
            return redirect(next)

        else:
            return render(request,
                          template_name,
                          {'type': 'confirm_email',
                           'message': 'Activation link is invalid!',
                           })

    @staticmethod
    def login_view(request):
        template_name = "login&signup/index.html"
        url = request.GET['next']
        form = LoginUser(request)
        user, authenticate_status, verified_status = form.check()
        if authenticate_status:
            if verified_status:
                return HttpResponseRedirect(url)
            else:
                current_site = get_current_site(request)
                mail_subject = 'Activate your Liberal Indian account.'
                message = render_to_string('login&signup/email/acc_active_email.html', {
                    'user': user,
                    'domain': current_site.domain,
                    'uid': urlsafe_base64_encode(force_bytes(user.pk)),
                    'token': account_activation_token.make_token(user),
                    'next': request.GET['next'],
                })
                to_email = user.email
                email = EmailMessage(
                    mail_subject, message, to=[to_email]
                )
                email.send()
                return render(request,
                              template_name,
                              {'type': 'confirm_email',
                               'message': 'Your email is not verified, /n We have resent you a email. /n Please confirm your email address to complete the registration',
                               })



        elif not authenticate_status:
            error = form.get_error()
            return HttpResponseRedirect(f'log/login?next={url}&error={error[0]}')

    @staticmethod
    def logout_view(request):
        logout(request)
        url = request.GET['next']
        return HttpResponseRedirect(url)

    @staticmethod
    def uploadProfileView(request):
        if request.method == 'POST':
            form = ProfileForm(request.POST, request.FILES)
            if form.is_valid():
                m = get_user_model().objects.get(email=request.user.get_username())
                m.profile = form.cleaned_data['profile']
                m.save()
            else:
                print('Not Valid')
        return redirect('dashboard:dashboard')

    @staticmethod
    def changePasswordView(request):
        if request.method == 'POST':
            form = ChangePasswordForm(request.POST)
            if form.is_valid():
                if form.check_password(request):
                    print("valid")
                    m = get_user_model().objects.get(email=request.user.get_username())
                    password = form.cleaned_data['new_password']
                    m.set_password(password)
                    m.save()
            else:
                print('Not Valid')
        return redirect('dashboard:dashboard')

    @staticmethod
    def checkPasswordView(request):
        if request.method == 'POST':
            m = get_user_model().objects.get(email=request.user.get_username())
            if m.check_password(request.POST['old_password']):
                return JsonResponse({'valid': True})
            else:
                return JsonResponse({'valid': False})

    @staticmethod
    def checkEmailView(request):
        if request.method == 'POST':
            try:
                uid = request.POST['email']
                user = get_user_model().objects.get(email=uid)
            except(TypeError, ValueError, OverflowError, get_user_model().DoesNotExist):
                user = None
            if user is not None:
                return JsonResponse({'valid': True})
            else:
                return JsonResponse({'valid': False})

    @staticmethod
    def forgetPasswordView(request, *args):
        template_name = "login&signup/forgetPassword/index.html"
        next = request.GET['next']
        
        if request.GET['type'] == 'verify':
            return render(request,
                          template_name,
                          {'type': 'verify',
                           'url': next,
                           })

        elif request.GET['type'] == 'change-password':
            return render(request,
                          template_name,
                          {'type': 'change_password',
                           'a': request.GET["a"], # ID
                           'b': request.GET['b'],  # token
                           'url': next,
                           })

        elif request.POST['type'] == 'verify':
            email = request.POST['email']
            try:
                object = get_user_model().objects.get(email=email)
            except:
                object = None

            if object is not None:
                current_site = get_current_site(request)
                mail_subject = "Reset your Liberal Indian account's password."
                message = render_to_string('login&signup/forgetPassword/email/acc_active_email.html', {
                    'user': object,
                    'domain': current_site.domain,
                    'uid': urlsafe_base64_encode(force_bytes(object.pk)),
                    'token': account_activation_token.make_token(object),
                    'next': request.GET['next'],
                })
                to_email = object.email
                email = EmailMessage(
                    mail_subject, message, to=[to_email]
                )
                email.send()
                
                return render(request,
                              template_name,
                              {'type': 'confirm_email',
                               'message': 'We have send a reset password link to  your email address.',
                               })
                
            else: return HttpResponseForbidden
        else:
            return HttpResponseNotFound


            


    @staticmethod
    def forgetPasswordSetView(request):
        template_name = "login&signup/index.html"
        next = request.GET['next']
        # token = None 
        try:
            uidb64 = request.GET['a']  # ID
            token = request.GET['b']  # token
            uid = force_text(urlsafe_base64_decode(uidb64))
            user = get_user_model().objects.get(pk=uid)
        except(TypeError, ValueError, OverflowError, get_user_model().DoesNotExist):
            user = None
            token = None
        if token is not None:
            if user is not None and account_activation_token.check_token(user, token):
                if request.POST['new_password'] == request.POST['confirm_password']:
                    user.set_password(request.POST['new_password'])
                    user.save()
                    return redirect(f'/account/log/login/?next={next}#')
                else:
                    return HttpResponseBadRequest
            else:
                return render(request,
                              template_name,
                              {'type': 'confirm_email',
                               'message': 'Activation link is invalid!',
                               })
        else: return HttpResponseBadRequest

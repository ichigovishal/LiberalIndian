from django.urls import path
from django.conf.urls import url
from.views import LogView
from django.contrib.auth.decorators import login_required
app_name = 'login&signUp'

urlpatterns = [
    path('log/<slug:slug>/', LogView.main_view, name="log"),
    path('signup/', LogView.create_view, name='signUp'),
    path('login/', LogView.login_view, name='login'),
    path('logout/', LogView.logout_view, name='logout'),
    path('uploadProfile/', login_required(LogView.uploadProfileView), name='uploadProfile'),
    path('changePassword/', login_required(LogView.changePasswordView), name='changePassword'),
    path('checkPassword/', login_required(LogView.checkPasswordView), name='checkPassword'),
    url(r'^activate/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$',
        LogView.activate, name='activate'),
    path('checkEmail/', LogView.checkEmailView, name='checkEmail'),
    path('forgetPassword/', LogView.forgetPasswordView, name='forgetPassword'),
    path('forgetPasswordSet/', LogView.forgetPasswordSetView, name='forgetPasswordSet'),
]




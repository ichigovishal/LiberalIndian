from django.urls import path
from.views import DashView
from django.contrib.auth.decorators import login_required
app_name = 'dashboard'
urlpatterns = [
    path('dashboard/', login_required(DashView.as_view()), name='dashboard'),

]

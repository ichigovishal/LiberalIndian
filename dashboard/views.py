from django.views.generic import ListView
from reader__API.models import Discord, Article
from django.contrib.auth import get_user_model

# Create your views here.
class DashView(ListView):

    template_name = 'dashboard/index.html'
    context_object_name = 'Discord'
    model = Discord


    def get_queryset(self):
        user = self.request.user.get_username()
        return Discord.objects.filter(author__email=user).order_by('-written_on')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        user = self.request.user.get_username()
        context['Article'] = Article.objects.filter(author__email=user).order_by('-written_on')
        context['UserAccount'] =get_user_model().objects.get(email=user)
        return context




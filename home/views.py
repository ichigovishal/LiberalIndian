from django.views.generic.list import ListView
from reader__API.models import Article, Discord
# Create your views here.


class View(ListView):
    template_name = 'home/index.html'
    context_object_name = 'Article'

    def get_queryset(self):
        return Article.objects.filter(important=True).order_by('written_on')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['Discord'] = Discord.objects.filter(important=True).order_by('written_on')
        return context


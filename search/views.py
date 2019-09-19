from django.views.generic.list import ListView
from reader__API.models import Discord,Article

class SearchView(ListView):

    template_name = 'search/index.html'
    model = Article
    ordering = ['-written_on']
    context_object_name = 'Article'


    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['Discord'] = Discord.objects.all().order_by('-written_on')
        return context


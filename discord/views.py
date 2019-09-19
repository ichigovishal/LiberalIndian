from django.shortcuts import render
from django.views.generic.detail import DetailView
# Create your views here.

from reader__API.models import Discord


class DiscordView(DetailView):
    model = Discord
    template_name = 'nestedDiscussion/index.html'
    context_object_name = 'Discord'
    slug_field = 'discord_id'

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super().get_context_data(**kwargs)
        # Add in a QuerySet of all the books
        slug = self.kwargs['slug']
        context['RelatedDiscord'] = Discord.objects.filter(nested_discord__discord_id=slug)
        return context


from drf_multiple_model.viewsets import ObjectMultipleModelAPIViewSet
from reader__API.models import Article, Discord
from .serializers import ArticleSerializers, DiscordSerializer
from rest_framework import filters
# from django_filters.rest_framework import filters

# Create your views here.

class SearchAPIView(ObjectMultipleModelAPIViewSet):



    querylist = [
        {
            'queryset': Article.objects.all(),
            'serializer_class': ArticleSerializers,
            'label': 'article',
        },
        {
            'queryset': Discord.objects.all(),
            'serializer_class': DiscordSerializer,
            'label': 'discord',
        },
    ]

    filter_backends = (filters.SearchFilter,)
    search_fields = ('title',
                     'line',
                     'main_data',
                     'written_on',
                     'author__first_name',
                     'author__last_name',
                     'author__email',
                     'search_tag__search_tag',

                     )

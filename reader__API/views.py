from rest_framework import generics
from rest_framework import viewsets
from.models import Article, Discord
from.serializers import ArticleSerializers, DiscordSerializer
from django.contrib.auth.models import Permission
# Create your views here.


class ArticleView(viewsets.ModelViewSet):

    http_method_names = ['get']

    queryset = Article.objects.all()
    serializer_class = ArticleSerializers

    def get_object(self):
        pk = self.kwargs.get('pk')
        return Article.objects.get(article_id=pk)


class DiscordView(viewsets.ModelViewSet):

    http_method_names = ['get', 'post']

    queryset = Discord.objects.all()
    serializer_class = DiscordSerializer

    def get_object(self):
        pk = self.kwargs.get('pk')
        return Discord.objects.get(discord_id=pk)

    def get_queryset(self):
        try:
            article_id = self.request.GET['related_article']
            return Discord.objects.filter(related_article__article_id=article_id)
        except:
            return super().get_queryset()








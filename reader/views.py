from django.views.generic.detail import DetailView
# Create your views here.

from reader__API.models import Article


class ArticleView(DetailView):
    model = Article
    template_name = 'reader/index.html'
    context_object_name = 'Article'
    slug_field = 'article_id'

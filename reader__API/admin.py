from django.contrib import admin
from .models import Article, Discord, SearchTag

# Register your models here.
admin.site.register(Article)
admin.site.register(Discord)
admin.site.register(SearchTag)

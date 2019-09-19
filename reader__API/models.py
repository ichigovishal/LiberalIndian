from django.db import models
from django.contrib.auth import get_user_model
import os
# Create your models here.


class SearchTag(models.Model):
    search_tag = models.CharField(primary_key=True, max_length=20)
    tag_description = models.CharField(max_length=200, null=True, blank=True)

    def __str__(self):
        return self.search_tag

    def save(self, force_insert=False, force_update=False, using=None,
             update_fields=None):
        super().save()
        return self


class Article(models.Model):
    article_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=1000)
    line = models.CharField(max_length=1, null=True, blank=True)
    main_data = models.CharField(max_length=2000)
    main_data_display = models.CharField(max_length=2500, blank=True, null=True)
    search_tag = models.ManyToManyField(SearchTag, related_name='tagged_articles', blank=True)
    author = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='article', null=True, blank=True)
    written_on = models.DateField(auto_now=True)
    important = models.BooleanField(default=False)
    image = models.ImageField(upload_to='article/image/', null=True, blank=True)
    def save(self, force_insert=False, force_update=False, using=None,
             update_fields=None):
        super().save()
        return self

    def __str__(self):
        return str(self.article_id)


class Discord(models.Model):
    discord_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=5000)
    line = models.CharField(max_length=3000)
    main_data = models.CharField(max_length=20000)
    search_tag = models.ManyToManyField(SearchTag, related_name='tagged_discord', blank=True)
    author = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='discord', null=True, blank=True)
    nested_discord = models.ForeignKey('self',
                                       related_name='related_discord',
                                       on_delete=models.CASCADE,
                                       blank=True,
                                       null=True
                                       )
    related_article = models.ForeignKey(Article,
                                        on_delete=models.CASCADE,
                                        related_name='related_discord',
                                        blank=True,
                                        null=True
                                        )
    written_on = models.DateField(auto_now=True)
    important = models.BooleanField(default=False)

    def save(self, force_insert=False, force_update=False, using=None,
             update_fields=None):
        super().save()
        return self

    def __str__(self):
        return str(self.discord_id)


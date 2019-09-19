from rest_framework import serializers
from .models import Article, Discord, SearchTag
from django.contrib.auth import get_user_model as user
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.response import Response
from rest_framework import status
from account.serializers import UserSerializer


# def get_listed_queryset(field_name, model):
#     article_queryset = model.objects.all()
#     la = ()
#     for a in article_queryset:
#         la.a.article_id)
#
#     return {field_name: model}


class SearchTagSerializer(serializers.ModelSerializer):

    class Meta:
        model = SearchTag
        fields = ['search_tag']
        read_only_fields = ['tag_description']
        search_tag = serializers.CharField(max_length=20)


class ArticleSerializers(serializers.ModelSerializer):

    class Meta:
        model = Article
        fields = [
                 'article_id',
                 'title',
                 'main_data',
                 'author',
                 'written_on',
                 'search_tag',
                 'related_discord'
        ]
        read_only_fields = ['article_id', 'author', 'written_on']

    title = serializers.CharField(
        max_length=5000
    )
    main_data = serializers.CharField(
        max_length=500000
    )
    author = UserSerializer()
    search_tag = SearchTagSerializer(many=True)

    def check(self, model, **kwargs):
        try:
            custom_object = model.objects.get(**kwargs)
            return custom_object
        except ObjectDoesNotExist:
            return None

    def create(self, validated_data):
        user_model = user()
        search_data = validated_data['search_tag']
        title = validated_data['title']
        main_data = validated_data['main_data']
        author = self.context.get('request').user.get_username()
        model = Article(title=title,
                        main_data=main_data,
                        author=user_model.objects.get(email=author),
                        )
        model.save()
        new_model = Article.objects.get(article_id=model.article_id)
        for data in search_data:
            if self.check(SearchTag, search_tag=data) is not None:
                new_model.search_tag.add(self.check(SearchTag, search_tag=data))
            else:
                search_tag = SearchTag(search_tag=data)
                search_tag.save()
                new_model.search_tag.add(SearchTag.objects.get(search_tag=data))
        return new_model


class DiscordSerializer(serializers.ModelSerializer):

    class Meta:
        model = Discord
        fields = [
                 'discord_id',
                 'title',
                 'line',
                 'main_data',
                 'author',
                 'written_on',
                 'search_tag',
                 'related_discord',
                 'related_article',
                 'nested_discord'
        ]
        read_only_fields = ['discord_id', 'author', 'written_on', 'related_discord', ]

    title = serializers.CharField(
        max_length=5000
    )
    line = serializers.CharField(
        max_length=10000
    ) 
    main_data = serializers.CharField(
        max_length=300000
    )
    nested_discord = serializers.CharField(max_length=10)
    related_article = serializers.CharField(max_length=5)
    author = UserSerializer(read_only=True)

    def check(self, model, **kwargs):
        try:
            custom_object = model.objects.get(**kwargs)
            return custom_object
        except ObjectDoesNotExist:
            return None
    # def create(self, validated_data):
    #     print(validated_data['discord_title'])


    def create(self, validated_data):
        user_model = user()
        search_data = validated_data['search_tag']
        title = validated_data['title']
        line = validated_data['line']
        main_data = validated_data['main_data']
        author = self.context.get('request').user.get_username()
        related_article = str(validated_data['related_article'])
        nested_discord = str(validated_data['nested_discord'])

        if not related_article == 'None' and self.check(Article, article_id=related_article)is not None:
            model = Discord(title=title,
                            line=line,
                            main_data=main_data,
                            author=user_model.objects.get(email=author),
                            related_article=self.check(Article, article_id=related_article)
                            )
            model.save()
            global new_model
            new_model = Discord.objects.get(discord_id=model.discord_id)

        elif self.check(Discord, discord_id=nested_discord) is not None:
            model = Discord(title=title,
                            line=line,
                            main_data=main_data,
                            author=user_model.objects.get(email=author),
                            nested_discord=self.check(Discord, discord_id=nested_discord)
                            )
            model.save()
            new_model = Discord.objects.get(discord_id=model.discord_id)
        else:
            return Response(self.errors,
                            status=status.HTTP_400_BAD_REQUEST)

        for data in search_data:
            if self.check(SearchTag, search_tag=data) is not None:
                new_model.search_tag.add(self.check(SearchTag, search_tag=data))
            else:
                search_tag = SearchTag(search_tag=data)
                search_tag.save()
                new_model.search_tag.add(SearchTag.objects.get(search_tag=data))
        return new_model
    #

















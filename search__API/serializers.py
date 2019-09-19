from rest_framework import serializers
from reader__API.models import Article, Discord, SearchTag
from account.serializers import UserSerializer

class ArticleSerializers(serializers.ModelSerializer):

    class Meta:
        model = Article
        fields = [
                 'article_id',
                 'title',
                 'main_data',
                 'line',
                 'author',
                 'written_on',
                 'search_tag',

        ]
        read_only_fields =  [
                 'article_id',
                 'title',
                 'line',
                 'main_data',
                 'author',
                 'written_on',
                 'search_tag',

        ]

    author = UserSerializer()
    search_tag = serializers.SlugRelatedField(
        many=True,
        slug_field='search_tag',
        read_only=True,
    )

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

        ]
        read_only_fields = [
                 'discord_id',
                 'title',
                 'line',
                 'main_data',
                 'author',
                 'written_on',
                 'search_tag',

        ]

    author = UserSerializer()
    search_tag = serializers.SlugRelatedField(
        many=True,
        slug_field='search_tag',
        read_only=True,
    )

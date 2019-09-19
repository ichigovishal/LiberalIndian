from rest_framework import routers
from django.urls import include
from contactUs__API.views import ContactUsView
from django.conf.urls import url
from reader__API.views import ArticleView, DiscordView
from search__API.views import SearchAPIView


app_name = 'API'
router = routers.DefaultRouter()
# router = routers.SimpleRouter()
router.register(r'contactus', ContactUsView)
router.register(r'articles', ArticleView)
router.register(r'discord', DiscordView)
router.register(r'search', SearchAPIView,  base_name='search')

urlpatterns = [
    url('', include(router.urls)),
    url('', include('reader__API.urls')),

]



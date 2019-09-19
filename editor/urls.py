from django.urls import path
from.views import ArticleCreateView, save_request_view
from django.contrib.auth.decorators import login_required, permission_required
app_name = 'editor'
urlpatterns = [
    path('editor/', login_required(ArticleCreateView.as_view()), name='editor'),
    path('editor/latest-save/', login_required(save_request_view), name='latestSave'),

]

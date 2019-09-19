from django.views.generic.edit import CreateView
from reader__API.models import Article, SearchTag
from .models import LatestSave
from django.contrib.auth import get_user_model
from django.http.response import JsonResponse
from django.contrib.auth.decorators import permission_required
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.messages.views import SuccessMessageMixin
from django.contrib.auth.mixins import PermissionRequiredMixin

class ArticleCreateView(PermissionRequiredMixin, SuccessMessageMixin, CreateView):
    template_name = 'editor/index.html'
    model = Article
    fields = ['main_data', 'title', 'author', 'main_data_display']
    permission_required = ('reader__API.add_article',)

    def get_success_url(self):
        return  f'/article/{self.object}/'

    def check_object_availability(self, id):
        try:
            search_tag = SearchTag.objects.get(search_tag=id).search_tag
            return [True, search_tag]
        except ObjectDoesNotExist:
            return [False, None]

    def context_exits(self,*arg,  ele,):
        global kwarg
        kwarg = {}
        for a in arg:
            try:
                if a is 'search_tag':
                    kwarg[a] = ele
                else:
                    kwarg[a] = self.request.POST[a]
            except KeyError:
                pass
        return kwarg

    def add_to_searchTag(self):
        id = self.request.POST['search_tag']
        id.lower()
        if ' ' in id and ', ' not in id:
            lis = id.split()
            custom_list = []
            for ele in lis:
                status, object = self.check_object_availability(ele)
                if status:
                    custom_list.append(object)
                else:

                    kwarg = self.context_exits('search_tag', 'tag_description', ele=ele)
                    model = SearchTag(**kwarg)
                    model.save()
                    custom_list.append(ele)
            return custom_list
        elif ', ' or ',' in id:
            lis = id.split(', ')
            custom_list = []
            for ele in lis:
                status, object = self.check_object_availability(ele)
                if status:
                    custom_list.append(object)
                else:

                    kwarg = self.context_exits('search_tag', 'tag_description', ele=ele)
                    model = SearchTag(**kwarg)
                    model.save()
                    custom_list.append(ele)
            return custom_list
        else:
            return [id]
    def test_if_save_exits(self):
        try:

            LatestSave.objects.get(author__email=self.request.user.get_username())
            return True
        except ObjectDoesNotExist:
            return False

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        if self.test_if_save_exits():
            context['Saved'] = LatestSave.objects.get(author__email=self.request.user.get_username())
        else:
            context['Saved'] = {'main_data': '', 'image': ''}
        return context
    def delete_Lastest_save(self):
        try:
            model = LatestSave.objects.get(author__email=self.request.user.get_username())
            model.delete()
        except ObjectDoesNotExist:
            pass

    def post(self, request, *args, **kwargs):
        request.POST = request.POST.copy()
        request.POST['author'] = get_user_model().objects.get(email=request.user.get_username()).id
        self.delete_Lastest_save()
        return super().post(request, *args, **kwargs)
    def form_valid(self, form):
        self.object = form.save()
        model = Article.objects.get(article_id=self.object.article_id)
        for ele in self.add_to_searchTag():
            try:
                model.search_tag.add(SearchTag.objects.get(search_tag=ele))
            except ObjectDoesNotExist:
                pass
        return super().form_valid(form)
# Save request view

def check(model, **kwargs):
    try:
        custom_object = model.objects.get(**kwargs)
        return custom_object
    except ObjectDoesNotExist:
        return None

@permission_required('reader__API.add_article')
def save_request_view(request):
    if request.method == 'POST':
        main_data = request.POST['main_data']
        image = request.FILES['image']
        if check(LatestSave, author__email=request.user.get_username()) is None:
            model = LatestSave(main_data=main_data,
                               image=image,
                               author=get_user_model().objects.get(email=request.user.get_username())
                               )
            model.save()
        else:
            model = LatestSave.objects.get(author__email=request.user.get_username())
            model.main_data = main_data
            model.image = image
            model.save()
        model = LatestSave.objects.get(author__email=request.user.get_username())
        print(model.author)
        return JsonResponse({'author': str(model.author),
                             'main_data': str(model.main_data),
                             'image': str(model.image)
                             })






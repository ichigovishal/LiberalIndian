from django.forms import ModelForm
from.models import LatestSave

class UploadFileForm(ModelForm):
    class Meta:
        model = LatestSave
        fields = ['main_data', 'image']


    # def save(self, commit=True):



        

from django.db import models
from django.contrib.auth import get_user_model

# Create your models here.
class LatestSave(models.Model):
    author = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='savedArticle', primary_key=True)
    main_data = models.CharField(max_length=2000)
    image = models.ImageField(upload_to='article/temp/', null=True, blank=True)



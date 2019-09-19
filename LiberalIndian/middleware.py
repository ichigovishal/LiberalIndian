from django.contrib.auth import get_user_model
from reader__API.models import Discord, Article
from django.utils import timezone
from django.contrib.auth.models import Permission
from .settings import ARTICLE_POINT, DISCORD_POINT, MIN_ENERGY_POINTS, ACTIVE_SESSION_POINT, ACTIVE_SESSION_INTERVAL
import datetime
from django.contrib.auth.models import Group
from django.core.exceptions import ObjectDoesNotExist


class EnergyPointMiddleware(object):

    def __init__(self, get_response):
        self.get_response = get_response
        self.NOW = timezone.now()

    def update_active_time(self, model):
        model.active_time = self.NOW
        return model

    def update_energy_point(self, model):
        active_time = model.active_time
        difference_in_time = self.NOW - active_time
        difference_in_time = difference_in_time.seconds
        if difference_in_time > datetime.datetime.strptime(ACTIVE_SESSION_INTERVAL,'%H:%M').second:
            model.energy_points = model.energy_points + ACTIVE_SESSION_POINT

        # Last Checked Points
        last_check_discord_no = model.last_check_discord_no
        last_check_article_no = model.last_check_article_no

        # New Checked Points
        Lasted_check_discord_no = len(Discord.objects.filter(author__email=model.email))
        Lasted_check_article_no = len(Article.objects.filter(author__email=model.email))

        # Update Energy Point
        points = (model.energy_points + (Lasted_check_article_no * ARTICLE_POINT)) - (last_check_article_no * ARTICLE_POINT)
        points = (points + (Lasted_check_discord_no * DISCORD_POINT)) - (last_check_discord_no * DISCORD_POINT)
        model.energy_points = points

        # Update Last checked Points
        model.last_check_discord_no = Lasted_check_discord_no
        model.last_check_article_no = Lasted_check_article_no

        # Return Everything
        return model

    def update_write_privilege(self, model):
        my_group, status = Group.objects.get_or_create(name='can write an article')

        if model.write_privilege:
            if not my_group.user_set.filter(email=model.email).exists():
                my_group.user_set.add(model)
        elif not model.write_privilege and model.energy_points > MIN_ENERGY_POINTS:
            model.write_privilege = True

            if status:
                permission = Permission.objects.get(name="Can add article")
                my_group.permissions.add(permission)
                my_group.user_set.add(model)
            else:
                my_group.user_set.add(model)
        elif not model.write_privilege:
            if my_group.user_set.filter(email=model.email).exists():
                my_group.user_set.remove(model)



        return model

    def __call__(self, request):
        if request.user.get_username():
            model_object = get_user_model().objects.get(email=request.user.get_username())
            model_object = self.update_energy_point(model_object)
            model_object = self.update_active_time(model_object)
            model_object = self.update_write_privilege(model_object)
            model_object.save()
        response = self.get_response(request)
        return response

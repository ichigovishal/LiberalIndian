from __future__ import unicode_literals
from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from django.utils.translation import gettext_lazy as _
from django.core.mail import send_mail
from django.utils import timezone
from .usermanager import CustomerUserManager
from django.contrib.auth.models import PermissionsMixin
import datetime
from django.contrib.auth.models import Permission
from django.contrib.auth.models import Group
from django.contrib.auth import get_user_model

NOW = datetime.datetime.utcnow()

class CustomerUser(AbstractBaseUser, PermissionsMixin):
    first_name = models.CharField(_('first name'), max_length=30, blank=True, null=True)
    middle_name = models.CharField(_('middle name'), max_length=30, blank=True, null=True)
    last_name = models.CharField(_('last name'), max_length=150, blank=True, null=True)
    email = models.EmailField(_('email address'), unique=True, help_text=_('Required.'), error_messages={
        'Register': _("A user with that Email already exists.")}, )
    dob = models.DateTimeField(_('date of birth'), help_text=_('Date of birth'), blank=True, null=True)
    is_staff = models.BooleanField(
        _('staff status'),
        default=False,
        help_text=_('Designates whether the user can log into this admin site.'),
    )

    is_admin = models.BooleanField(
        _('admin'),
        default=False,
        help_text=_('Designates whether this user should be treated as admin. '
                    ),
    )
    is_active = models.BooleanField(
        _('active'),
        default=True,
        help_text=_(
            'Designates whether this user should be treated as active. '
            'Unselect this instead of deleting accounts.'
        ),
    )


    is_superuser = models.BooleanField(
        _('super user'),
        default=False,
        help_text=_(
            'Designates whether this user should be treated as super user. '

        ),
    )
    write_privilege = models.BooleanField( _('write privilege'),
        default=False,
        help_text=_(
            'Designates whether this user has a write privilege. '

        ),
    )
    is_verified = models.BooleanField( _('email verified'),
        default=False,
        help_text=_(
            "Designates whether this user's email is verified . "

        ),
    )


    date_joined = models.DateTimeField(_('date joined'), default=timezone.now)
    profile = models.ImageField(upload_to='account/profile/', default='account/profile/default.jpg')
    active_time = models.DateTimeField(null=True, blank=True, default=timezone.now)

    energy_points = models.IntegerField(default=0)
    last_check_discord_no = models.IntegerField(default=0)
    last_check_article_no = models.IntegerField(default=0)
    objects = CustomerUserManager()

    EMAIL_FIELD = 'email'
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = _('email')
        abstract = False
        swappable = 'AUTH_USER_MODEL'

    def clean(self):
        super().clean()
        self.email = self.__class__.objects.normalize_email(self.email)

    def get_full_name(self):
        """
        Return the first_name plus the last_name, with a space in between.
        """
        full_name = '%s %s' % (self.first_name, self.last_name)
        return full_name.strip()

    def get_short_name(self):
        """Return the short name for the user."""
        return self.first_name

    def email_user(self, subject, message, from_email=None, **kwargs):
        """Send an email to this user."""
        send_mail(subject, message, from_email, [self.email], **kwargs)

    def __str__(self):
        return f'{self.first_name} {self.last_name}'

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.is_verified:
            self.is_active = True

        elif not self.is_verified:
            self.is_active = False

        if self.is_superuser:
            self.write_privilege = True
            self.is_verified = True




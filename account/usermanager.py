from django.contrib.auth.base_user import BaseUserManager


class CustomerUserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, first_name, last_name, **extra_fields):
        """
        Create and save a user with the given email, and password.
        """
        """if not first_name:
            raise ValueError('Enter your first name.')

        if not last_name:
            raise ValueError('Enter your last name.')"""

        if not email:
            raise ValueError('The given Email must be set')

        if not password:
            raise ValueError('Password must be set')

        user_obj = self.model(email=self.normalize_email(email),
                              first_name=first_name,
                              last_name=last_name,
                              # is_staff=extra_fields.get('is_staff'),
                              # is_admin=extra_fields.get('is_admin'),
                              # is_superuser=extra_fields.get('is_superuser'),
                              **extra_fields

                              )
        user_obj.set_password(password)
        user_obj.save(using=self._db)
        return user_obj

    def create_user(self, email=None, password=None, first_name=None, last_name=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        extra_fields.setdefault('is_admin', False)
        return self._create_user(email, password, first_name, last_name, **extra_fields)

    def create_admin_user(self, email, password, first_name=None, last_name=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', False)
        extra_fields.setdefault('is_admin', True)
        extra_fields.setdefault('write_privilege', True)
        extra_fields.setdefault('is_verified', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_admin') is not True:
            raise ValueError('Administrator must have is_admin=True.')

        return self._create_user(email, password, first_name, last_name, **extra_fields)

    def create_superuser(self, email, password, first_name=None, last_name=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_admin', True)
        extra_fields.setdefault('write_privilege', True)
        extra_fields.setdefault('is_verified', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self._create_user(email, password, first_name, last_name, **extra_fields)


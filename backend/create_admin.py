import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User

username = os.environ.get('DJANGO_SUPERUSER_USERNAME', 'admin')
email = os.environ.get('DJANGO_SUPERUSER_EMAIL', 'admin@example.com')
password = os.environ.get('DJANGO_SUPERUSER_PASSWORD', '123456')

user, created = User.objects.get_or_create(username=username, defaults={'email': email})
user.set_password(password)
user.is_staff = True
user.is_superuser = True
user.is_active = True
user.save()

print("=========================================")
print(f"ADMIN USER CREATED/UPDATED: {username}")
print(f"PASSWORD: {password}")
print("=========================================")
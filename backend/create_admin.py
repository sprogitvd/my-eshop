import os
import django
from django.db import IntegrityError

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User

username = os.environ.get('DJANGO_SUPERUSER_USERNAME', 'admin')
email = os.environ.get('DJANGO_SUPERUSER_EMAIL', 'admin@example.com')
password = os.environ.get('DJANGO_SUPERUSER_PASSWORD', '123456')

try:
    user = User.objects.get(username=username)
    # اگر کاربر وجود داشت، فقط رمز و دسترسی‌ها را آپدیت کن
    user.set_password(password)
    user.is_staff = True
    user.is_superuser = True
    user.is_active = True
    user.save()
    print(f"[OK] Admin user '{username}' already exists. Updated password & permissions.")
except User.DoesNotExist:
    try:
        User.objects.create_superuser(
            username=username,
            email=email,
            password=password
        )
        print(f"[OK] Admin user '{username}' created successfully.")
    except IntegrityError:
        print(f"[SKIP] Admin user '{username}' was just created by another process.")
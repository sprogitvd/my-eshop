import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User

username = os.environ.get('DJANGO_SUPERUSER_USERNAME', 'admin')
email = os.environ.get('DJANGO_SUPERUSER_EMAIL', 'admin@example.com')
password = os.environ.get('DJANGO_SUPERUSER_PASSWORD', '123456')

# ابتدا بررسی می‌کنیم آیا کاربر وجود دارد یا خیر
user = User.objects.filter(username=username).first()

if not user:
    # اگر وجود نداشت، کاربر جدید می‌سازیم
    user = User(username=username, email=email)
    user.is_staff = True
    user.is_superuser = True
    print(f"Creating new admin user: {username}")
else:
    # اگر وجود داشت، فقط مقادیر را آپدیت می‌کنیم
    user.email = email
    print(f"Updating existing admin user: {username}")

user.set_password(password)
user.is_active = True
user.save()

print("=========================================")
print(f"ADMIN USER READY: {username}")
print(f"PASSWORD: {password}")
print("=========================================")
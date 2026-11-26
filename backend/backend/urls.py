from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urls = [
    path('products/', include('base.urls.product_urls')),
    path('users/', include('base.urls.user_urls')),
    path('orders/', include('base.urls.order_urls')),
    path('air/', include('base.urls.air_urls')),
]

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include(urls)),
]

# این خط برای سرو کردن عکس‌ها (فایل‌های مدیا) در محیط آنلاین ضروری است
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
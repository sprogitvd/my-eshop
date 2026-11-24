from django.urls import path
from base.views import user_views as views


urlpatterns= [
    
    path('login/', views.MyCreatorTokenView.as_view(), name='token-obtain-pair'),
    path('profile/', views.getUserProfile, name='users-profile'),
    #نگاشت آپدیت اطلاعات کاربر
    #تابع یا ویو آپدیت یوزر پروفایل رو صدا بزن
    path('profile/update/', views.updateUserProfile,  name='user-profile-update'),
    path('', views.getUsers, name='users'),
    path('register/', views.registerUser, name='register'),
    path('token/refresh/', views.MyTokenRefreshView.as_view(), name='token_refresh'),
]


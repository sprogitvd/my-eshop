
from django.conf import settings
from django.http import HttpResponseRedirect
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from base.serializers import UserSerializer, UserSerializerWithToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.core.mail import EmailMessage
from rest_framework import status
import jwt


def emailSender(data):
    try:
        email = EmailMessage(
            subject=data['subject'],
            body=data['body'],
            from_email='eshop.hamruyesh@gmail.com',
            to=[data['to'], ]
        )

        email.send()
        return True
    except:
        return False


class MyTokenRefreshView(TokenRefreshView):
    throttle_scope = 'refresh_token'

class MyCreatorTokenSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        serializer= UserSerializerWithToken(self.user).data

        for k, v in serializer.items():
            data[k] = v

        return data
    
class MyCreatorTokenView(TokenObtainPairView):
    serializer_class=MyCreatorTokenSerializer


#ایجاد ویو
#آپدیت کردن اطلاعات کاربر
    #یک ویو داریم که با متد پوت صدا زده میشه 
@api_view(['PUT'])
#الزام هست که پرمیشن کلاسز باید آتوکیشن باشه و دسترسی رو محدود می کنه پس به این دلیل هست که به ما در پست من خطای پیغام از پیش ساخته شده نمایش میدهد
@permission_classes([IsAuthenticated])
def updateUserProfile(request): #تابع که ریکوست رو بهش پاس میدیم
        user = request.user #با استفاده از شی ریکوست یوزر رو میگیریم# یوزر  همون کاربره
        data = request.data #و داخل شی ریکوست دیتاها رو میگیرم# اطلاعات یا دیتاهایی که مربوط به یوزر هست
        
        #اطلاعات کاربر 
    
            
        user.first_name = data['name']
        user.email = data['email']
        user.username = data['email']
        #برای پسورد ممکنه کاربر نخواد پسوردش رو آپدیت بکنه بنابراین یک شرطی رو مینویسیم
        #اگر دیتا پسوردش نامساوی با استرینگ خالی بود یعنی پر بود
        if data['password'] != '':
            #نباید پسورد رو به صورت خام توی دیتا بیس ذخیره کنیم که اشتباهه باید از تابع میک پسورد استفاده کنیم
            #پسورد میریزیم توی میک پسورد بعد حش شده میک پسورد رو میریزم توی یوزر پسورد
            user.password = make_password(data['password'])
        #در نهایت ذخیره بکن
        user.save()
        #از کدوم سریالایزر استفاده کنیم 
        serializr = UserSerializerWithToken(user, many=False)
        return Response(serializr.data)


#پروفایل کاربر رو میده
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user = request.user
    serializer = UserSerializer(user, many= False)
    return Response(serializer.data)



#USER_ADMIN: salehi12@gmail.com
#PASSWORD: 123456

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    users= User.objects.all()
    serializer= UserSerializer(users, many=True)
    return Response(serializer.data)


 #registerثبت نام
@api_view(['POST'])
def registerUser(request):
    data = request.data
    try:
        # ساخت کاربر با وضعیت فعال (True)
        user = User.objects.create(
            first_name=data['name'],
            username=data['email'],
            email=data['email'],
            password=make_password(data['password']),
            is_active=True  # ← اینجا به True تغییر کرد
        )
        
        # از آنجایی که کاربر فعال است، دیگر نیازی به ارسال ایمیل نیست
        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data)

    except Exception as e:
        # اگر کاربر از قبل وجود داشته باشد
        try:
            user = User.objects.get(username=data['email'])
            user.password = make_password(data['password'])
            user.is_active = True # کاربر قبلی را هم فعال می‌کنیم
            user.save()
            serializer = UserSerializerWithToken(user, many=False)
            return Response(serializer.data)
        except:
            message = {'detail': 'User with this email already exists.'}
            return Response(message, status=status.HTTP_400_BAD_REQUEST)


#  #registerثبت نام
# @api_view(['POST'])
# def registerUser(request):
#     data= request.data
    
#     try:
#         user = User.objects.create(
#             first_name = data['name'],
#             username= data['email'],
#             email = data['email'],
#             password= make_password(data['password']),
#             is_active=False,
#         )

#         #serializer= UserSerializerWithToken(user, many=False)
#         #return Response(serializer.data)
#     #except:
#         #message = {'detail' : 'User with this email already exists.'}

#         #return Response(message, status=status.HTTP_400_BAD_REQUEST)

#          # create token
#         token = RefreshToken.for_user(user).access_token

#         # send activation email to user
#         subject = f"E-Shop Activation email"
#         body = f"Hi {user.username} welcome to E-Shop.\n Please use below link for active your account! \n\n" \
#             f"http://127.0.0.1:8000/api/v1/users/verify/{str(token)}/"

#         data = {
#             'subject': subject,
#             'body': body,
#             'to': user.email,
#         }
#         result = emailSender(data)

#         if result:
#             message = {
#                 'detail': 'Welcome to E-Shop. You should verify your email.Please check your Inbox. We sent an email.'
#             }
#             return Response(message, status=status.HTTP_201_CREATED)
#         else:
#             message = {
#                 'detail': 'There\'s a problem on sending email.'
#             }
#             return Response(message, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#     except:
#         user = User.objects.get(username=username)

#         # update the user's password
#         user.password = make_password(password)
#         user.save()

#         if user and not user.is_active:

#             # create token
#             token = RefreshToken.for_user(user).access_token

#             # send activation email to user
#             subject = f"E-Shop Activation email"
#             body = f"Hi {user.username} welcome back to E-Shop.\n Please use below link for active your account! \n\n" \
#                 f"http://127.0.0.1:8000/api/v1/users/verify/{str(token)}/"

#             data = {
#                 'subject': subject,
#                 'body': body,
#                 'to': user.email,
#             }
#             result = emailSender(data)

#             if result:
#                 message = {
#                     'detail': 'User with this email already exists but is not active. You should verify your email.Please check your Inbox. We sent an email.Using new password'
#                 }
#                 return Response(message, status=status.HTTP_400_BAD_REQUEST)
#             else:
#                 message = {
#                     'detail': 'There\'s a problem on sending email.'
#                 }
#                 return Response(message, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#         elif user and user.is_active:
#             message = {
#                 'detail': 'User with this email already exists and is active too. Please login.Using new password'
#             }
#             return Response(message, status=status.HTTP_400_BAD_REQUEST)
 

@api_view(['GET'])
def verifyEmail(request, token):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, ['HS256'])
        user = User.objects.get(id=payload['user_id'])
        user.is_active = True
        user.save()
        return HttpResponseRedirect('http://localhost:3000/login?tokne=success')
    except:
        return HttpResponseRedirect('http://localhost:3000/login?token=fail')
    

    

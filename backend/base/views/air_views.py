from django.http import HttpResponseRedirect
from base.models import Idpay, Order
from base.utils.pay_utils import zibalVerify, zibalCompleteDB, zibalUpdateDB
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework import status

@api_view(['GET'])
@permission_classes([])
@authentication_classes([])
def IdPayCallBack(request):
    track_id = request.GET.get('trackId')
    order_id = request.GET.get('orderId')

    if not track_id:
        return Response({'detail': 'Invalid callback parameters'},
                        status=status.HTTP_400_BAD_REQUEST)

    try:
        pay_entry = Idpay.objects.get(transId=str(track_id))
        order = pay_entry.order
    except Idpay.DoesNotExist:
        return Response({'detail': 'Transaction not found'},
                        status=status.HTTP_404_NOT_FOUND)

    # آدرس فرانت‌اند شما
    frontend_url = "https://my-eshop-frontend.nazanin40587.workers.dev"

    # اگر قبلاً پرداخت شده، دوباره verify نکن
    if order.isPaid:
        return HttpResponseRedirect(
            f"{frontend_url}/payresult/{track_id}/{order._id}/{track_id}?db=True"
        )

    # تأیید تراکنش در زیبال
    try:
        response = zibalVerify(track_id)
    except Exception:
        dbStatus = zibalUpdateDB(pay_entry, 500, track_id)
        return HttpResponseRedirect(
            f"{frontend_url}/payresult/{track_id}/{order._id}/{track_id}?db={dbStatus}"
        )

    if str(response.status_code).startswith('2'):
        resJson = response.json()
        result = resJson.get('result')
        if result == 100:
            dbStatus = zibalCompleteDB(track_id, resJson)
        else:
            dbStatus = zibalUpdateDB(pay_entry, result, track_id)
        return HttpResponseRedirect(
            f"{frontend_url}/payresult/{track_id}/{order._id}/{track_id}?db={dbStatus}"
        )
    else:
        dbStatus = zibalUpdateDB(pay_entry, 500, track_id)
        return HttpResponseRedirect(
            f"{frontend_url}/payresult/{track_id}/{order._id}/{track_id}?db={dbStatus}"
        )
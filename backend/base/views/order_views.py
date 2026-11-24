from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from base.models import Product, Order, OrderItem, ShippingAddress, Idpay
from base.serializers import OrderSerializer
from base.utils.pay_utils import (
    zibalCreateDB,
    zibalUpdateDB,
    zibalCompleteDB,
    zibalCreatePay,
    makeZibalResult,
)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    user = request.user
    data = request.data

    orderItems = data['orderItems']

    if orderItems and len(orderItems) == 0:
        return Response({'detail': 'No Order Items'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        order = Order.objects.create(
            user=user,
            paymentMethod=data['paymentMethod'],
            taxPrice=data['taxPrice'],
            shippingPrice=data['shippingPrice'],
            totalPrice=data['totalPrice'],
        )

        ShippingAddress.objects.create(
            order=order,
            address=data['shippingAddress']['address'],
            city=data['shippingAddress']['city'],
            country=data['shippingAddress']['country'],
            postalCode=data['shippingAddress']['postalCode'],
        )

        for i in orderItems:
            product = Product.objects.get(_id=i['product'])
            item = OrderItem.objects.create(
                product=product,
                order=order,
                name=product.name,
                qty=i['qty'],
                price=i['price'],
                image=product.image.url
            )
            product.countInStock -= item.qty
            product.save()

        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyOrders(request):
    user = request.user
    orders = user.order_set.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderById(request, pk):
    try:
        user = request.user
        order = Order.objects.get(_id=pk)

        if user.is_staff or order.user == user:
            serializer = OrderSerializer(order, many=False)
            return Response(serializer.data)
        else:
            return Response({'detail': 'Not authorized to view this order !'},
                            status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response({'detail': 'Order does not exist !'},
                        status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def payOrder(request, pk):
    user = request.user

    try:
        order = Order.objects.get(_id=pk)
    except Order.DoesNotExist:
        return Response({'detail': 'Order not found !'}, status=status.HTTP_404_NOT_FOUND)

    if order.isPaid:
        return Response({'detail': 'Order has already been paid !'},
                        status=status.HTTP_400_BAD_REQUEST)

    # ایجاد پرداخت در زیبال
    try:
        response = zibalCreatePay(order)
    except Exception as e:
        return Response({'detail': 'The zibal server connection was not established !'},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    if not str(response.status_code).startswith('2'):
        return Response({'detail': 'Zibal error: ' + response.text},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    resJson = response.json()
    if resJson.get('result') != 100:
        return Response({'detail': 'Zibal error code: ' + str(resJson.get('result'))},
                        status=status.HTTP_400_BAD_REQUEST)

    track_id = resJson.get('trackId')
    if not zibalCreateDB(user, order, track_id):
        return Response({'detail': 'db error !'},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    link = f"https://gateway.zibal.ir/start/{track_id}"
    return Response({'link': link}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def inquiryPay(request, pk):
    """
    استعلام وضعیت تراکنش از دیتابیس (بدون تماس با زیبال).
    برای سازگاری با فرانت‌اند نگه داشته شده است.
    """
    try:
        data = request.data
        user = request.user
        track_id = data.get('track_id')
        order = Order.objects.get(_id=pk)
        pay_entry = Idpay.objects.get(transId=str(track_id), user=user, order=order)
    except Exception:
        return Response({'detail': 'Transaction details not found!'},
                        status=status.HTTP_404_NOT_FOUND)

    return Response(
        makeZibalResult(pay_entry.lastStatus, order._id, track_id),
        status=status.HTTP_200_OK
    )
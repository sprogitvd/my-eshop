
from rest_framework. decorators import api_view, throttle_classes
from rest_framework. response import Response
from rest_framework.throttling import UserRateThrottle, AnonRateThrottle


from base. models import Product
from base.serializers import ProductSerializer



@api_view(http_method_names=['GET'])
#throttle_classes([UserRateThrottle, AnonRateThrottle])
def getProducts(request):
    products= Product.objects.all()
    serializers= ProductSerializer(products, many=True)
    return Response(serializers.data)


@api_view(http_method_names=['GET'])
def getProduct(request, pk):
    product= Product.objects.get(_id=pk)
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)

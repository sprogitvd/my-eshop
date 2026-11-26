import requests

from base.models import Idpay, Order

from django.utils.dateparse import parse_datetime
from django.utils.timezone import make_aware, is_naive


# ============================================================
# تنظیمات زیبال
# ============================================================
# در حالت سندباکس (تست) مقدار merchant را "zibal" بگذارید.
# برای استفاده واقعی، Merchant Code خود را از پنل زیبال جایگزین کنید.
ZIBAL_MERCHANT = "zibal"

ZIBAL_REQUEST_URL = "https://gateway.zibal.ir/v1/request"
ZIBAL_VERIFY_URL = "https://gateway.zibal.ir/v1/verify"


def _parse_zibal_datetime(value):
    """تبدیل تاریخ ISO زیبال به datetime آگاه از timezone."""
    if not value:
        return None
    dt = parse_datetime(value)
    if dt is None:
        return None
    if is_naive(dt):
        dt = make_aware(dt)
    return dt


def zibalCreatePay(order):
    # محاسبه مبلغ و اعمال حداقل ۱۰۰۰۰ ریال برای تست
    calculated_amount = int(order.totalPrice * 10)
    final_amount = max(calculated_amount, 10000) 
    
    body = {
        "merchant": ZIBAL_MERCHANT,
        "amount": final_amount,  # ← استفاده از مبلغ نهایی
        "callbackUrl": "https://my-eshop-backend-e6mg.onrender.com/api/v1/air/result/", 
        "description": f"Order {str(order._id)}",
        "orderId": str(order._id),
    }
    # ...

    response = requests.post(
        ZIBAL_REQUEST_URL,
        json=body,
        timeout=15
    )
    return response


def zibalVerify(track_id):
    """
    تأیید تراکنش در سرور زیبال.
    ورودی: track_id (رشته‌ای که زیبال هنگام ایجاد پرداخت برگردانده)
    خروجی: پاسخ HTTP از زیبال (response)
    """
    body = {
        "merchant": ZIBAL_MERCHANT,
        "trackId": track_id,
    }

    response = requests.post(
        ZIBAL_VERIFY_URL,
        json=body,
        timeout=15
    )
    return response


def zibalCreateDB(user, order, track_id):
    """
    ایجاد رکورد تراکنش در دیتابیس با استفاده از trackId زیبال.
    """
    try:
        Idpay.objects.create(
            user=user,
            order=order,
            transId=str(track_id),        # ذخیره trackId در فیلد transId
            lastStatus=0,
            amountCreate=int(order.totalPrice * 10)
        )
        return True
    except Exception as e:
        print("zibalCreateDB error:", e)
        return False


def zibalUpdateDB(pay_entry, lastStatus, refNumber=None):
    """
    به‌روزرسانی وضعیت تراکنش.
    """
    try:
        pay_entry.lastStatus = lastStatus
        if refNumber is not None:
            pay_entry.trackShaparak = str(refNumber)
        pay_entry.save()
        return True
    except Exception as e:
        print("zibalUpdateDB error:", e)
        return False


def zibalCompleteDB(track_id, data):
    """
    تکمیل تراکنش با استفاده از track_id دریافتی از Callback
    و داده‌های پاسخ verify.
    """
    try:
        # ۱. پیدا کردن رکورد پرداخت با track_id معتبر از Callback
        pay = Idpay.objects.get(transId=str(track_id))

        # ۲. به‌روزرسانی اطلاعات پرداخت
        pay.lastStatus = data.get('result', 0)
        pay.trackShaparak = str(data.get('refNumber', ''))
        pay.amountPaid = int(data.get('amount', 0))
        pay.cardNo = str(data.get('cardNumber', ''))

        pay.dateShaparak = _parse_zibal_datetime(data.get('paidAt'))
        pay.dateVerify = _parse_zibal_datetime(data.get('verifiedAt'))
        pay.save()

        # ۳. علامت‌گذاری سفارش به‌عنوان پرداخت‌شده
        order = pay.order
        order.isPaid = True
        order.paidAt = _parse_zibal_datetime(data.get('paidAt'))
        order.save()

        return True
    except Exception as e:
        print("zibalCompleteDB error:", e)
        return False

def makeZibalResult(result_code, order_id, track_id, message=""):
    """
    ساخت پاسخ استاندارد برای فرانت‌اند.
    """
    success = (result_code == 100)
    if not message:
        messages = {
            100: "پرداخت با موفقیت انجام شد",
            102: "مرچنت نامعتبر است",
            103: "مرچنت فعال نشده است",
            104: "مرچنت نامعتبر است",
            105: "مبلغ باید بیشتر از ۱۰۰۰ ریال باشد",
            201: "قبلاً تأیید شده است",
            202: "سفارش یافت نشد",
            203: "تراکنش یافت نشد",
        }
        message = messages.get(result_code, f"کد وضعیت ناشناخته: {result_code}")

    return {
        'message': message,
        'success': success,
        'status': result_code,
        'order_id': order_id,
        'track_id': track_id,
    }
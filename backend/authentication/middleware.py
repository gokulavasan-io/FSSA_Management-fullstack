import jwt
from django.conf import settings
from django.http import JsonResponse
from teacher.models import Member

class AuthenticationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        token = request.COOKIES.get("session_token")

        if not token:
            request.user_email = None  # No valid session
        else:
            try:
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
                email = payload.get("email")
                user = Member.objects.filter(email=email).first()
                if user:
                    request.user_email = email  # Valid user
                else:
                    request.user_email = None  # User not found
            except jwt.ExpiredSignatureError:
                request.user_email = None  # Token expired
            except jwt.InvalidTokenError:
                request.user_email = None  # Invalid token

        return self.get_response(request)

import jwt
from django.conf import settings
from django.http import JsonResponse

def authenticate_user(view_func):
    def wrapper(self, request, *args, **kwargs):
        django_request = request._request  
        token = django_request.COOKIES.get("session_token")

        if not token:
            return JsonResponse({"error": "Unauthorized"}, status=401)

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            request.user_email = payload.get("email")  
        except jwt.ExpiredSignatureError:
            return JsonResponse({"error": "Session expired"}, status=401)
        except jwt.InvalidTokenError:
            return JsonResponse({"error": "Invalid token"}, status=401)

        return view_func(self, request, *args, **kwargs)


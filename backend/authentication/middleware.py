import jwt
from django.conf import settings
from django.http import JsonResponse
from teacher.models import Member

class AuthenticationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.excluded_paths = ["/auth/google/"]

    def __call__(self, request):
        if request.path in self.excluded_paths:
            return self.get_response(request)

        token = request.COOKIES.get("session_token")
        if not token:
            request.user = None 
            return self.get_response(request)

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            email = payload.get("email")
            user = Member.objects.filter(email=email).first()

            if user:
                request.user = user 
            else:
                request.user = None
                return JsonResponse({"error": "User not found"}, status=403)

        except jwt.ExpiredSignatureError:
            request.user = None
            return JsonResponse({"error": "Session expired"}, status=401)
        except jwt.InvalidTokenError:
            request.user = None
            return JsonResponse({"error": "Invalid token"}, status=401)

        return self.get_response(request)

import jwt
from django.conf import settings
from django.http import JsonResponse
from teacher.models import Member
from rest_framework import status

class AuthenticationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.excluded_paths = ["/api/v1/auth/google/"]

    def __call__(self, request):
        if request.path in self.excluded_paths:
            return self.get_response(request)
        setattr(request, "_dont_enforce_csrf_checks", True)
        token = request.COOKIES.get("session_token")
        if not token:
            return JsonResponse({"error": "No Session Token"}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            email = payload.get("email")
            user = Member.objects.filter(email=email).first()
            
            if user:
                request.user = user
            else:
                return JsonResponse({"error": "User not found"}, status=status.HTTP_401_UNAUTHORIZED)
            
        except jwt.ExpiredSignatureError:
            return JsonResponse({"error": "Session expired"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return JsonResponse({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)

        return self.get_response(request)

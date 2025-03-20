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
            return JsonResponse({"error": "Unauthorized"}, status=401)  # ✅ Use JsonResponse

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            email = payload.get("email")
            user = Member.objects.filter(email=email).first()
            
            if user:
                request.user_email = email  # ✅ Store authenticated email
            else:
                return JsonResponse({"error": "User not found"}, status=403)  # ✅ Return 403 Forbidden if user not found
            
        except jwt.ExpiredSignatureError:
            return JsonResponse({"error": "Session expired"}, status=401)  # ✅ Return 401 if token expired
        except jwt.InvalidTokenError:
            return JsonResponse({"error": "Invalid token"}, status=401)  # ✅ Return 401 for invalid token

        return self.get_response(request)  # ✅ Always call get_response

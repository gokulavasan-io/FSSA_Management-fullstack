from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
import jwt
from django.conf import settings
from teacher.models import Member

class JWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        token = request.COOKIES.get("session_token")

        if not token:
            return None 

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            email = payload.get("email")
            user = Member.objects.filter(email=email).first()

            if not user:
                raise AuthenticationFailed("User not found")

            return (user, None)  

        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Session expired")
        except jwt.InvalidTokenError:
            raise AuthenticationFailed("Invalid token")

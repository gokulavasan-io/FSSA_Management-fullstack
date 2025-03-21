from rest_framework.views import APIView
from rest_framework.response import Response
from google.oauth2 import id_token
from google.auth.transport import requests
from rest_framework import status
from teacher.models import Member
import jwt
import datetime
from django.conf import settings
from teacher.serializers import MemberSerializer
from rest_framework.permissions import IsAuthenticated


class GoogleAuthView(APIView):
    def post(self, request):
        token = request.data.get("token")
        client_id = "113196780562-bu0lqo92v9ap0b5tbnnhhgbf00m68tsf.apps.googleusercontent.com"

        try:
            # Verify the token with Google's OAuth API
            id_info = id_token.verify_oauth2_token(token, requests.Request(), client_id)
            email = id_info.get("email")

            if not email:
                return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

            # Check if the email exists in the Member model
            user = Member.objects.filter(email=email).first()
            if not user:
                return Response({"error": "Access denied"}, status=status.HTTP_403_FORBIDDEN)

            # Generate JWT token for session
            payload = {
                "email": email,
                "exp": datetime.datetime.utcnow() + datetime.timedelta(days=30), 
                "iat": datetime.datetime.utcnow(),
            }
            session_token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")

            # Set the session token in an HTTP-only cookie
            response = Response({"message": "Login successful", "email": email})
            response.set_cookie(
                key="session_token",
                value=session_token,
                httponly=True,
                secure=True, 
                samesite="Lax",
                max_age=30 * 24 * 60 * 60 
            )


            return response

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class CheckSessionView(APIView):
    permission_classes = [IsAuthenticated]  

    def get(self, request):
        return Response(
            {"isAuthenticated": True, "email": request.user.email, "userData": request.user.data},
            status=status.HTTP_200_OK,
        )


class LogoutView(APIView):
    def post(self, request):
        response = Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
        response.delete_cookie("session_token")
        return response
    
    from rest_framework.permissions import IsAuthenticated


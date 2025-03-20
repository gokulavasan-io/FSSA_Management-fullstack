from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from google.oauth2 import id_token
from google.auth.transport import requests
from rest_framework import status
from teacher.models import Member


class GoogleAuthView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get("token")
        client_id = "113196780562-bu0lqo92v9ap0b5tbnnhhgbf00m68tsf.apps.googleusercontent.com"

        try:
            # Verify the token with Google's OAuth API
            id_info = id_token.verify_oauth2_token(token, requests.Request(), client_id)
            email = id_info.get("email")

            if not email:
                return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

            # Check if the email exists in our User model
            user = Member.objects.filter(email=email).first()

            if user:
                return Response({"message": "Access allowed", "email": email}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Access denied"}, status=status.HTTP_403_FORBIDDEN)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

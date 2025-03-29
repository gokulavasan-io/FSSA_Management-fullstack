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
from django.conf import settings
from validators.query_params_validator import validate_query_params
from validators.null_validator import validate_to_none,validate_not_none



class GoogleAuthView(APIView):
    
    def post(self, request):
        token = request.data.get("token")
        client_id = settings.GOOGLE_CLIENT_ID
        
        validate_not_none(google_auth_token=token,google_client_id=client_id)

        try:
            # Verify the token with Google's OAuth
            id_info = id_token.verify_oauth2_token(token, requests.Request(), client_id)
            email = id_info.get("email")

            if not email:
                return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

            # Check if the email exists in the Member model
            user = Member.objects.filter(email=email).first()
            if not user:
                return Response({"error": "Access denied"}, status=status.HTTP_401_UNAUTHORIZED)
            
            user.image_link = id_info.get("picture", "")  
            user.save()
            # Generate JWT token for session
            payload = {
                "email": email,
                "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=30), 
                "iat": datetime.datetime.now(datetime.timezone.utc),
            }
            session_token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
            
            ''''
            HMAC (Hash-based Message Authentication Code):
            HMAC is a type of cryptographic hash function that uses a secret key to generate a message authentication code (MAC). 
            SHA-256 (Secure Hash Algorithm 256-bit):
            SHA-256 is a cryptographic hash function that produces a 256-bit hash value. 
            Symmetric Algorithm:
            In HS256, the same secret key is used for both signing (encode) and verifying (decode) the JWT, making it a symmetric algorithm. 
            '''

            # Set the session token in an HTTP-only cookie
            response = Response({"message": "Login successful", "id": MemberSerializer(user).data.get("id")})
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

class UserIdView(APIView): 
    def get(self, request):
        return Response(
            {"id": request.user.id},
            status=status.HTTP_200_OK,
        )


class LogoutView(APIView):
    def post(self, request):
        response = Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
        response.delete_cookie("session_token")
        return response
    


from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from .models import *
from .serializers import MemberSerializer
from django.core.exceptions import ObjectDoesNotExist

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Member
from firebase_admin import auth
from django.core.exceptions import ObjectDoesNotExist
from .firebaseAdminSDK import initialize_firebase

# Initialize Firebase
initialize_firebase()

class FirebaseTokenVerifyView(APIView):
    def post(self, request):
        token = request.data.get("token")

        if not token:
            return Response({"error": "Token is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Verify the Firebase token
            decoded_token = auth.verify_id_token(token)
            uid = decoded_token["uid"]
            email = decoded_token.get("email") 

            try:
                member = Member.objects.get(email=email)  # Assuming email is unique for each member
            except ObjectDoesNotExist:
                return Response({"error": "You are not a registered member."}, status=status.HTTP_403_FORBIDDEN)

            # Successfully verified the token and found the member
            return Response({
                "message": "Token verified and member authenticated.",
                "uid": uid,
                "email": email,
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)



class MemberCreateView(generics.CreateAPIView):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer

    def create(self, request, *args, **kwargs):
        email = request.data.get("email")

        if Member.objects.filter(email=email).exists():
            return Response({"error": "User already exists"}, status=status.HTTP_400_BAD_REQUEST)

        return super().create(request, *args, **kwargs)

# List all members
class MemberListView(generics.ListAPIView):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer


# Delete a member
class MemberDeleteView(generics.DestroyAPIView):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer
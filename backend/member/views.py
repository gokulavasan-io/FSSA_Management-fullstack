from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework import generics
from .models import *
from .serializers import *
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status
from firebase_admin import auth
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
            email = decoded_token.get("email") 

            try:
                member = Member.objects.get(email=email)
                member_data=MemberSerializer(member).data
                return Response({
                    "message": "Token verified and member authenticated.",
                    "email": email,
                    'member':member_data,
                }, status=status.HTTP_200_OK)
                
            except ObjectDoesNotExist:
                return Response({"error": "You are not a registered member."}, status=status.HTTP_403_FORBIDDEN)
            
        except Exception as e:
            return Response({"error": "An error occurred during token verification."}, status=status.HTTP_400_BAD_REQUEST)


class MemberCreateView(generics.CreateAPIView):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer


# List all members
class MemberListView(generics.ListAPIView):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer


# Delete a member
class MemberDeleteView(generics.DestroyAPIView):
    queryset = Member.objects.all()
    lookup_field = 'id'
    
# Update a member
class MemberUpdateView(generics.UpdateAPIView):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer
    lookup_field = 'id'


class RoleListView(generics.ListAPIView):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer


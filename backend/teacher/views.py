from rest_framework import status,viewsets
from rest_framework.views import APIView
from .models import *
from .serializers import *
from rest_framework.response import Response

class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer




class MemberViewSet(viewsets.ModelViewSet):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer

    

class UserInfoView(APIView):
    def get(self,request):
        user_info=MemberSerializer(request.user).data
        return Response(user_info,status=status.HTTP_200_OK)
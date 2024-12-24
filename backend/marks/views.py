from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import MarkCreateSerializer

class MarkCreateView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = MarkCreateSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()  # This will create the mark records in the database
            return Response({"message": "Marks added successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

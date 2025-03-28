from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics,viewsets
from .models import *
from .serializers import *


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Students.objects.all()
    serializer_class = StudentSerializer

class SectionViewSet(viewsets.ModelViewSet):
    queryset = Section.objects.all()
    serializer_class = SectionSerializer

class BatchListCreateView(generics.ListCreateAPIView):
    queryset = Batch.objects.all()
    serializer_class = BatchSerializer

class BatchDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Batch.objects.all()
    serializer_class = BatchSerializer

class StudentBaseDataChoicesView(APIView):
    def get(self, request):
        return Response({
            "categories": [{"value": c[0], "label": c[1]} for c in CATEGORY_CHOICES],
            "mediums": [{"value": m[0], "label": m[1]} for m in MEDIUM_CHOICES],
            "schools": [{"value": s[0], "label": s[1]} for s in SCHOOL_CHOICES],
            "genders": [{"value": g[0], "label": g[0]} for g in GENDER_CHOICES],
            "batches": BatchSerializer(Batch.objects.all(), many=True).data,
            "sections": SectionSerializer(Section.objects.all(), many=True).data,
        })

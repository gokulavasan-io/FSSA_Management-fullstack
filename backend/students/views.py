from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import ListAPIView
from django.shortcuts import get_object_or_404
from .models import *
from .serializers import *
from rest_framework import generics

class StudentListCreateAPIView(APIView):
    def get(self, request):
        students = Students.objects.all()
        serializer = StudentSerializer(students, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = StudentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class StudentRetrieveUpdateDeleteAPIView(APIView):
    def get(self, request, pk):
        student = get_object_or_404(Students, pk=pk)
        serializer = StudentSerializer(student)
        return Response(serializer.data)

    def put(self, request, pk):
        student = get_object_or_404(Students, pk=pk)
        serializer = StudentSerializer(student, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, pk):
        student = get_object_or_404(Students, pk=pk)
        student.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class ChoicesAPIView(APIView):
    def get(self, request):
        categories = [{"value": c[0], "label": c[1]} for c in CATEGORY_CHOICES]
        mediums = [{"value": m[0], "label": m[1]} for m in MEDIUM_CHOICES]
        schools = [{"value": s[0], "label": s[1]} for s in SCHOOL_CHOICES]
        genders = [{"value": g[0], "label": g[0]} for g in GENDER_CHOICES]
        batches = BatchSerializer(Batch.objects.all(), many=True).data
        sections = SectionSerializer(Section.objects.all(), many=True).data

        return Response({
            "categories": categories,
            "mediums": mediums,
            "schools": schools,
            "batches": batches,
            "genders": genders,
            "sections": sections,
        })



class SectionListCreateAPIView(APIView):
    def get(self, request):
        sections = Section.objects.all()
        serializer = SectionSerializer(sections, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = SectionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SectionRetrieveUpdateDeleteAPIView(APIView):
    def get(self, request, pk):
        section = get_object_or_404(Section, pk=pk)
        serializer = SectionSerializer(section)
        return Response(serializer.data)

    def put(self, request, pk):
        section = get_object_or_404(Section, pk=pk)
        serializer = SectionSerializer(section, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        section = get_object_or_404(Section, pk=pk)
        section.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



class BatchCreateView(generics.CreateAPIView):
    queryset = Batch.objects.all()
    serializer_class = BatchSerializer

# ✅ List Batches
class BatchListView(generics.ListAPIView):
    queryset = Batch.objects.all()
    serializer_class = BatchSerializer

# ✅ Retrieve, Update, Delete (RUD)
class BatchDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Batch.objects.all()
    serializer_class = BatchSerializer
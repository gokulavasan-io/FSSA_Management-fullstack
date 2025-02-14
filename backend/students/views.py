from rest_framework import status,generics
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import *
from .serializers import *

class SectionCreateView(generics.CreateAPIView):
    queryset = Section.objects.all()
    serializer_class = SectionSerializer


class StudentsData(APIView):
    def post(self, request):
        serializer = StudentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


    def get(self, request):
        students = Students.objects.all()

        section = request.query_params.get('section', None)
        if section:
            students = students.filter(section=section)

        gender = request.query_params.get('gender', None)
        if gender:
            students = students.filter(gender=gender)

        category = request.query_params.get('category', None)
        if category:
            students = students.filter(category=category)

        medium = request.query_params.get('medium', None)
        if medium:
            students = students.filter(medium=medium)

        school = request.query_params.get('school', None)
        if school:
            students = students.filter(school=school)

        serializer = StudentSerializer(students, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class StudentNamesView(APIView):
    def get(self, request):
        students = Students.objects.all()

        section_name = request.query_params.get('section', None)

        if section_name:
            students = students.filter(section__name=section_name)

        student_names = list(students.values_list('name', flat=True))
        return Response(student_names, status=status.HTTP_200_OK)


class SectionListView(generics.ListAPIView):
    queryset = Section.objects.all()
    serializer_class = SectionSerializer
   
class ChoicesAPIView(APIView):
    def get(self, request):
        categories = [{"value": c[0], "label": c[1]} for c in CATEGORY_CHOICES]
        mediums = [{"value": m[0], "label": m[1]} for m in MEDIUM_CHOICES]
        schools = [{"value": s[0], "label": s[1]} for s in SCHOOL_CHOICES]
        genders=[{"value":g[0],"label":g[0]} for g in GENDER_CHOICES]
        batches = BatchSerializer(Batch.objects.all(), many=True).data
        sections = SectionSerializer(Section.objects.all(), many=True).data

        return Response({
            "categories": categories,
            "mediums": mediums,
            "schools": schools,
            "batches": batches,
            "genders":genders,
            "sections":sections,
        })
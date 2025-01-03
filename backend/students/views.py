from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import *
from .serializers import *

class SectionCreateView(APIView):
    def post(self, request):
        sections_data = request.data.get("sections", [])

        created_sections = []

        for section_name in sections_data:
            if Section.objects.filter(name=section_name).exists():
                continue

            section_data = {"name": section_name}
            serializer = SectionSerializer(data=section_data)

            if serializer.is_valid():
                serializer.save()
                created_sections.append(serializer.data['name'])
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        if created_sections:
            return Response({"created_sections": created_sections}, status=status.HTTP_201_CREATED)

        return Response({"message": "No new sections created."}, status=status.HTTP_400_BAD_REQUEST)


class StudentsData(APIView):
    def post(self, request, *args, **kwargs):
        students_data = request.data.get('students', [])

        if not students_data:
            return Response({"message": "No students data provided."}, status=status.HTTP_400_BAD_REQUEST)

        created_students = []

        for student_data in students_data:
            section_name = student_data.get('section', '')
            try:
                section = Section.objects.get(name=section_name)
            except Section.DoesNotExist:
                return Response({"message": f"Section {section_name} does not exist."}, status=status.HTTP_400_BAD_REQUEST)

            student_data['section'] = section.id

            serializer = StudentSerializer(data=student_data)

            if serializer.is_valid():
                serializer.save()
                created_students.append(serializer.data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response({"created_students": created_students}, status=status.HTTP_201_CREATED)

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

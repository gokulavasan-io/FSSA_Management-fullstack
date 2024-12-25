from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import *
from .serializers import *

class SectionCreateView(APIView):
    def post(self, request):
        # Extract sections data from the request
        sections_data = request.data.get("sections", [])  # Expecting a list of sections like ["A", "B", "C"]

        created_sections = []  # To keep track of created sections
        
        for section_name in sections_data:
            # Check if the section already exists
            if Section.objects.filter(name=section_name).exists():
                continue  # Skip this section if it already exists

            # Prepare data for serialization
            section_data = {"name": section_name}
            serializer = SectionSerializer(data=section_data)
            
            if serializer.is_valid():
                # Save the section if valid
                serializer.save()
                created_sections.append(serializer.data['name'])  # Add the section name to the response list
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        if created_sections:
            return Response({"created_sections": created_sections}, status=status.HTTP_201_CREATED)
        
        return Response({"message": "No new sections created."}, status=status.HTTP_400_BAD_REQUEST)


class StudentsData(APIView):
    def post(self, request, *args, **kwargs):
        # Extract list of students from the request
        students_data = request.data.get('students', [])
        
        if not students_data:
            return Response({"message": "No students data provided."}, status=status.HTTP_400_BAD_REQUEST)

        created_students = []  # To track created students

        for student_data in students_data:
            # Ensure that section exists in the database
            section_name = student_data.get('section', '')
            try:
                section = Section.objects.get(name=section_name)
            except Section.DoesNotExist:
                return Response({"message": f"Section {section_name} does not exist."}, status=status.HTTP_400_BAD_REQUEST)

            # Add the section object to the student data
            student_data['section'] = section.id  # Set the section ID in the data

            # Create the student serializer instance with the provided data
            serializer = StudentSerializer(data=student_data)

            if serializer.is_valid():
                # Save the student if the data is valid
                serializer.save()
                created_students.append(serializer.data)  # Add student data to the created list
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

        # Get the section query parameter
        section_name = request.query_params.get('section', None)

        if section_name:
            # Filter students by the name of the related Section model
            students = students.filter(section__name=section_name)

        student_names = list(students.values_list('name', flat=True))
        return Response(student_names, status=status.HTTP_200_OK)

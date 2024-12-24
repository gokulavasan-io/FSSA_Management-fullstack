from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import *
from .serializers import *



class StudentDataView(APIView):
    def post(self, request):
        students_data = request.data.get('students', [])
        
        if not students_data:
            return Response({"message": "No students data provided."}, status=status.HTTP_400_BAD_REQUEST)

        created_students = [] 

        for student_data in students_data:
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

        section = request.query_params.get('section', None)
        if section:
            students = students.filter(section=section)

        student_names = list(students.values_list('name', flat=True))
        return Response(student_names, status=status.HTTP_200_OK)


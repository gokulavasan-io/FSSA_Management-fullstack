from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import *
from .serializers import *


class AddTestAndMarksView(APIView):
    def post(self, request):
        serializer = AddTestAndMarksSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data

            # Fetch related objects
            section = get_object_or_404(Section, name=data['section'])
            month = get_object_or_404(Month, month_name=data['month'])
            subject = get_object_or_404(Subject, subject_name=data['subject'])

            # Check if the TestDetail already exists
            test_detail, created = TestDetail.objects.get_or_create(
                section=section,
                test_name=data['test_name'],
                month=month,
                subject=subject,
                total_marks=data['total_marks']
            )

            # If the TestDetail was created, handle the students' marks
            students = data['students']
            for student_data in students:
                student_name = student_data['student_name']
                student = get_object_or_404(Students, name=student_name)

                Marks.objects.create(
                    student=student,
                    mark=student_data['mark'],
                    average_mark=student_data['average_mark'],
                    remark=student_data.get('remark', ""),
                    test_detail=test_detail
                )

            return Response({
                "message": "TestDetail and Marks created successfully" if created else "TestDetail already exists",
                "test_detail_id": test_detail.id
            }, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

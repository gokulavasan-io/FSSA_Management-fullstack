from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import *
from .serializers import *
class AddTestAndMarksView(APIView):
    def post(self, request):
        try:
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
                    defaults={'total_marks': data['total_marks'], 'isArchived': data.get('isArchived', False)}
                )

                if not created:
                    # Update existing TestDetail
                    test_detail.total_marks = data['total_marks']
                    test_detail.isArchived = data.get('isArchived', test_detail.isArchived)
                    test_detail.save()

                # Process students' marks (common for both creation and updates)
                students = data['students']
                for student_data in students:
                    student_name = student_data['student_name']
                    student = get_object_or_404(Students, name=student_name)

                    # Ensure the student belongs to the specified section
                    if student.section != section:
                        return Response({
                            "error": f"Student {student_name} does not belong to section {section.name}."
                        }, status=status.HTTP_400_BAD_REQUEST)

                    # Update or create marks
                    Marks.objects.update_or_create(
                        student=student,
                        test_detail=test_detail,
                        defaults={
                            'mark': student_data['mark'],
                            'average_mark': student_data['average_mark'],
                            'remark': student_data.get('remark', "")
                        }
                    )

                # Return appropriate response
                return Response({
                    "message": "TestDetail and Marks created successfully" if created else "TestDetail and Marks updated successfully",
                    "test_detail_id": test_detail.id
                }, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

            # Handle invalid serializer input
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            # Log and return a server error response
            print(f"Unexpected error: {str(e)}")
            return Response({"error": "Internal Server Error. Please contact support."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class FetchTestNamesView(APIView):
    def get(self, request):
        # Extract section and month from query params
        section_name = request.query_params.get('section')
        month_name = request.query_params.get('month')

        # Validate input
        if not (section_name and month_name):
            return Response({"error": "Missing parameters."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Fetch section and month objects
            section = Section.objects.get(name=section_name)
            month = Month.objects.get(month_name=month_name)

            # Fetch test names for the given section and month
            test_names = TestDetail.objects.filter(section=section, month=month).values_list('test_name', flat=True)

            return Response({"test_names": list(test_names)}, status=status.HTTP_200_OK)
        except Section.DoesNotExist:
            return Response({"error": "Section not found."}, status=status.HTTP_404_NOT_FOUND)
        except Month.DoesNotExist:
            return Response({"error": "Month not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
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

                # Create a new TestDetail
                test_detail = TestDetail.objects.create(
                    section=section,
                    test_name=data['test_name'],
                    month=month,
                    subject=subject,
                    total_marks=data['total_marks'],
                    isArchived=data.get('isArchived', False)  # Default to False if not provided
                )

                # Process students' marks (only create)
                students = data['students']
                for student_data in students:
                    student_name = student_data['student_name']
                    student = get_object_or_404(Students, name=student_name)

                    # Ensure the student belongs to the specified section
                    if student.section != section:
                        return Response({
                            "error": f"Student {student_name} does not belong to section {section.name}."
                        }, status=status.HTTP_400_BAD_REQUEST)

                    # Create marks for the student
                    Marks.objects.create(
                        student=student,
                        test_detail=test_detail,
                        mark=student_data['mark'],
                        average_mark=student_data['average_mark'],
                        remark=student_data.get('remark', "")
                    )

                # Return success response
                return Response({
                    "message": "TestDetail and Marks created successfully",
                    "test_detail_id": test_detail.id
                }, status=status.HTTP_201_CREATED)

            # Handle invalid serializer input
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            # Log and return a server error response
            print(f"Unexpected error: {str(e)}")
            return Response({"error": "Internal Server Error. Please contact support."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GetTestAndMarksView(APIView):
    def get(self, request):
        try:
            # Get query parameters
            section_name = request.query_params.get('section')
            test_name = request.query_params.get('test_name')
            month_name = request.query_params.get('month')
            student_name = request.query_params.get('student_name', None) 

            # Validate if all required parameters are present
            if not (section_name and test_name and month_name):
                return Response({"error": "Missing required parameters: section, test_name, and month."},
                                status=status.HTTP_400_BAD_REQUEST)

            # Fetch related objects
            section = get_object_or_404(Section, name=section_name)
            month = get_object_or_404(Month, month_name=month_name)

            # Fetch the TestDetail for the specified section, test_name, and month
            test_detail = get_object_or_404(TestDetail, section=section, test_name=test_name, month=month)

            # Get all marks related to this test_detail
            marks_query = Marks.objects.filter(test_detail=test_detail)
            
            # If student_name is provided, filter marks for that student
            if student_name:
                student = get_object_or_404(Students, name=student_name)
                marks_query = marks_query.filter(student=student)
            
            # Prepare the response data
            marks_data = []
            for mark in marks_query:
                marks_data.append({
                    "student_name": mark.student.name,
                    "mark": mark.mark,
                    "average_mark": mark.average_mark,
                    "remark": mark.remark
                })

            return Response({
                "test_detail": {
                    "id": test_detail.id,
                    "test_name": test_detail.test_name,
                    "total_marks": test_detail.total_marks,
                    "isArchived": test_detail.isArchived,
                    "created_at": test_detail.created_at.strftime('%Y-%m-%d %H:%M:%S')
                },
                "marks": marks_data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Unexpected error: {str(e)}")
            return Response({"error": "Internal Server Error. Please contact support."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UpdateTestAndMarksView(APIView):
    def put(self, request, test_detail_id):
        try:
            serializer = AddTestAndMarksSerializer(data=request.data)
            if serializer.is_valid():
                data = serializer.validated_data

                # Fetch related objects
                section = get_object_or_404(Section, name=data['section'])
                month = get_object_or_404(Month, month_name=data['month'])
                subject = get_object_or_404(Subject, subject_name=data['subject'])

                # Fetch the TestDetail object based on ID
                test_detail = get_object_or_404(TestDetail, id=test_detail_id)

                # Check if the fetched TestDetail matches the section, month, and subject
                if test_detail.section != section or test_detail.month != month or test_detail.subject != subject:
                    return Response({"error": "TestDetail does not match the provided section, month, or subject."},
                                    status=status.HTTP_400_BAD_REQUEST)

                # Update the TestDetail object
                test_detail.test_name = data['test_name']
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
                    "message": "TestDetail and Marks updated successfully",
                    "test_detail_id": test_detail.id
                }, status=status.HTTP_200_OK)

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
        

class RenameTestView(APIView):
    def post(self, request):
        try:
            # Fetch test name and new name from the request
            old_test_name = request.data.get('old_test_name')
            new_test_name = request.data.get('new_test_name')
            section_name = request.data.get('section')
            month_name = request.data.get('month')

            # Ensure all required fields are present
            if not (old_test_name and new_test_name and section_name and month_name):
                return Response({"error": "Missing required fields."}, status=status.HTTP_400_BAD_REQUEST)

            # Fetch related objects
            section = get_object_or_404(Section, name=section_name)
            month = get_object_or_404(Month, month_name=month_name)

            # Get the TestDetail object by the old test name
            test_detail = get_object_or_404(TestDetail, section=section, test_name=old_test_name, month=month)

            # Update the test name
            test_detail.test_name = new_test_name
            test_detail.save()

            # Return success response
            return Response({"message": "Test name updated successfully", "test_detail_id": test_detail.id},
                            status=status.HTTP_200_OK)

        except Exception as e:
            # Log and return a server error response
            print(f"Unexpected error: {str(e)}")
            return Response({"error": "Internal Server Error. Please contact support."},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            

class ChangeTestArchiveStatusView(APIView):
    def post(self, request):
        # Get the data from the request
        test_name = request.data.get('test_name')
        section_name = request.data.get('section')
        month_name = request.data.get('month')
        is_archived = request.data.get('isArchived')  # Boolean value (True or False)

        if not all([test_name, section_name, month_name, is_archived is not None]):
            return Response({"error": "Missing required fields."}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch related objects
        section = get_object_or_404(Section, name=section_name)
        month = get_object_or_404(Month, month_name=month_name)

        try:
            # Fetch the TestDetail object
            test_detail = TestDetail.objects.get(
                section=section,
                test_name=test_name,
                month=month
            )

            # Update the isArchived field
            test_detail.isArchived = is_archived
            test_detail.save()

            return Response({
                "message": "Test archive status updated successfully.",
                "test_detail_id": test_detail.id
            }, status=status.HTTP_200_OK)

        except TestDetail.DoesNotExist:
            return Response({
                "error": "TestDetail not found."
            }, status=status.HTTP_404_NOT_FOUND)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import *
from .serializers import *
from django.db.models import Avg 

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

class UpdateTestAndMarksView(APIView):
    def put(self, request, test_detail_id):
        try:
            # Validate the incoming data with the serializer
            serializer = AddTestAndMarksSerializer(data=request.data)
            if serializer.is_valid():
                data = serializer.validated_data

                # Fetch the TestDetail object based on ID
                test_detail = get_object_or_404(TestDetail, id=test_detail_id)

                # Update TestDetail fields
                test_detail.test_name = data['test_name']
                test_detail.total_marks = data['total_marks']
                test_detail.isArchived = data.get('isArchived', test_detail.isArchived)
                test_detail.save()

                # Process students' marks (update existing or create new ones)
                students = data['students']
                for student_data in students:
                    student = get_object_or_404(Students, name=student_data['student_name'])

                    # Ensure the student belongs to the correct section
                    if student.section != test_detail.section:
                        return Response({
                            "error": f"Student {student.name} does not belong to section {test_detail.section.name}."
                        }, status=status.HTTP_400_BAD_REQUEST)

                    # Update or create marks for the student
                    Marks.objects.update_or_create(
                        student=student,
                        test_detail=test_detail,
                        defaults={
                            'mark': student_data['mark'],
                            'average_mark': student_data['average_mark'],
                            'remark': student_data.get('remark', "")
                        }
                    )

                # Success response
                return Response({
                    "message": "TestDetail and Marks updated successfully",
                    "test_detail_id": test_detail.id
                }, status=status.HTTP_200_OK)

            # Handle invalid data in serializer
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            # Log and return a server error response
            print(f"Unexpected error: {str(e)}")
            return Response({"error": "Internal Server Error. Please contact support."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetTestAndMarksView(APIView):
    def get(self, request, test_detail_id):
        try:
            # Fetch the TestDetail by ID
            test_detail = get_object_or_404(TestDetail, id=test_detail_id)

            # Get optional student filter from query params
            student_name = request.query_params.get('student_name', None)

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

            # Include subject and section in the response
            return Response({
                "test_detail": {
                    "id": test_detail.id,
                    "test_name": test_detail.test_name,
                    "total_marks": test_detail.total_marks,
                    "subject": test_detail.subject.subject_name,  # Include subject name
                    "section": test_detail.section.name,  # Include section name
                    "isArchived": test_detail.isArchived,
                    "created_at": test_detail.created_at.strftime('%Y-%m-%d %H:%M:%S')
                },
                "marks": marks_data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Unexpected error: {str(e)}")
            return Response({"error": "Internal Server Error. Please contact support."},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UpdateArchiveStatusView(APIView):
    def put(self, request, test_detail_id):
        try:
            # Fetch the TestDetail object based on ID
            test_detail = get_object_or_404(TestDetail, id=test_detail_id)

            # Get 'isArchived' from request data
            is_archived = request.data.get('isArchived', None)

            # Validate the input
            if is_archived is None or not isinstance(is_archived, bool):
                return Response(
                    {"error": "'isArchived' must be provided and must be a boolean."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Update the 'isArchived' field
            test_detail.isArchived = is_archived
            test_detail.save()

            # Success response
            return Response(
                {
                    "message": f"Archive status updated to {test_detail.isArchived}.",
                    "test_detail_id": test_detail.id
                },
                status=status.HTTP_200_OK
            )

        except Exception as e:
            # Log and return a server error response
            print(f"Unexpected error: {str(e)}")
            return Response(
                {"error": "Internal Server Error. Please contact support."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class GetAllTestDataView(APIView):
    def get(self, request):
        try:
            # Get query parameters (now required)
            section_name = request.query_params.get('section')
            month_name = request.query_params.get('month')
            subject_name = request.query_params.get('subject')
            only_test_names = request.query_params.get('only_test_names', 'false').lower() == 'true'
            only_test_detail = request.query_params.get('only_test_detail', 'false').lower() == 'true'  # New optional query parameter

            # Validate if required parameters are present
            if not section_name or not month_name or not subject_name:
                return Response({"error": "Missing required parameters: section, month, or subject."},
                                status=status.HTTP_400_BAD_REQUEST)

            # Start building the query for TestDetail
            test_details_query = TestDetail.objects.all()

            # Apply filters based on query parameters
            section = get_object_or_404(Section, name=section_name)
            month = get_object_or_404(Month, month_name=month_name)
            subject = get_object_or_404(Subject, subject_name=subject_name)

            # Filter by section, month, and subject
            test_details_query = test_details_query.filter(section=section, month=month, subject=subject)

            # Check if there are any matching tests after filtering
            if not test_details_query.exists():
                return Response([], status=status.HTTP_200_OK)  # Return empty list if no tests found

            # Return only test names if the only_test_names parameter is true
            if only_test_names:
                test_names = test_details_query.values_list('test_name', flat=True)
                return Response({"test_names": list(test_names)}, status=status.HTTP_200_OK)

            # Prepare the response data for detailed test information
            response_data = []
            for test_detail in test_details_query:
                # Prepare the test_detail information
                test_detail_data = {
                    "id": test_detail.id,
                    "test_name": test_detail.test_name,
                    "total_marks": test_detail.total_marks,
                    "isArchived": test_detail.isArchived,
                    "subject": test_detail.subject.subject_name,
                    "created_at": test_detail.created_at.strftime('%Y-%m-%d %H:%M:%S')
                }

                # Only include marks if `only_test_detail` is False
                if not only_test_detail:
                    marks_query = Marks.objects.filter(test_detail=test_detail)
                    marks_data = [
                        {
                            "student_name": mark.student.name,
                            "mark": mark.mark,
                            "average_mark": mark.average_mark,
                            "remark": mark.remark
                        }
                        for mark in marks_query
                    ]
                    response_data.append({
                        "test_detail": test_detail_data,
                        "marks": marks_data
                    })
                else:
                    # Just return test_detail data if `only_test_detail` is True
                    response_data.append({
                        "test_detail": test_detail_data
                    })

            return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Unexpected error: {str(e)}")
            return Response({"error": "Internal Server Error. Please contact support."},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

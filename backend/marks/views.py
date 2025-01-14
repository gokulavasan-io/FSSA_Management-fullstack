from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import *
from .serializers import *
from django.utils import timezone

class AddTestAndMarksView(APIView):
    def post(self, request):
        try:
            serializer = AddTestAndMarksSerializer(data=request.data)
            if serializer.is_valid():
                data = serializer.validated_data
                section = get_object_or_404(Section, name=data['section'])
                month = get_object_or_404(Month, month_name=data['month'])
                subject = get_object_or_404(Subject, subject_name=data['subject'])
                created_at = data['created_at'] if data['created_at'] else timezone.now()
                test_detail = TestDetail.objects.create(
                    section=section,
                    test_name=data['test_name'],
                    month=month,
                    subject=subject,
                    total_marks=data['total_marks'],
                    isArchived=data.get('isArchived', False),
                    isLevelTest=data.get('isLevelTest',False),
                    created_at=created_at,
                    batch=data.get('batch'),
                    about_test=data.get('about_test', "Nothing about test.")
                )
                students = data['students']
                for student_data in students:
                    student_name = student_data['student_name']
                    student = get_object_or_404(Students, name=student_name)
                    if student.section != section:
                        return Response({"error": f"Student {student_name} does not belong to section {section.name}."}, status=status.HTTP_400_BAD_REQUEST)
                    Marks.objects.create(
                        student=student,
                        test_detail=test_detail,
                        mark=student_data['mark'],
                        remark=student_data.get('remark', "")
                    )
                    if data['isLevelTest']:
                        if data['isLevelTest']:
                            level = student_data.get("level")
                            TestLevels.objects.create(
                                student=student,
                                test_detail=test_detail,
                                level=level
                            )
                    
                        
                return Response({"message": "TestDetail and Marks created successfully", "test_detail_id": test_detail.id, "date": created_at}, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"Unexpected error: {str(e)}")
            return Response({"error": "Internal Server Error. Please contact support."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UpdateTestAndMarksView(APIView):
    def put(self, request, test_detail_id):
        try:
            serializer = AddTestAndMarksSerializer(data=request.data)
            if serializer.is_valid():
                data = serializer.validated_data
                created_at = data['created_at'] if data['created_at'] else timezone.now()
                test_detail = get_object_or_404(TestDetail, id=test_detail_id)
                test_detail.test_name = data['test_name']
                test_detail.total_marks = data['total_marks']
                test_detail.isArchived = data.get('isArchived', test_detail.isArchived)
                test_detail.created_at = created_at
                test_detail.batch=data.get('batch'),
                test_detail.about_test = data.get('about_test', "Nothing about test.")
                test_detail.isLevelTest = data.get('isLevelTest', test_detail.isLevelTest)  # Update isLevelTest
                test_detail.save()
                
                students = data['students']
                for student_data in students:
                    student = get_object_or_404(Students, name=student_data['student_name'])
                    if student.section != test_detail.section:
                        return Response({"error": f"Student {student.name} does not belong to section {test_detail.section.name}."}, status=status.HTTP_400_BAD_REQUEST)
                    
                    # Update or create Marks record
                    Marks.objects.update_or_create(
                        student=student,
                        test_detail=test_detail,
                        defaults={
                            'mark': student_data['mark'],
                            'remark': student_data.get('remark', "")
                        }
                    )
                    
                    # If the test is a level test, handle the level updates
                    if test_detail.isLevelTest:
                        level = student_data.get("level")
                        TestLevels.objects.update_or_create(
                            student=student,
                            test_detail=test_detail,
                            defaults={'level': level}
                        )
                    
                return Response({"message": "TestDetail and Marks updated successfully", "test_detail_id": test_detail.id}, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"Unexpected error: {str(e)}")
            return Response({"error": "Internal Server Error. Please contact support."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GetTestAndMarksView(APIView):
    def get(self, request, test_detail_id):
        try:
            test_detail = get_object_or_404(TestDetail, id=test_detail_id)
            marks_query = Marks.objects.filter(test_detail=test_detail)
            marks_data = []
            total_marks = float(test_detail.total_marks)

            for mark in marks_query:
                # Get the level for the student if the test is a level test
                level = None
                if test_detail.isLevelTest:
                    try:
                        test_level = TestLevels.objects.get(student=mark.student, test_detail=test_detail)
                        level = test_level.level
                    except TestLevels.DoesNotExist:
                        level = "Level not assigned"

                if mark.mark in ["A", "a", "Absent"]:  # Handle 'Absent' or 'A/a' cases
                    average_mark = "Absent"
                else:
                    try:
                        mark_value = float(mark.mark)  # Convert mark to float if numeric
                        average_mark = (mark_value / total_marks) * 100 if total_marks > 0 else 0
                        average_mark = round(average_mark, 1)
                    except ValueError:
                        # Handle invalid mark values
                        average_mark = "Invalid"

                marks_data.append({
                    "student_name": mark.student.name,
                    "mark": mark.mark,  # Retain original value for display
                    "average_mark": average_mark,
                    "remark": mark.remark,
                    "level": level  # Include the level if available
                })

            return Response({
                "test_detail": {
                    "id": test_detail.id,
                    "test_name": test_detail.test_name,
                    "total_marks": total_marks,
                    "subject": test_detail.subject.subject_name,
                    "section": test_detail.section.name,
                    "isArchived": test_detail.isArchived,
                    "created_at": test_detail.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                    'batch':test_detail.batch,
                    "about_test": test_detail.about_test
                },
                "marks": marks_data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Unexpected error: {str(e)}")
            return Response({"error": "Internal Server Error. Please contact support."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UpdateArchiveStatusView(APIView):
    def put(self, request, test_detail_id):
        try:
            test_detail = get_object_or_404(TestDetail, id=test_detail_id)
            is_archived = request.data.get('isArchived', None)
            if is_archived is None or not isinstance(is_archived, bool):
                return Response({"error": "'isArchived' must be provided and must be a boolean."}, status=status.HTTP_400_BAD_REQUEST)
            test_detail.isArchived = is_archived
            test_detail.save()
            return Response({"message": f"Archive status updated to {test_detail.isArchived}.", "test_detail_id": test_detail.id}, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Unexpected error: {str(e)}")
            return Response({"error": "Internal Server Error. Please contact support."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetAllTestDataView(APIView):
    def get(self, request):
        try:
            section_name = request.query_params.get('section')
            month_name = request.query_params.get('month')
            subject_name = request.query_params.get('subject')
            if not section_name or not month_name or not subject_name:
                return Response({"error": "Missing required parameters: section, month, or subject."}, status=status.HTTP_400_BAD_REQUEST)
            test_details_query = TestDetail.objects.all()
            section = get_object_or_404(Section, name=section_name)
            month = get_object_or_404(Month, month_name=month_name)
            subject = get_object_or_404(Subject, subject_name=subject_name)
            test_details_query = test_details_query.filter(section=section, month=month, subject=subject)
            if not test_details_query.exists():
                return Response([], status=status.HTTP_200_OK)
            response_data = []
            student_avg_marks = {}
            student_marks = {}
            for test_detail in test_details_query:
                test_detail_data = {
                    "id": test_detail.id,
                    "test_name": test_detail.test_name,
                    "total_marks": test_detail.total_marks,
                    "isArchived": test_detail.isArchived,
                    "subject": test_detail.subject.subject_name,
                    "created_at": test_detail.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                    'batch':test_detail.batch,
                    "about_test": test_detail.about_test
                }
                
                marks_query = Marks.objects.filter(test_detail=test_detail)
                marks_data = []
                for mark in marks_query:
                    student_name = mark.student.name
                    if mark.mark == "Absent":
                        mark_value = 0.0  # Treat 'Absent' as 0 for calculations
                    else:
                        mark_value = float(mark.mark)  # Convert to float if it's not 'Absent'

                    total_marks = float(test_detail.total_marks)  # Ensure total_marks is a float
                    average_mark = (mark_value / total_marks) * 100 if total_marks > 0 else 0
                    average_mark = round(average_mark, 1)
                    remark = mark.remark

                    marks_data.append({
                        "student_name": student_name,
                        "mark": mark.mark,  # Keep original value for display
                        "average_mark": average_mark,
                        "remark": remark
                    })

                    if not test_detail.isArchived:
                        if student_name not in student_marks:
                            student_marks[student_name] = []
                            student_avg_marks[student_name] = 0.0
                        student_marks[student_name].append(average_mark)
                        student_avg_marks[student_name] = round(
                            (student_avg_marks[student_name] * (len(student_marks[student_name]) - 1) + average_mark)
                            / len(student_marks[student_name]),
                            1
                        )

                response_data.append({
                    "test_detail": test_detail_data,
                    "marks": marks_data
                })
            student_avg_marks_list = []
            for student_name, marks in student_marks.items():
                avg_marks = student_avg_marks[student_name]
                student_avg_marks_list.append([student_name, avg_marks] + marks)
            return Response({"test_details": response_data, "student_avg_marks": student_avg_marks_list}, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Unexpected error: {str(e)}")
            return Response({"error": "Internal Server Error. Please contact support."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

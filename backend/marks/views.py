from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.http import Http404
from .models import *
from .serializers import *
from django.utils import timezone


class MonthListView(ListAPIView):
    queryset = Month.objects.all().order_by('id')
    serializer_class = MonthSerializer

class SubjectListView(ListAPIView):
    queryset = Subject.objects.all().order_by('id')
    serializer_class = SubjectSerializer


class AddTestAndMarksView(APIView):
    def post(self, request):
        try:
            serializer = AddTestAndMarksSerializer(data=request.data)
            if serializer.is_valid():
                data = serializer.validated_data
                subject = get_object_or_404(Subject, id=data['subject'])
                
                created_at = data['created_at'] if data['created_at'] else timezone.now()
                month_number = data['month']
                month = get_object_or_404(Month, id=month_number)

                # Check if a test with the same name already exists for the same month and subject
                existing_test = TestDetail.objects.filter(
                    test_name=data['test_name'],
                    month=month,
                    subject=subject
                ).first()

                if existing_test:
                    return Response({
                        "message": "Test with this name already exists for the selected month and subject.",
                    }, status=status.HTTP_400_BAD_REQUEST)

                # Create the test detail without section (for all students globally)
                test_detail = TestDetail.objects.create(
                    test_name=data['test_name'],
                    month=month,
                    batch=data['batch'],
                    subject=subject,
                    total_marks=data['total_marks'],
                    created_at=created_at,
                    about_test=data.get('about_test', "Nothing about test."),
                    isLevelTest=data['isLevelTest']
                )

                # Fetch all students in the database
                all_students = Students.objects.all()

                # Create Marks entries for each student
                marks_objects = []
                
                if data['isLevelTest']:
                    for student in all_students:
                        marks_objects.append(TestLevels(
                            student=student,
                            test_detail=test_detail,
                            level="",
                            remark="",
                        ))

                    TestLevels.objects.bulk_create(marks_objects)
                    
                else:
                    for student in all_students:
                        marks_objects.append(Marks(
                            student=student,
                            test_detail=test_detail,
                            mark="",  
                            remark="",
                        ))

                    Marks.objects.bulk_create(marks_objects)

                return Response({
                    "message": "Test created successfully !",
                    "test_detail_id": test_detail.id,
                    "date": created_at
                }, status=status.HTTP_201_CREATED)

            # If serializer is not valid, return errors
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"Unexpected error: {str(e)}")
            return Response({"error": "Internal Server Error. Please contact support."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UpdateMarksView(APIView):
    def put(self, request, test_detail_id):
        try:
            serializer = UpdateMarksSerializer(data=request.data)
            if serializer.is_valid():
                data = serializer.validated_data
                test_detail = get_object_or_404(TestDetail, id=test_detail_id)
                
                students = data['studentsMark']
                for student_data in students:
                    student = get_object_or_404(Students, id=student_data['student_id'])
                    Marks.objects.update_or_create(
                        student=student,
                        test_detail=test_detail,
                        defaults={
                            'mark': student_data['mark'],
                            'remark': student_data.get('remark', "")
                        }
                    )
                return Response({"message": "TestDetail and Marks updated successfully", "test_detail_id": test_detail.id}, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Http404 as e:
            print(f"Object not found: {str(e)}")
            return Response({"error": "Object not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"Unexpected error: {str(e)}")
            return Response({"error": "Internal Server Error. Please contact support."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

          
class GetTestAndMarksView(APIView):
    def get(self, request, test_detail_id):
        section_id = request.query_params.get('section_id')  # Get section_id from query params
        section_id = None if section_id == 'null' else section_id
        try:
            test_detail = get_object_or_404(TestDetail, id=test_detail_id)
            # If section_id is provided, filter marks based on student's section; otherwise, get all marks for the test
            if section_id:
                marks_query = Marks.objects.filter(test_detail=test_detail, student__section__id=section_id)
            else:
                marks_query = Marks.objects.filter(test_detail=test_detail).order_by('student__id')

            marks_data = []
            total_marks = float(test_detail.total_marks)

            for mark in marks_query:
                if mark.mark is None or mark.mark == "":
                    average_mark = "" 
                elif mark.mark in ["A", "a", "Absent"]:  # Handle 'Absent' or 'A/a' cases
                    average_mark = "Absent"
                else:
                    try:
                        mark_value = float(mark.mark)  # Convert mark to float if numeric
                        if mark_value>total_marks:
                            mark_value=0
                        average_mark = 0
                        if total_marks > 0 and mark_value <= total_marks:
                            average_mark = (mark_value / total_marks) * 100
                            average_mark = round(average_mark, 1)
                    except ValueError:
                        # Handle invalid mark values
                        average_mark = ""

                marks_data.append({
                    "student_id":mark.student.id,
                    "student_name": mark.student.name,
                    "mark": mark.mark,  # Retain original value for display
                    "average_mark": average_mark,
                    "remark": mark.remark
                })

            return Response({
                "test_detail": {
                    "id": test_detail.id,
                    "test_name": test_detail.test_name,
                    "total_marks": total_marks,
                    "subject": test_detail.subject.subject_name,
                    "created_at": test_detail.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                    "about_test": test_detail.about_test
                },
                "marks": marks_data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Unexpected error: {str(e)}")
            return Response({"error": "Internal Server Error. Please contact support."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetAllTestDataView(APIView):
    def get(self, request):
        try:
            section_id = request.query_params.get('section_id')
            section_id = None if section_id == 'null' else section_id

            month_id = request.query_params.get('month')
            subject_id = request.query_params.get('subject')

            # Check if all required parameters are provided
            if not month_id or not subject_id:
                return Response({"error": "Missing required parameters: month or subject."}, 
                                 status=status.HTTP_400_BAD_REQUEST)

            test_details_query = TestDetail.objects.all()

            # Get the related month and subject
            month = get_object_or_404(Month, id=month_id)
            subject = get_object_or_404(Subject, id=subject_id)

            # Filter test details based on month and subject
            test_details_query = test_details_query.filter(month=month, subject=subject)

            if not test_details_query.exists():
                return Response([], status=status.HTTP_200_OK)

            testNames = []
            student_avg_marks = {}
            student_marks = {}

            for test_detail in test_details_query:
                if not test_detail.isLevelTest:
                    testNames.append(test_detail.test_name)

                # Get marks for the test detail and filter by section if section_id is provided
                marks_query = Marks.objects.filter(test_detail=test_detail).order_by('student__id')

                # If section_id is provided, filter marks for that specific section
                if section_id:
                    marks_query = marks_query.filter(student__section_id=section_id)
                    
                for mark in marks_query:
                    student_name = mark.student.name
                    if mark.mark == "Absent" or mark.mark=="a" or mark.mark=="A" or  mark.mark == "" or mark.mark is None:
                        mark_value = 0.0  
                    else:
                        mark_value = float(mark.mark)  # Convert to float if it's not 'Absent'
                    
                        
                    
                    total_marks = float(test_detail.total_marks)  # Ensure total_marks is a float
                    average_mark = (mark_value / total_marks) * 100 if total_marks > 0 else 0
                    average_mark = round(average_mark, 1)
                    if mark.mark == "Absent":
                        average_mark =  "Absent"

                    # Update student_marks and student_avg_marks dictionaries
                    if student_name not in student_marks:
                        student_marks[student_name] = []
                        student_avg_marks[student_name] = 0.0
                    student_marks[student_name].append(average_mark)
                    if mark.mark == "Absent":
                        average_mark =  0.0
                    student_avg_marks[student_name] = round(
                        (student_avg_marks[student_name] * (len(student_marks[student_name]) - 1) + average_mark)
                        / len(student_marks[student_name]), 1
                    )


                
                
            # Prepare the student average marks list
            student_avg_marks_list = []
            for student_name, marks in student_marks.items():
                avg_marks = student_avg_marks[student_name]
                student_avg_marks_list.append([student_name, avg_marks] + marks)
                

            return Response({"testNames": testNames, "student_avg_marks": student_avg_marks_list},
                             status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Unexpected error: {str(e)}")
            return Response({"error": "Internal Server Error. Please contact support."},
                             status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UpdateLevelTestView(APIView):
    def put(self, request, test_detail_id):
        try:
            serializer = UpdateLevelMarkSerializer(data=request.data)
            if serializer.is_valid():
                data = serializer.validated_data
                test_detail = get_object_or_404(TestDetail, id=test_detail_id)
                
                students = data['studentsMark']
                for student_data in students:
                    student = get_object_or_404(Students, id=student_data['student_id'])
                    TestLevels.objects.update_or_create(
                        student=student,
                        test_detail=test_detail,
                        defaults={
                            'level': student_data['level'],
                            'remark': student_data.get('remark', "")
                        }
                    )
                return Response({"message": "Marks updated successfully", "test_detail_id": test_detail.id}, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"Unexpected error: {str(e)}")
            return Response({"error": "Internal Server Error. Please contact support."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
  

class GetLevelTestView(APIView):
    def get(self, request, test_detail_id):
        try:
            section_id = request.query_params.get('section_id')
            section_id = None if section_id == 'null' else section_id
            test_detail = get_object_or_404(TestDetail, id=test_detail_id)
            marks_query = TestLevels.objects.filter(test_detail=test_detail).order_by('student__id')
            
            if section_id:
                marks_query = TestLevels.objects.filter(student__section__id=section_id)
            marks_data = []
            total_marks = float(test_detail.total_marks)
            for mark in marks_query:

                marks_data.append({
                    'student_id':mark.student.id,
                    "student_name": mark.student.name,
                    "level": mark.level,  
                    "remark": mark.remark
                })

            return Response({
                "test_detail": {
                    "id": test_detail.id,
                    "test_name": test_detail.test_name,
                    "total_marks": total_marks,
                    "subject": test_detail.subject.subject_name,
                    "created_at": test_detail.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                    "about_test": test_detail.about_test,
                    'isLevelTest':test_detail.isLevelTest,
                },
                "marks": marks_data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Unexpected error: {str(e)}")
            return Response({"error": "Internal Server Error. Please contact support."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UpdateTestDetailsView(APIView):
    def put(self, request, test_detail_id):
        try:
            serializer = UpdateTestDetailSerializer(data=request.data)
            if serializer.is_valid():
                data = serializer.validated_data
                created_at = data['created_at'] if data['created_at'] else timezone.now()
                month_number = data['month']  
                month = get_object_or_404(Month, id=month_number)
                subject = get_object_or_404(Subject, subject_id=data['subject'])
                test_detail = get_object_or_404(TestDetail, id=test_detail_id)
                
                test_detail.month=month
                test_detail.subject=subject
                test_detail.test_name = data['test_name']
                test_detail.total_marks = data['total_marks']
                test_detail.created_at = created_at
                test_detail.about_test = data.get('about_test', "Nothing about test.")
                test_detail.isLevelTest=data['isLevelTest']
                test_detail.batch=data['batch']
                
                test_detail.save()
                return Response({"message": "TestDetail updated successfully", "test_detail_id": test_detail.id}, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Http404 as e:
            print(f"Object not found: {str(e)}")
            return Response({"error": "Object not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"Unexpected error: {str(e)}")
            return Response({"error": "Internal Server Error. Please contact support."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)





class GetAllTestDetailsView(APIView):
    def get(self, request):
        try:
            month_id = request.query_params.get('month')
            subject_id = request.query_params.get('subject')

            # Check if all required parameters are provided
            if not month_id or not subject_id:
                return Response({"error": "Missing required parameters: month or subject."}, 
                                 status=status.HTTP_400_BAD_REQUEST)

            test_details_query = TestDetail.objects.all()

            # Get the related month and subject
            month = get_object_or_404(Month, id=month_id)
            subject = get_object_or_404(Subject, id=subject_id)

            # Filter test details based on month and subject
            test_details_query = test_details_query.filter(month=month, subject=subject)

            if not test_details_query.exists():
                return Response([], status=status.HTTP_200_OK)

            response_data = []

            for test_detail in test_details_query:
                test_detail_data = {
                    "id": test_detail.id,
                    "test_name": test_detail.test_name,
                    "total_marks": test_detail.total_marks,
                    "subject": test_detail.subject.subject_name,
                    "created_at": test_detail.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                    "about_test": test_detail.about_test,
                    "isLevelTest": test_detail.isLevelTest,
                }

                response_data.append({
                    "test_detail": test_detail_data,
                })

            return Response(response_data,
                             status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Unexpected error: {str(e)}")
            return Response({"error": "Internal Server Error. Please contact support."},
                             status=status.HTTP_500_INTERNAL_SERVER_ERROR)

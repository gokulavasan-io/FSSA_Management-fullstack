from rest_framework.response import Response
from rest_framework.views import APIView
from attendance.models import *
from students.models import *
from marks.models import *
from rest_framework import status as http_status
from marks.serializers import *
from students.serializers import *
from itertools import groupby
from operator import attrgetter
from django.shortcuts import get_object_or_404
from collections import defaultdict
from validators.query_params_validator import validate_query_params
from validators.null_validator import validate_to_none,validate_not_none

class AttendanceReport(APIView):
    @validate_query_params(["date","batch","section_id"])
    def get(self, request):
        params=request.query_params
        
        date = params.get("date")
        batch_id = params.get("batch")
        section_id = params.get("section_id")
        
        date,section_id, batch_id = validate_to_none(date,section_id, batch_id)
        validate_not_none(batch_id=batch_id,date=date)
        
        filters = {"batch_id": batch_id}
        if section_id is not None:
            filters["section_id"] = section_id
            
            

        students = Students.objects.filter(**filters)
        attendance_records = Attendance.objects.filter(date=date).select_related("student", "status")    
        
        """
            SELECT attendance.*, student.*, status.*
            FROM attendance
            JOIN student ON attendance.student_id = student.id
            JOIN status ON attendance.status_id = status.id
       
        select_related - select_related is a query optimization technique in Django ORM 
                        that performs SQL JOINs to fetch related data in one query   ----> reduces (N+1) query problem
                         
        OUTPUT:
            [
                Attendance(id=1, student=Students(id=1, name="John"), date="2025-03-29", status=Status(id=1, status="Present")),
                Attendance(id=2, student=Students(id=2, name="Emma"), date="2025-03-29", status=Status(id=3, status="Late Arrival")),
                Attendance(id=3, student=Students(id=3, name="David"), date="2025-03-29", status=None),
            ]

        """
        attendance_map = {
            record.student.id: record.status.status.strip() if record.status and str(record.status.status).strip().lower() not in ["", "null",None]
            else "No Status"
            for record in attendance_records
        }

        student_data = {"Present": [], "Half Leave": [], "Absent": [], "No Status": []}

        for student in students:
            status = attendance_map.get(student.id, "No Status")

            if status in ["Late Arrival","Approved Permission"]:
                status = "Present"
            
            if status in ["Casual Leave","Sick Leave"]:
                status = "Absent"

            student_data[status].append(student.name)


        attendance_summary = {
            "studentData": student_data,
            "attendanceCounts": {status: len(names) for status, names in student_data.items()},
        }


        return Response(attendance_summary, status=http_status.HTTP_200_OK)


class MonthlyAnalytics(APIView):
    @validate_query_params(["batch","subjects"])
    def get(self, request):
        params = request.query_params
        batch_id = params.get("batch")
        subject_ids = params.get("subjects")
        
        batch_id,subject_ids=validate_to_none(batch_id,subject_ids)
        
        validate_not_none(batch_id=batch_id,subjects=subject_ids)

        subject_ids = [int(s) for s in subject_ids.split(",")]
        test_details = TestDetail.objects.filter(
            batch_id=batch_id, 
            subject_id__in=subject_ids
        ).select_related("month").order_by("month__id")

        sections = Section.objects.all()
        

        all_marks = Marks.objects.filter(test_detail__batch_id=batch_id).select_related("student__section")

        marks_lookup = defaultdict(lambda: defaultdict(list))   # 2D dictionary (nested dictionary)


        for mark in all_marks:
            marks_lookup[mark.student.section_id][mark.test_detail_id].append(mark)

        result = {}
        overall_monthly_averages = defaultdict(list) 
         
        months_set = {}


        for section in sections:
            monthly_averages = {}

            for month, tests in groupby(test_details, key=attrgetter("month")):    
                
                """
                - Groups consecutive items in test_details that have the same month value.
                - attrgetter("month") extracts the month attribute from each TestDetail object.
                - Since test_details is already sorted by month__id, groupby will correctly group them.
                """
                
                test_averages = []
                

                for test in tests:
                    marks_list = marks_lookup[section.id].get(test.id, [])

                    total_marks_sum = 0
                    total_students = 0

                    for mark in marks_list:
                        mark_value = 0.0 if mark.mark in ["Absent", "a", "A", "", None] else float(mark.mark)
                        total_marks = float(test.total_marks) if test.total_marks else 1

                        percentage_mark = (mark_value / total_marks) * 100
                        total_marks_sum += percentage_mark
                        total_students += 1

                    if total_students > 0:
                        test_average = round(total_marks_sum / total_students, 1)
                        test_averages.append(test_average)

                # Store month by ID to sort
                month_name = month.month_name
                months_set[month.id] = month_name  # Store month_id as key for sorting

                if test_averages:
                    monthly_avg = round(sum(test_averages) / len(test_averages), 1)
                    monthly_averages[month_name] = monthly_avg
                    overall_monthly_averages[month.id].append(monthly_avg)
                else:
                    monthly_averages[month_name] = 0.0

            result[section.name] = monthly_averages

        result["All"] = {
            months_set[month_id]: round(sum(values) / len(values), 1) if values else 0.0
            for month_id, values in overall_monthly_averages.items()
        }

        # Sort months by month_id
        sorted_months = [months_set[month_id] for month_id in sorted(months_set.keys())]

        formatted_result = {
            "months": sorted_months,
            "data": {
                section: [result[section].get(month, 0.0) for month in sorted_months]
                for section in result
            }
        }

        return Response(formatted_result)

class SubjectAnalytics(APIView):
    @validate_query_params(["batch","subjects"])
    def get(self, request):
        params = request.query_params
        batch_id = params.get("batch")
        subject_ids = params.get("subjects")
        
        batch_id,subject_ids=validate_to_none(batch_id,subject_ids)
        validate_not_none(batch_id=batch_id,subjects=subject_ids)

        subject_ids = [int(s) for s in subject_ids.split(",")]


        test_details = TestDetail.objects.filter(
            batch=batch_id, subject_id__in=subject_ids
        ).select_related("month", "subject").order_by("month__id", "subject__id")
        
        """
        SELECT * FROM TestDetail 
        JOIN Month ON TestDetail.month_id = Month.id
        JOIN Subject ON TestDetail.subject_id = Subject.id
        WHERE batch_id = batch_id AND subject_id IN subject_ids
        ORDER BY Month.id, Subject.id;

        """

        sections = Section.objects.all().order_by("id")
        all_marks = Marks.objects.filter(
            test_detail__batch=batch_id, test_detail__subject__in=subject_ids
        ).select_related("student__section", "test_detail__subject")

        marks_lookup = defaultdict(lambda: defaultdict(lambda: defaultdict(list)))
        for mark in all_marks:
            marks_lookup[mark.student.section_id][mark.test_detail.subject_id][mark.test_detail_id].append(mark)

        result = defaultdict(lambda: defaultdict(lambda: defaultdict(float)))
        all_months = sorted(
            set(test.month.month_name for test in test_details),    # sort months that only have tests  
            key=lambda x: Month.objects.get(month_name=x).id        
        )

        for month, tests in groupby(test_details, key=attrgetter("month")):
            
            """
            {
                "Jan": [TestDetail(id=1, month="Jan", subject="Math"),
                        TestDetail(id=2, month="Jan", subject="Science")],

                "Feb": [TestDetail(id=3, month="Feb", subject="Math"),
                        TestDetail(id=4, month="Feb", subject="Science")],

                "Mar": [TestDetail(id=5, month="Mar", subject="Math")]
            }

            """
            
            
            month_name = month.month_name
            subject_section_averages = defaultdict(lambda: defaultdict(list))

            for test in tests:
                subject_id = test.subject_id
                subject_name = test.subject.subject_name

                for section in sections:
                    marks_list = marks_lookup[section.id][subject_id].get(test.id, [])

                    total_marks_sum = 0
                    total_students = 0

                    for mark in marks_list:
                        mark_value = 0.0 if mark.mark in ["Absent", "a", "A", "", None] else float(mark.mark)
                        total_marks = float(test.total_marks) if test.total_marks else 1

                        percentage_mark = (mark_value / total_marks) * 100
                        total_marks_sum += percentage_mark
                        total_students += 1

                    if total_students > 0:
                        test_average = round(total_marks_sum / total_students, 1)
                        subject_section_averages[subject_id][section.name].append(test_average)

            for subject_id in subject_ids:
                subject_name = Subject.objects.get(id=subject_id).subject_name
                overall_marks = []

                for section in sections:
                    section_avg = round(
                        sum(subject_section_averages[subject_id][section.name]) /
                        len(subject_section_averages[subject_id][section.name]), 1
                    ) if subject_section_averages[subject_id][section.name] else 0.0

                    result[subject_name][month_name][section.name] = section_avg
                    overall_marks.append(section_avg)

                result[subject_name][month_name]["All"] = round(sum(overall_marks) / len(overall_marks), 1) if overall_marks else 0.0

        structured_response = {
            "months": all_months,
            "SubjectsData": {}
        }

        for subject, month_data in result.items():
            
            structured_response["SubjectsData"][subject] = {}
            
            for section in list(sections.values_list("name", flat=True)) + ["All"]:
                
                structured_response["SubjectsData"][subject][section] = [
                    month_data[month].get(section, 0.0) for month in structured_response["months"]
                ]

        return Response(structured_response)


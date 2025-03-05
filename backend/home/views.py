from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError
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


class AttendanceReport(APIView):
    def get(self, request):
        params=request.query_params
        date = params.get("date", None)
        section_id = params.get("section_id", None)
        batch_id = params.get("batch", None)

        if not date:
            raise ValidationError({"error": "Date parameter is required."})

        if section_id in [None, "", "null", "None"]:
            section_id = None

        filters = {"batch_id": batch_id}
        if section_id is not None:
            filters["section_id"] = section_id

        students = Students.objects.filter(**filters)

        attendance_records = Attendance.objects.filter(date=date).select_related("student", "status")

        # Map student ID to attendance status
        attendance_map = {
            record.student.id: record.status.status.strip() if record.status and str(record.status.status).strip().lower() not in ["", "null",None]
            else "No Status"
            for record in attendance_records
        }

        # Initialize response format
        student_data = {"Present": [], "Half Leave": [], "Absent": [], "No Status": []}

        for student in students:
            status = attendance_map.get(student.id, "No Status")

            if status in ["Late Arrival","Approved Permission"]:
                status = "Present"
            
            if status in ["Casual Leave","Sick Leave"]:
                status = "Absent"

            student_data[status].append(student.name)


        # Generate attendance summary
        attendance_summary = {
            "studentData": student_data,
            "attendanceCounts": {status: len(names) for status, names in student_data.items()},
        }


        return Response(attendance_summary, status=http_status.HTTP_200_OK)



class MonthlyAnalytics(APIView):
    def get(self, request):
        params = request.query_params
        section_id = params.get("section_id", None)
        batch_id = params.get("batch", None)

        if not batch_id:
            raise ValidationError({"error": "Batch parameter is required."})

        if section_id in [None, "", "null", "None"]:
            section_id = None

        # Fetch batch object
        batch = get_object_or_404(Batch, id=batch_id)

        # Fetch test details and related months
        test_details = TestDetail.objects.filter(batch=batch).select_related("month").order_by("month")

        # Fetch sections based on input
        sections = Section.objects.all() if not section_id else Section.objects.filter(id=section_id)

        # Fetch all marks in a single query and structure them for fast lookup
        all_marks = Marks.objects.filter(test_detail__batch=batch).select_related("student__section")

        marks_lookup = defaultdict(lambda: defaultdict(list))  # {section_id: {test_id: [marks]}}
        for mark in all_marks:
            marks_lookup[mark.student.section_id][mark.test_detail_id].append(mark)

        # Final results dictionary
        result = {}
        overall_monthly_averages = defaultdict(list)  # { "January": [all_class_averages] }

        # Process each section
        for section in sections:
            monthly_averages = {}

            for month, tests in groupby(test_details, key=attrgetter("month")):
                test_averages = []

                for test in tests:
                    marks_list = marks_lookup[section.id].get(test.id, [])  # Get marks for this test in this section

                    total_marks_sum = 0
                    total_students = 0

                    for mark in marks_list:
                        mark_value = 0.0 if mark.mark in ["Absent", "a", "A", "", None] else float(mark.mark)
                        total_marks = float(test.total_marks) if test.total_marks else 1  # Avoid division by zero

                        percentage_mark = (mark_value / total_marks) * 100
                        total_marks_sum += percentage_mark
                        total_students += 1

                    if total_students > 0:
                        test_average = round(total_marks_sum / total_students, 1)
                        test_averages.append(test_average)

                # Monthly average for this section
                if test_averages:
                    monthly_avg = round(sum(test_averages) / len(test_averages), 1)
                    monthly_averages[month.month_name] = monthly_avg
                    overall_monthly_averages[month.month_name].append(monthly_avg)
                else:
                    monthly_averages[month.month_name] = 0.0

            result[section.name] = monthly_averages

        if section_id:
            return Response(result)
        
        # Compute overall averages for each month
        result["All"] = {
            month: round(sum(values) / len(values), 1) if values else 0.0
            for month, values in overall_monthly_averages.items()
        }

        return Response(result)






class SubjectAnalytics(APIView):
    def get(self, request):
        params = request.query_params
        section_id = params.get("section_id", None)
        batch_id = params.get("batch", None)
        subject_ids = params.get("subjects", None)

        if not batch_id:
            raise ValidationError({"error": "Batch parameter is required."})

        if section_id in [None, "", "null", "None"]:
            section_id = None

        if subject_ids:
            subject_ids = [int(s) for s in subject_ids.split(",")]
        else:
            subject_ids = Subject.objects.values_list("id", flat=True)

        batch = get_object_or_404(Batch, id=batch_id)
        test_details = TestDetail.objects.filter(
            batch=batch, subject_id__in=subject_ids
        ).select_related("month", "subject").order_by("month__id", "subject__id")

        sections = Section.objects.all().order_by("id") if not section_id else Section.objects.filter(id=section_id).order_by("id")
        all_marks = Marks.objects.filter(
            test_detail__batch=batch, test_detail__subject_id__in=subject_ids
        ).select_related("student__section", "test_detail__subject")

        marks_lookup = defaultdict(lambda: defaultdict(lambda: defaultdict(list)))
        for mark in all_marks:
            marks_lookup[mark.student.section_id][mark.test_detail.subject_id][mark.test_detail_id].append(mark)

        result = defaultdict(lambda: defaultdict(lambda: defaultdict(float)))
        all_sections = [section.name for section in sections]
        all_months = sorted(set(test.month.month_name for test in test_details), key=lambda x: Month.objects.get(month_name=x).id)

        for month, tests in groupby(test_details, key=attrgetter("month")):
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
                    section_avg = round(sum(subject_section_averages[subject_id][section.name]) / len(subject_section_averages[subject_id][section.name]), 1) if subject_section_averages[subject_id][section.name] else 0.0
                    result[subject_name][month_name][section.name] = section_avg
                    overall_marks.append(section_avg)

                result[subject_name][month_name]["All"] = round(sum(overall_marks) / len(overall_marks), 1) if overall_marks else 0.0

        structured_response = {
            "Sections": all_sections,
            "months": all_months,
            "SubjectsData": {}
        }

        for subject, month_data in result.items():
            structured_response["SubjectsData"][subject] = {}
            for section in structured_response["Sections"] + ["All"]:
                structured_response["SubjectsData"][subject][section] = [month_data[month].get(section, 0.0) for month in structured_response["months"]]

        return Response(structured_response)

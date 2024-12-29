from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Attendance, Status
from students.models import Students
from datetime import datetime
from calendar import monthrange

class AttendanceView(APIView):
    def get(self, request):
        year = request.query_params.get('year', None)
        month = request.query_params.get('month', None)
        section_id = request.query_params.get('section_id', None)

        # Determine the year and month
        year = int(year) if year else datetime.now().year
        month = int(month) if month else datetime.now().month
        days_in_month = monthrange(year, month)[1]  # Get the total number of days in the month

        # Fetch all students in the section
        students_query = Students.objects.filter(section_id=section_id) if section_id else Students.objects.all()

        # Fetch attendance data filtered by year, month, and section_id (if provided)
        query = Attendance.objects.select_related('student', 'status').filter(
            date__year=year,
            date__month=month
        )

        if section_id:
            query = query.filter(student__section_id=section_id)

        # Group attendance data by student and day of the month
        grouped_data = {}
        for record in query:
            student_id = record.student.id
            student_name = record.student.name

            if student_id not in grouped_data:
                grouped_data[student_id] = {
                    "student_id": student_id,  # Include student ID
                    "name": student_name,
                    **{str(day): {"status": "", "remark": ""} for day in range(1, days_in_month + 1)}  # Initialize days
                }

            # Get the day of the month for the attendance record and set the status and remark
            day = record.date.day
            grouped_data[student_id][str(day)] = {
                "status": record.status.short_form if record.status else None,
                "remark": record.remark if record.remark else ""
            }

        # Make sure that all students are in the response, even those without attendance data
        for student in students_query:
            if student.id not in grouped_data:
                grouped_data[student.id] = {
                    "student_id": student.id,  # Include student ID
                    "name": student.name,
                    **{str(day): {"status": "", "remark": ""} for day in range(1, days_in_month + 1)}  # Initialize empty days
                }

        # Convert grouped data to a list and sort by student_id
        formatted_data = sorted(grouped_data.values(), key=lambda x: x['student_id'])

        # Get all possible status options (assuming 'Status' model has a 'status' field)
        status_options = Status.objects.order_by('id').values_list('short_form', flat=True)

        # Column headers for Handsontable (Day 1, Day 2, ..., Day N)
        columns = [
            {"data": "name", "title": "Student Name"},
            *[
                {"data": str(day), "title": f"Day {day}"}
                for day in range(1, days_in_month + 1)
            ],
        ]

        # Return both the attendance data and the status options
        return Response({"columns": columns, "data": formatted_data, "status": status_options})

class BulkUpdateAttendanceView(APIView):
    def put(self, request):
        records = request.data.get("records", [])
        try:
            for record in records:
                student_id = record.get("student_id")
                if not student_id:
                    return Response({"error": "Missing 'student_id' in record"}, status=status.HTTP_400_BAD_REQUEST)

                student = Students.objects.get(id=student_id)
                year = record.get("year")
                month = record.get("month")

                if not year or not month:
                    return Response({"error": "Missing 'year' or 'month' in record"}, status=status.HTTP_400_BAD_REQUEST)

                for attendance in record.get("attendance", []):
                    day = attendance.get("day")
                    status_short_form = attendance.get("status")
                    remark = attendance.get("remark", "")
                    date = f"{year}-{str(month).zfill(2)}-{str(day).zfill(2)}"

                    if status_short_form:
                        status_obj = Status.objects.get(short_form=status_short_form)
                        Attendance.objects.update_or_create(
                            student=student,
                            date=date,
                            defaults={"status": status_obj, "remark": remark},
                        )

            return Response({"message": "Attendance updated successfully"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

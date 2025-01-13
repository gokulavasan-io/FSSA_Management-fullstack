from rest_framework import status
from django.db.models import Q
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import *
from students.models import *
from datetime import datetime
from calendar import monthrange,weekday

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
                    **{str(day): {"status": "Holiday" if weekday(year, month, day) >= 5 else ""}
                    for day in range(1, days_in_month + 1)}  # Initialize days with "Holiday" for weekends
                }

            # Get the day of the month for the attendance record and set the status 
            day = record.date.day
            grouped_data[student_id][str(day)] = {
                "status": record.status.short_form if record.status else None
            }

        # Make sure that all students are in the response, even those without attendance data
        for student in students_query:
            if student.id not in grouped_data:
                grouped_data[student.id] = {
                    "student_id": student.id,  # Include student ID
                    "name": student.name,
                    **{str(day): {"status": "Holiday" if weekday(year, month, day) >= 5 else ""}
                    for day in range(1, days_in_month + 1)}  # Initialize days with "Holiday" for weekends
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

                student = Students.objects.filter(id=student_id).first()
                if not student:
                    return Response({"error": f"Student with ID {student_id} not found."}, status=status.HTTP_404_NOT_FOUND)

                year = record.get("year")
                month = record.get("month")
                if not year or not month:
                    return Response({"error": "Missing 'year' or 'month' in record"}, status=status.HTTP_400_BAD_REQUEST)

                for attendance in record.get("attendance", []):
                    day = attendance.get("day")
                    status_short_form = attendance.get("status")
                    remark = attendance.get("remark", None)  # May or may not be present
                    date = f"{year}-{str(month).zfill(2)}-{str(day).zfill(2)}"

                    # Fetch or create the attendance record
                    attendance_record, created = Attendance.objects.get_or_create(
                        student=student,
                        date=date,
                        defaults={"status": None, "remark": ""}  # Set defaults
                    )

                    if status_short_form:  # If status is provided, update it
                        status_obj = Status.objects.filter(short_form=status_short_form).first()
                        if not status_obj:
                            return Response({"error": f"Invalid status '{status_short_form}'."}, status=status.HTTP_400_BAD_REQUEST)

                        # Update the status
                        attendance_record.status = status_obj

                    elif status_short_form == "":  # If status is empty, retain the remark but don't delete it
                        attendance_record.status = None  # Remove the status, but do not delete the remark

                    # Only update the remark if provided explicitly
                    if remark is not None:
                        attendance_record.remark = remark

                    attendance_record.save()

            return Response({"message": "Attendance updated successfully"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)



class AddOrUpdateRemarkView(APIView):
    def post(self, request, *args, **kwargs):
        student_id = request.data.get("student_id")
        date = request.data.get("date")
        remark = request.data.get("remark")

        if not student_id:
            return Response({"error": "Missing 'student_id' in request."}, status=400)
        if not date:
            return Response({"error": "Missing 'date' in request."}, status=400)
        if remark is None:  # Explicitly check for None to allow empty strings if needed
            return Response({"error": "Missing 'remark' in request."}, status=400)

        try:
            # Verify if the student exists
            student = Students.objects.filter(id=student_id).first()
            if not student:
                return Response({"error": "Student not found."}, status=404)

            # Convert date string to a Date object
            try:
                date_obj = datetime.strptime(date, "%Y-%m-%d").date()
            except ValueError:
                return Response({"error": "Invalid date format. Use 'YYYY-MM-DD'."}, status=400)

            # Fetch or create the attendance record for the student and date
            attendance, created = Attendance.objects.get_or_create(
                student=student,
                date=date_obj,
                defaults={'status': None}  # Do not set default remark
            )

            # Update the remark field
            attendance.remark = remark
            attendance.save()

            message = "Remark updated successfully."
            if created:
                message += " (New attendance record created.)"

            return Response({"message": message}, status=200)

        except Exception as e:
            return Response({"error": f"Internal Server Error: {str(e)}"}, status=500)
        
        
    def delete(self, request):
        
        student_id = request.data.get("student_id")
        date = request.data.get("date")
        
        if not student_id or not date:
            return Response({"error": "Both 'student_id' and 'date' are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Convert date to datetime object
            date_obj = datetime.strptime(date, "%Y-%m-%d").date()
            
            # Fetch student and attendance record
            student = Students.objects.filter(id=student_id).first()
            if not student:
                return Response({"error": "Student not found."}, status=status.HTTP_404_NOT_FOUND)

            attendance = Attendance.objects.filter(student=student, date=date_obj).first()
            if not attendance:
                return Response({"error": "Attendance record not found."}, status=status.HTTP_404_NOT_FOUND)

            # Delete the remark but keep the status unchanged
            attendance.remark = None
            attendance.save()

            return Response({"message": "Remark deleted successfully."}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": f"Internal Server Error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        
        
class FetchStudentsWithRemarksView(APIView):
    def get(self, request):
        # Get 'month', 'year', and optionally 'section_id' from query parameters
        month = request.query_params.get("month")
        year = request.query_params.get("year")
        section_id = request.query_params.get('section_id', None)

        # Validate the input parameters
        if not month or not year:
            return Response({"error": "Missing 'month' or 'year' in request"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Convert to integer to validate
            month = int(month)
            year = int(year)
            
            # Validate month and year ranges
            if month < 1 or month > 12:
                return Response({"error": "Invalid month. Month should be between 1 and 12."}, status=status.HTTP_400_BAD_REQUEST)
            if year < 1000 or year > 9999:
                return Response({"error": "Invalid year."}, status=status.HTTP_400_BAD_REQUEST)

        except ValueError:
            return Response({"error": "Invalid input. Month and Year should be integers."}, status=status.HTTP_400_BAD_REQUEST)

        # Filter students by section if section_id is provided
        if section_id:
            students = Students.objects.filter(section_id=section_id)
        else:
            students = Students.objects.all()

        result = []

        for student in students:
            # Filter attendance records for the student for the specific month and year
            attendance_records = Attendance.objects.filter(
                student=student,
                date__year=year,
                date__month=month
            ).values('date', 'status', 'remark')

            if attendance_records.exists():
                # Remove any attendance records with empty, None, or null remarks
                filtered_attendance = [
                    record for record in attendance_records if record['remark'] not in (None, '', 'null')
                ]
                
                # Only append student data if there are valid attendance records
                if filtered_attendance:
                    student_data = {
                        "student_id": student.id,
                        "student_name": student.name,  # Assuming the student model has a 'name' field
                        "attendance": filtered_attendance
                    }
                    result.append(student_data)

        # Return the response with the list of students and their attendance with remarks and status
        return Response(result, status=status.HTTP_200_OK)




class AddOrUpdateHolidayView(APIView):
    def post(self, request, *args, **kwargs):
        date = request.data.get("date")
        section_id = request.data.get("section_id")
        reason = request.data.get("reason")

        # Validate required fields
        if not date:
            return Response({"error": "Missing 'date' in request."}, status=400)
        if not section_id:
            return Response({"error": "Missing 'section_id' in request."}, status=400)
        if not reason:
            return Response({"error": "Missing 'reason' in request."}, status=400)

        try:
            # Verify if the section exists
            section = Section.objects.filter(id=section_id).first()
            if not section:
                return Response({"error": "Section not found."}, status=404)

            # Convert date string to a Date object
            try:
                date_obj = datetime.strptime(date, "%Y-%m-%d").date()
            except ValueError:
                return Response({"error": "Invalid date format. Use 'YYYY-MM-DD'."}, status=400)

            # Fetch or create the holiday record
            holiday, created = Holiday.objects.get_or_create(
                date=date_obj,
                section=section,
                defaults={'reason': reason}  # Set default reason for new holiday
            )

            # Update the reason field
            if not created:
                holiday.reason = reason
                holiday.save()

            message = "Holiday updated successfully."
            if created:
                message += " (New holiday record created.)"

            return Response({"message": message}, status=200)

        except Exception as e:
            return Response({"error": f"Internal Server Error: {str(e)}"}, status=500)

    def delete(self, request):
        date = request.data.get("date")
        section_id = request.data.get("section_id")

        # Validate required fields
        if not date or not section_id:
            return Response({"error": "Both 'date' and 'section_id' are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Convert date to datetime object
            date_obj = datetime.strptime(date, "%Y-%m-%d").date()

            # Fetch section and holiday record
            section = Section.objects.filter(id=section_id).first()
            if not section:
                return Response({"error": "Section not found."}, status=status.HTTP_404_NOT_FOUND)

            holiday = Holiday.objects.filter(section=section, date=date_obj).first()
            if not holiday:
                return Response({"error": "Holiday record not found."}, status=status.HTTP_404_NOT_FOUND)

            # Delete the holiday record
            holiday.delete()

            return Response({"message": "Holiday deleted successfully."}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": f"Internal Server Error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class FetchHolidaysView(APIView):
    def get(self, request):
        month = request.query_params.get("month")
        year = request.query_params.get("year")
        section_id = request.query_params.get('section_id', None)

        if not month or not year:
            return Response({"error": "Missing 'month' or 'year' in request"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            month = int(month)
            year = int(year)
            if month < 1 or month > 12:
                return Response({"error": "Invalid month. Month should be between 1 and 12."}, status=status.HTTP_400_BAD_REQUEST)
            if year < 1000 or year > 9999:
                return Response({"error": "Invalid year."}, status=status.HTTP_400_BAD_REQUEST)
        except ValueError:
            return Response({"error": "Invalid input. Month and Year should be integers."}, status=status.HTTP_400_BAD_REQUEST)

        # Initial filter
        holidays = Holiday.objects.filter(date__year=year, date__month=month)

        # Add section filter if provided
        if section_id:
            holidays = holidays.filter(section_id=section_id)

        # Debug: Print holidays before excluding weekends
        print("Holidays before exclusion:", holidays)

        # Adjust weekend exclusion based on database's week day mapping
        holidays = holidays.exclude(
            Q(date__week_day=1) | Q(date__week_day=7)  # Assuming 1 = Sunday, 7 = Saturday
        )

        # Debug: Print holidays after exclusion
        print("Holidays after exclusion:", holidays)

        # Prepare response
        holiday_data = [
            {
                "date": holiday.date,
                "day_of_week": holiday.date.strftime("%A"),
                "section": holiday.section.name if holiday.section else None,
                "reason": holiday.reason
            }
            for holiday in holidays
        ]

        return Response(holiday_data, status=status.HTTP_200_OK)

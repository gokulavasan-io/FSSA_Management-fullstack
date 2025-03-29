from rest_framework import status as http_status
from django.db.models import *
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import *
from students.models import *
from datetime import datetime,timedelta
from calendar import monthrange,weekday
from .utils import get_student_statistics
from rest_framework import generics
from .serializers import *
from validators.query_params_validator import validate_query_params
from validators.null_validator import validate_to_none,validate_not_none



class AttendanceView(APIView):
    @validate_query_params(["year","month","section_id"])
    def get(self, request):
        year = request.query_params.get('year', None)
        month = request.query_params.get('month', None)
        section_id = request.query_params.get('section_id', None)

        section_id,year, month = validate_to_none(section_id, year,month)
        validate_not_none(year=year,month=month)
        

        year = int(year) if year else datetime.now().year
        month = int(month) if month else datetime.now().month
        days_in_month = monthrange(year, month)[1]


        weekend_status = Status.objects.filter(status="Weekend").first()
        if not weekend_status:
            return Response({"error": "Status 'Weekend' not found in the database."}, status=http_status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Fetch students
        students_query = Students.objects.filter(section_id=section_id) if section_id else Students.objects.all()

        # Fetch attendance records
        attendance_query = Attendance.objects.select_related('student', 'status').filter(
            date__year=year,
            date__month=month
        )
        if section_id:
            attendance_query = attendance_query.filter(student__section_id=section_id)

        # Ensure missing records are created
        existing_records = {(record.student.id, record.date) for record in attendance_query}
        new_attendance_records = []

        for student in students_query:
            for day in range(1, days_in_month + 1):
                date = datetime(year, month, day).date()
                is_weekend = weekday(year, month, day) >= 5  

                if (student.id, date) not in existing_records:
                    new_attendance_records.append(
                        Attendance(student=student, date=date, status=weekend_status if is_weekend else None)
                    )

        if new_attendance_records:
            Attendance.objects.bulk_create(new_attendance_records)

        # Fetch updated attendance records
        attendance_query = Attendance.objects.select_related('student', 'status').filter(
            date__year=year,
            date__month=month
        )
        if section_id:
            attendance_query = attendance_query.filter(student__section_id=section_id)

        # Prepare response
        formatted_data = []
        for student in students_query:
            student_data = {
                "student_id": student.id,
                "name": student.name,
            }

            for day in range(1, days_in_month + 1):
                date = datetime(year, month, day).date()
                record = next((rec for rec in attendance_query if rec.student.id == student.id and rec.date == date), None)
                student_data[str(day)] = record.status.short_form if record and record.status else ""

            formatted_data.append(student_data)

        # Column headers
        columns = [
            {"data": "name", "title": "Student Name"},
            *[{"data": str(day), "title": f"Day {day}"} for day in range(1, days_in_month + 1)],
        ]

        # Status options
        status_options = Status.objects.order_by('id').values_list('short_form', flat=True)

        return Response({"columns": columns, "data": formatted_data, "status": status_options})

    def put(self, request):
        records = request.data.get("records", [])
        try:
            for record in records:
                student_id = record.get("student_id")
                if not student_id:
                    return Response({"error": "Missing 'student_id' in record"}, status=http_status.HTTP_400_BAD_REQUEST)

                student = Students.objects.filter(id=student_id).first()
                if not student:
                    return Response({"error": f"Student with ID {student_id} not found."}, status=http_status.HTTP_404_NOT_FOUND)

                year = record.get("year")
                month = record.get("month")
                if not year or not month:
                    return Response({"error": "Missing 'year' or 'month' in record"}, status=http_status.HTTP_400_BAD_REQUEST)

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
                            return Response({"error": f"Invalid status '{status_short_form}'."}, status=http_status.HTTP_400_BAD_REQUEST)

                        # Update the status
                        attendance_record.status = status_obj

                    elif status_short_form == "":  
                        attendance_record.status = None  # Remove only status

                    # Only update the remark if provided explicitly
                    if remark is not None:
                        attendance_record.remark = remark

                    attendance_record.save()

            return Response({"message": "Attendance updated successfully"}, status=http_status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=http_status.HTTP_400_BAD_REQUEST)


class RemarkView(APIView):
    @validate_query_params(["month",'year','section_id'])
    def get(self, request):
        month = request.query_params.get("month")
        year = request.query_params.get("year")
        section_id = request.query_params.get('section_id', None)

        if not month or not year:
            return Response({"error": "Missing 'month' or 'year' in request"}, status=http_status.HTTP_400_BAD_REQUEST)
        month,year,section_id=validate_to_none(month,year,section_id)
        validate_not_none(month=month,year=year)

        try:
            month = int(month)
            year = int(year)
            
            if month < 1 or month > 12:
                return Response({"error": "Invalid month. Month should be between 1 and 12."}, status=http_status.HTTP_400_BAD_REQUEST)
            if year < 1000 or year > 9999:
                return Response({"error": "Invalid year."}, status=http_status.HTTP_400_BAD_REQUEST)

        except ValueError:
            return Response({"error": "Invalid input. Month and Year should be integers."}, status=http_status.HTTP_400_BAD_REQUEST)

        # Filter students by section
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
            ).values('date', 'status__status', 'remark')

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
        return Response(result, status=http_status.HTTP_200_OK)


    def post(self, request):
        student_id = request.data.get("student_id")
        date = request.data.get("date")
        remark = request.data.get("remark")

        student_id,date,remark=validate_to_none(student_id,date,remark)
        validate_not_none(student_id=student_id,date=date,remark=remark)

        try:
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
                defaults={'status': None}  # set status to none
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
        
        student_id,date=validate_to_none(student_id,date)
        validate_not_none(student_id=student_id,date=date)
        try:
            # Convert date to datetime object
            date_obj = datetime.strptime(date, "%Y-%m-%d").date()
            
            # Fetch student and attendance record
            student = Students.objects.filter(id=student_id).first()
            if not student:
                return Response({"error": "Student not found."}, status=http_status.HTTP_404_NOT_FOUND)

            attendance = Attendance.objects.filter(student=student, date=date_obj).first()
            if not attendance:
                return Response({"error": "Attendance record not found."}, status=http_status.HTTP_404_NOT_FOUND)

            # Delete the remark but keep the status unchanged
            attendance.remark = None
            attendance.save()

            return Response({"message": "Remark deleted successfully."}, status=http_status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": f"Internal Server Error: {str(e)}"}, status=http_status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class HolidayView(APIView):
    @validate_query_params(["month","year"])
    def get(self, request):
        month = request.query_params.get("month")
        year = request.query_params.get("year")
        month,year=validate_to_none(month,year)
        validate_not_none(month=month,year=year)

        try:
            month = int(month)
            year = int(year)
            if month < 1 or month > 12:
                return Response({"error": "Invalid month. Month should be between 1 and 12."}, status=http_status.HTTP_400_BAD_REQUEST)
            if year < 1000 or year > 9999:
                return Response({"error": "Invalid year."}, status=http_status.HTTP_400_BAD_REQUEST)
        except ValueError:
            return Response({"error": "Invalid input. Month and Year should be integers."}, status=http_status.HTTP_400_BAD_REQUEST)

        holidays = Holiday.objects.filter(date__year=year, date__month=month)

        holiday_data = [
            {
                "date": holiday.date.strftime("%Y-%m-%d"),  
                "day_of_week": holiday.date.strftime("%A"),  
                "reason": holiday.reason,  
            }
            for holiday in holidays
        ]

        return Response(holiday_data, status=http_status.HTTP_200_OK)
    
    def post(self, request):
        date = request.data.get("date")
        reason = request.data.get("reason")
        batch_id = 4     # for temporary batch id

        date,reason,batch_id=validate_to_none(date,reason,batch_id)
        validate_not_none(date=date,reason=reason,batch_id=batch_id)

        try:
            try:
                date_obj = datetime.strptime(date, "%Y-%m-%d").date()
            except ValueError:
                return Response({"error": "Invalid date format. Use 'YYYY-MM-DD'."}, status=http_status.HTTP_400_BAD_REQUEST)

            # Fetch or create the holiday record
            holiday, created = Holiday.objects.get_or_create(
                date=date_obj,
                defaults={'reason': reason}
            )

            if not created:
                holiday.reason = reason
                holiday.save()
                message = "Holiday updated successfully."
            else:
                message = "Holiday added successfully."

            # Fetch the "Holiday" status object
            holiday_status = Status.objects.filter(status="Holiday").first()
            if not holiday_status:
                return Response({"error": "Status 'Holiday' not found in the database."}, status=http_status.HTTP_500_INTERNAL_SERVER_ERROR)

            # Fetch students in the batch
            students_in_batch = Students.objects.filter(batch=batch_id)

            # Check if attendance records exist for this date
            existing_attendance = Attendance.objects.filter(date=date_obj)

            if not existing_attendance.exists():
                # If attendance does not exist, create records for all students in the batch with remark=None
                attendance_records = [
                    Attendance(student=student, date=date_obj, status=holiday_status, remark=None)
                    for student in students_in_batch
                ]
                Attendance.objects.bulk_create(attendance_records)
            else:
                # Update existing attendance records to "Holiday" and set remark to None
                existing_attendance.update(status=holiday_status, remark=None)

            return Response({"message": message}, status=http_status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": f"Internal Server Error: {str(e)}"}, status=http_status.HTTP_500_INTERNAL_SERVER_ERROR)


    def delete(self, request):
        date = request.data.get("date")
        date=validate_to_none(date)
        validate_not_none(date=date)

        try:
            try:
                date_obj = datetime.strptime(date, "%Y-%m-%d").date()
            except ValueError:
                return Response({"error": "Invalid date format. Use 'YYYY-MM-DD'."}, status=http_status.HTTP_400_BAD_REQUEST)

            # Delete the holiday for the given date
            holiday = Holiday.objects.filter(date=date_obj).first()
            if not holiday:
                return Response({"error": "Holiday record not found."}, status=http_status.HTTP_404_NOT_FOUND)

            holiday.delete()

            # Remove "Holiday" status from attendance records
            Attendance.objects.filter(date=date_obj, status__status="Holiday").update(status=None)

            return Response({"message": "Holiday deleted successfully."}, status=http_status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": f"Internal Server Error: {str(e)}"}, status=http_status.HTTP_500_INTERNAL_SERVER_ERROR)
 

class CheckHolidayView(APIView):
    @validate_query_params(['date'])
    def get(self, request):
        date = request.query_params.get("date")
        date=validate_to_none(date)
        validate_not_none(date=date)

        try:
            date_obj = datetime.strptime(date, "%Y-%m-%d").date()  
        except ValueError:
            return Response({"error": "Invalid date format. Use YYYY-MM-DD."}, status=http_status.HTTP_400_BAD_REQUEST)

        # Fetch holiday details
        holiday = Holiday.objects.filter(date=date_obj).first()  
        is_holiday = holiday is not None
        holiday_reason = holiday.reason if holiday else None 
        
        return Response(
            {"is_holiday": is_holiday, "reason": holiday_reason}, 
            status=http_status.HTTP_200_OK
        )



class StudentStatistics(APIView):
    @validate_query_params(['month','year','section_id'])
    def get(self, request):
        month = request.query_params.get('month')
        year = request.query_params.get('year')
        section_id = request.query_params.get('section_id')
        month,year,section_id=validate_to_none(month,year,section_id)
        validate_not_none(month=month,year=year,section_id=section_id)

        result = get_student_statistics(month, year, section_id)

        if "error" in result:
            return Response(result, status=http_status.HTTP_400_BAD_REQUEST)

        return Response(result, status=http_status.HTTP_200_OK)



class DailyStatisticsView(APIView):
    @validate_query_params(['month','year','section_id'])
    def get(self, request):
        month = request.query_params.get('month')
        year = request.query_params.get('year')
        section_id = request.query_params.get('section_Id')

        month,year,section_id=validate_to_none(month,year,section_id)
        validate_not_none(month=month,year=year)

        try:
            month = int(month)
            year = int(year)
            start_date = datetime(year, month, 1)
            end_date = (start_date + timedelta(days=32)).replace(day=1) - timedelta(days=1)
        except ValueError:
            return Response({"error": "Invalid month or year."}, status=http_status.HTTP_400_BAD_REQUEST)

        # Filter students by section if sectionId is provided
        if section_id:
            try:
                section = Section.objects.get(id=section_id)
                students = Students.objects.filter(section=section)
            except Section.DoesNotExist:
                return Response({"error": "Section not found."}, status=http_status.HTTP_404_NOT_FOUND)
        else:
            students = Students.objects.all()

        # Fetch all statuses
        all_statuses = Status.objects.all()
        excluded_statuses = {"Weekend", "Holiday"} 
        status_types = [status.status for status in all_statuses if status.status not in excluded_statuses]

        
        # Prepare daily statistics dictionary
        daily_statistics = {}
        for day in range(1, end_date.day + 1):
            current_date = datetime(year, month, day).date()
            daily_statistics[current_date] = {
                "date": current_date.strftime('%d/%m/%Y'),  # Preformatted date
                "day":  current_date.strftime('%a').lower(),
                "is_holiday": current_date.weekday() in [5, 6],
                "status_counts": {status: 0 for status in status_types}
            }

        # Mark additional holidays explicitly
        holidays = Holiday.objects.filter(date__range=(start_date, end_date))
        for holiday in holidays:
            holiday_date = holiday.date
            if holiday_date in daily_statistics:
                daily_statistics[holiday_date]["is_holiday"] = True
                daily_statistics[holiday_date]["day"] += " (holiday)"

        # Populate attendance counts
        attendances = Attendance.objects.filter(
            student__in=students, date__range=(start_date, end_date)
        ).values('date', 'status__status').annotate(count=Count('status'))

        for record in attendances:
            record_date = record['date']
            record_status = record['status__status']

            # Skip excluded statuses
            if record_status in excluded_statuses:
                continue

            if record_date in daily_statistics and record_status:
                daily_statistics[record_date]["status_counts"][record_status] += record['count']


        # Convert to final response format
        formatted_response = []
        for date, data in sorted(daily_statistics.items()):
            row = {
                "date": data["date"],
                "day": data["day"],
                **{status: "-" if data["is_holiday"] else data["status_counts"].get(status, 0) for status in status_types}
            }
            formatted_response.append(row)

        return Response({"columns": ["date", "day"] + status_types, "data": formatted_response}, status=http_status.HTTP_200_OK)


class HolidayListCreateView(generics.ListCreateAPIView):
    queryset = Holiday.objects.all()
    serializer_class = HolidaySerializer

class HolidayRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Holiday.objects.all()
    serializer_class = HolidaySerializer

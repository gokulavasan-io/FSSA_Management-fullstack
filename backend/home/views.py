from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError
from attendance.models import Attendance
from students.models import Students
from rest_framework import status as http_status

class AttendanceReport(APIView):
    def get(self, request):
        date = request.query_params.get("date", None)
        section_id = request.query_params.get("section_id", None)
        batch_id = request.query_params.get("batch", None)

        if not date:
            raise ValidationError({"error": "Date parameter is required."})

        if section_id in [None, "", "null", "None"]:
            section_id = None

        students = Students.objects.all()
        if section_id:
            students = students.filter(section_id=section_id)
        if batch_id:
            students = students.filter(batch_id=batch_id)

        attendance_records = Attendance.objects.filter(date=date).select_related("student", "status")

        # Map student ID to attendance status
        attendance_map = {
            record.student.id: record.status.status if record.status else "Absent"
            for record in attendance_records
        }

        # Initialize response format with "no_status" category
        student_data = {"Present": [], "Half Leave": [], "Absent": [], "No Status": []}

        for student in students:
            if student.id in attendance_map:
                status = attendance_map[student.id]
                if status not in ["Present", "Half Leave"]:
                    status = "Absent"
                student_data[status].append(student.name)
            else:
                student_data["No Status"].append(student.name)

        attendance_summary = {
            "studentData": student_data,
            "attendanceCounts": {
                "Present": len(student_data["Present"]),
                "Half Leave": len(student_data["Half Leave"]),
                "Absent": len(student_data["Absent"]),
                "No Status": len(student_data["No Status"]),
            }
        }

        return Response(attendance_summary, status=http_status.HTTP_200_OK)



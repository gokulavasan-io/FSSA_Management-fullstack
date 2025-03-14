from datetime import datetime, timedelta
from django.db.models import Count
from .models import Students, Section, Attendance, Status, Holiday  # Update with your actual app name

def get_student_statistics(month=None, year=None, section_id=None):
    
    section_id = None if section_id == 'null' else section_id

    # Default to full data if no month and year are provided
    if month and year:
        try:
            month = int(month)
            year = int(year)
            start_date = datetime(year, month, 1)
            end_date = (start_date + timedelta(days=32)).replace(day=1)  # First day of the next month
        except ValueError:
            return {"error": "Invalid month or year"}
    else:
        start_date = None
        end_date = None

    # Filter students by section if provided
    if section_id:
        try:
            section = Section.objects.get(id=section_id)
            students = Students.objects.filter(section=section)
        except Section.DoesNotExist:
            return {"error": "Section not found"}
    else:
        students = Students.objects.all()

    result = []
    all_statuses = Status.objects.all()

    # Calculate working days (excluding weekends and holidays)
    working_days = 0
    if start_date and end_date:
        current_date = start_date
        holidays = Holiday.objects.filter(date__range=(start_date, end_date)).values_list('date', flat=True)

        while current_date < end_date:
            if current_date.weekday() < 5 and current_date not in holidays:  # Exclude weekends and holidays
                working_days += 1
            current_date += timedelta(days=1)
    else:
        working_days = "N/A"

    for student in students:
        # Filter attendance for the student
        attendance_data = Attendance.objects.filter(student=student)
        if start_date and end_date:
            attendance_data = attendance_data.filter(date__range=(start_date, end_date))

        # Exclude holidays
        attendance_data = attendance_data.exclude(date__in=Holiday.objects.values('date'))

        # Count statuses
        status_counts = {status.status: 0 for status in all_statuses}
        attendance_counts = attendance_data.values('status__status').annotate(count=Count('status'))
        
        for record in attendance_counts:
            status_name = record["status__status"]
            if not status_name is None:
                status_counts[status_name] = record['count']

        # Calculate total score
        total_score = status_counts.get("Present", 0)

        if status_counts.get("Late Arrival", 0) < 3:
            total_score += status_counts.get("Late Arrival", 0)
        else:
            total_score += status_counts.get("Late Arrival", 0) - (status_counts.get("Late Arrival", 0) // 3) * 0.5

        if status_counts.get("Approved Permission", 0) < 3:
            total_score += status_counts.get("Approved Permission", 0)
        else:
            total_score += status_counts.get("Approved Permission", 0) - (status_counts.get("Approved Permission", 0) // 3) * 0.5

        total_score += status_counts.get("Half Day Leave", 0) * 0.5
        total_score += status_counts.get("Sick Leave", 0) if status_counts.get("Sick Leave", 0) <= 2 else 0
        total_score += status_counts.get("Casual Leave", 0)

        # Calculate percentages
        total_percentage = (total_score / working_days) * 100 if working_days != "N/A" else "N/A"
        present_percentage = (
            (status_counts.get("Present", 0) / working_days) * 100 if working_days != "N/A" else "N/A"
        )

        result.append({
            "id": student.id,
            "name": student.name,
            "status_counts": status_counts,
            "total_score": total_score,
            "total_percentage": int(total_percentage) if total_percentage != "N/A" else "N/A",
            "present_percentage": int(present_percentage) if present_percentage != "N/A" else "N/A",

        })

    return {
        "total_working_days": working_days,
        "students": result
    }

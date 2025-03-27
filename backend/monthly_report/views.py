from django.db.models import Avg
from rest_framework.response import Response
from rest_framework.views import APIView
from marks.models import Marks
from attendance.utils import get_student_statistics
from validators.null_validator import validate_to_none,validate_not_none
from validators.query_params_validator import validate_query_params
from marks.models import Subject  
from students.models import Students


class StudentScoresByMonthView(APIView):
    @validate_query_params(["subjects"])
    def get(self, request, month_id):
        section_id = request.query_params.get('section')
        subjects_param = request.query_params.get('subjects')
        
        section_id,subjects,month_id=validate_to_none(section_id,subjects_param,month_id)
        validate_not_none(month_id=month_id,subjects=subjects)

        # Convert subjects to list of integers
        subject_ids = list(map(int, subjects.split(','))) if subjects else []

        # Fetch subject details (ID -> Name)
        subject_map = {
            subject.id: subject.subject_name
            for subject in Subject.objects.filter(id__in=subject_ids)
        }

        # Check for Attendance inclusion
        include_attendance = "Attendance" in subject_map.values()

        # Academic subjects to consider in academic average
        academic_subjects = {"Project", "PET", "Problem Solving", "Tech", "Life Skills", "English"}

        # ✅ Fetch students along with section name
        students_query = Students.objects.all()
        if section_id:
            students_query = students_query.filter(section_id=section_id)
        students_list = list(students_query.values('name', 'section__name'))

        # Initialize student scores with 0.0 for all subjects and store section name
        student_scores = {}
        for student in students_list:
            student_name = student['name']
            section_name = student['section__name']
            student_scores[student_name] = {
                'section': section_name,
                'scores': {subject_name: 0.0 for subject_name in subject_map.values()}
            }

        # Attendance data if needed
        attendance_data = {}
        if include_attendance:
            attendance_data = get_student_statistics(month=month_id, year=2024, section_id=section_id)

        # Fetch marks
        marks_query = Marks.objects.filter(
            test_detail__month_id=month_id,
            test_detail__subject_id__in=subject_ids
        )
        if section_id:
            marks_query = marks_query.filter(student__section_id=section_id)

        # Aggregate marks
        results = marks_query.values(
            'student__name', 'test_detail__subject_id'
        ).annotate(average_score=Avg('mark'))

        # Update student scores
        for entry in results:
            student_name = entry['student__name']
            subject_id = entry['test_detail__subject_id']
            subject_name = subject_map.get(subject_id, "Unknown Subject")
            avg_score = round(entry['average_score'], 1) if entry['average_score'] is not None else 0.0
            if student_name in student_scores:
                student_scores[student_name]['scores'][subject_name] = avg_score

        # Add attendance in student data
        if include_attendance:
            for student in attendance_data["students"]:
                student_name = student["name"]
                if student_name in student_scores:
                    student_scores[student_name]['scores']['Attendance'] = round(student["total_percentage"], 1)

        # Calculate Academic and Overall Averages for each student
        for student_name, data in student_scores.items():
            scores = data['scores']
            subject_scores = [score for subj, score in scores.items() if subj != "Attendance"]
            overall_avg = round(sum(subject_scores) / len(subject_scores), 1) if subject_scores else 0.0

            academic_scores = [
                score for subj, score in scores.items()
                if subj in academic_subjects and subj != "Attendance"
            ]
            academic_avg = round(sum(academic_scores) / len(academic_scores), 1) if academic_scores else 0.0

            student_scores[student_name]['scores']['Academic Average'] = academic_avg
            student_scores[student_name]['scores']['Overall Average'] = overall_avg

        # ✅ Class average calculation with all subjects included
        section_averages = {}

        # Fetch all existing sections
        sections = list(Students.objects.values_list('section__name', flat=True).distinct())
        
        # Initialize each section with all subjects as 0.0
        for section_name in sections:
            section_averages[section_name] = {subject_name: 0.0 for subject_name in subject_map.values()}

        # Fetch subject-wise average marks for each section
        section_avg_query = marks_query.values(
            'student__section__name', 'test_detail__subject__subject_name'
        ).annotate(average_score=Avg('mark'))

        # Update section averages with real data
        for entry in section_avg_query:
            section_name = entry['student__section__name']
            subject_name = entry['test_detail__subject__subject_name']
            avg_score = round(entry['average_score'], 1) if entry['average_score'] is not None else 0.0
            section_averages[section_name][subject_name] = avg_score

        # Now calculate Academic and Overall Averages for each section
        for section_name, subject_scores in section_averages.items():
            all_subject_scores = list(subject_scores.values())

            academic_scores = [
                score for subj, score in subject_scores.items() if subj in academic_subjects
            ]

            overall_avg = round(sum(all_subject_scores) / len(all_subject_scores), 1) if all_subject_scores else 0.0
            academic_avg = round(sum(academic_scores) / len(academic_scores), 1) if academic_scores else 0.0

            section_averages[section_name]['Academic Average'] = academic_avg
            section_averages[section_name]['Overall Average'] = overall_avg

        # Add attendance to section averages if required
        if include_attendance:
            if attendance_data.get("sections"):
                for sec in attendance_data["sections"]:
                    sec_name = sec["section"]
                    sec_attendance = sec["attendance_percentage"]
                    section_averages[sec_name]['Attendance'] = round(sec_attendance, 1)

        # ✅ Final response
        return Response({
            'students': student_scores,         # Individual student scores and their averages, with section name
            'class_average': section_averages  # Per-section averages including subjects, academic & overall avg
        })

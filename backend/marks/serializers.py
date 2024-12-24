from rest_framework import serializers
from students.models import Students
from .models import Mark, Month, Subject



class MarkCreateSerializer(serializers.Serializer):
    month = serializers.CharField(max_length=50)
    subject = serializers.CharField(max_length=100)
    marks = serializers.ListField(
        child=serializers.DictField(
            child=serializers.CharField(max_length=255)
        )
    )

    def create(self, validated_data):
        month_name = validated_data.get('month')
        subject_name = validated_data.get('subject')
        marks_data = validated_data.get('marks')

        # Fetch the Month and Subject objects based on the names
        month = Month.objects.get(name=month_name)
        subject = Subject.objects.get(name=subject_name)

        # Create Mark objects for each student in the marks list
        for mark_data in marks_data:
            student_name = mark_data.get('student_name')
            student = Students.objects.get(name=student_name)
            mark = mark_data.get('mark')
            remark = mark_data.get('remark')

            Mark.objects.create(
                student=student,
                subject=subject,
                month=month,
                mark=mark,
                remark=remark
            )

        return validated_data
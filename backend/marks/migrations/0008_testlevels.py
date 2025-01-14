# Generated by Django 5.1.4 on 2025-01-14 20:22

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('marks', '0007_remove_marks_average_mark'),
        ('students', '0004_alter_students_options'),
    ]

    operations = [
        migrations.CreateModel(
            name='TestLevels',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('level', models.CharField(blank=True, max_length=10, null=True)),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='students.students')),
                ('test_detail', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='marks.testdetail')),
            ],
        ),
    ]

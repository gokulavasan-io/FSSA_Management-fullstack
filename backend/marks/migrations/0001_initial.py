# Generated by Django 5.1.4 on 2024-12-25 10:01

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('students', '0003_students'),
    ]

    operations = [
        migrations.CreateModel(
            name='Month',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('month_name', models.CharField(max_length=20, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Subject',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('subject_name', models.CharField(max_length=50, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='TestDetail',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('test_name', models.CharField(max_length=100)),
                ('total_marks', models.PositiveIntegerField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('month', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='marks.month')),
                ('section', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='students.section')),
                ('subject', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='marks.subject')),
            ],
        ),
        migrations.CreateModel(
            name='Marks',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('mark', models.FloatField()),
                ('average_mark', models.FloatField()),
                ('remark', models.CharField(blank=True, max_length=255, null=True)),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='students.students')),
                ('test_detail', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='marks.testdetail')),
            ],
        ),
    ]

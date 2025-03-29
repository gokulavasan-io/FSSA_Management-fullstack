# Generated by Django 5.1.4 on 2025-03-29 11:07

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('marks', '0019_remove_marks__mark_remove_marks__remark_marks_mark_and_more'),
        ('students', '0017_students_mailid_alter_students_gender'),
    ]

    operations = [
        migrations.AlterField(
            model_name='marks',
            name='student',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='students.students'),
        ),
        migrations.AlterField(
            model_name='marks',
            name='test_detail',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='marks.testdetail'),
        ),
        migrations.AlterField(
            model_name='testlevels',
            name='remark',
            field=models.TextField(blank=True, null=True),
        ),
    ]

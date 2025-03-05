# Generated by Django 5.1.4 on 2025-03-05 11:47

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('marks', '0017_rename_year_testdetail_batch'),
        ('students', '0017_students_mailid_alter_students_gender'),
    ]

    operations = [
        migrations.AlterField(
            model_name='testdetail',
            name='batch',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='students.batch'),
        ),
    ]

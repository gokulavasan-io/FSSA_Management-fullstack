# Generated by Django 5.1.4 on 2025-02-12 16:15

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('students', '0013_remove_students_batch'),
    ]

    operations = [
        migrations.AddField(
            model_name='students',
            name='batch_id',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='students.batch'),
        ),
    ]

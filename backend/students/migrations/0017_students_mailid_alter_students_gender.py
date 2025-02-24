# Generated by Django 5.1.4 on 2025-02-21 17:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('students', '0016_alter_students_category_alter_students_medium_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='students',
            name='mailID',
            field=models.EmailField(blank=True, max_length=255, null=True, unique=True),
        ),
        migrations.AlterField(
            model_name='students',
            name='gender',
            field=models.CharField(blank=True, choices=[('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')], max_length=10, null=True),
        ),
    ]

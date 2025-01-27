# Generated by Django 5.1.4 on 2025-01-25 11:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('students', '0005_students_batch'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='students',
            options={},
        ),
        migrations.RemoveField(
            model_name='students',
            name='name',
        ),
        migrations.AddField(
            model_name='students',
            name='_name',
            field=models.TextField(db_column='name', default=2),
            preserve_default=False,
        ),
    ]

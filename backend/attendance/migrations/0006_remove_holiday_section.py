# Generated by Django 5.1.4 on 2025-01-25 08:32

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('attendance', '0005_holiday'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='holiday',
            name='section',
        ),
    ]

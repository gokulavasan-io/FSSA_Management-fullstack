# Generated by Django 5.1.4 on 2025-01-25 10:22

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('marks', '0013_testdetail_year'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='testdetail',
            name='section',
        ),
    ]

# Generated by Django 5.1.4 on 2025-01-25 13:59

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('marks', '0016_alter_marks__mark'),
    ]

    operations = [
        migrations.RenameField(
            model_name='testdetail',
            old_name='year',
            new_name='batch',
        ),
    ]

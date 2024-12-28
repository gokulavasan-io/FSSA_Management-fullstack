# Generated by Django 5.1.4 on 2024-12-28 21:13

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Prompt',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('prompt', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='AiResponse',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ai_response', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('prompt', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='AI.prompt')),
            ],
        ),
    ]

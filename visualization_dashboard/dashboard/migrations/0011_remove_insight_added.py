# Generated by Django 5.1.2 on 2024-10-19 06:54

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0010_rename_pestle_field_insight_pestle'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='insight',
            name='added',
        ),
    ]

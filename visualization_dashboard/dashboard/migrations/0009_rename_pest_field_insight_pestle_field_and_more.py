# Generated by Django 5.1.2 on 2024-10-17 08:50

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0008_insight_pest_field_insight_swot_field'),
    ]

    operations = [
        migrations.RenameField(
            model_name='insight',
            old_name='pest_field',
            new_name='pestle_field',
        ),
        migrations.RemoveField(
            model_name='insight',
            name='pestle',
        ),
        migrations.RemoveField(
            model_name='insight',
            name='swot_field',
        ),
    ]

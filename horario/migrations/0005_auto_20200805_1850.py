# Generated by Django 3.1 on 2020-08-05 23:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('horario', '0004_auto_20200805_1449'),
    ]

    operations = [
        migrations.AlterField(
            model_name='escuela',
            name='nombre',
            field=models.CharField(max_length=50, primary_key=True, serialize=False, unique=True, verbose_name='Nombre Escuela'),
        ),
    ]
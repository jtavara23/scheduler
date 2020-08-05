# Generated by Django 3.1 on 2020-08-05 19:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('horario', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='asignacion',
            old_name='bloque_id',
            new_name='bloque',
        ),
        migrations.RenameField(
            model_name='asignacion',
            old_name='fecha_id',
            new_name='fecha',
        ),
        migrations.RenameField(
            model_name='asignacion',
            old_name='periodo_id',
            new_name='periodo',
        ),
        migrations.RenameField(
            model_name='asignacion',
            old_name='profesor_id',
            new_name='profesor',
        ),
        migrations.RenameField(
            model_name='bloque',
            old_name='fecha_id',
            new_name='fecha',
        ),
        migrations.RenameField(
            model_name='bloque',
            old_name='periodo_id',
            new_name='periodo',
        ),
        migrations.RenameField(
            model_name='horaprofeperiodo',
            old_name='periodo_id',
            new_name='periodo',
        ),
        migrations.RenameField(
            model_name='horaprofeperiodo',
            old_name='profesor_id',
            new_name='profesor',
        ),
        migrations.AlterField(
            model_name='bloque',
            name='cargaHora',
            field=models.IntegerField(default='0', verbose_name='Carga Horaria'),
        ),
        migrations.AlterField(
            model_name='bloque',
            name='nrc_l',
            field=models.CharField(default='-', max_length=45),
        ),
        migrations.AlterField(
            model_name='bloque',
            name='nrc_p',
            field=models.CharField(default='-', max_length=45),
        ),
        migrations.AlterField(
            model_name='bloque',
            name='nrc_t',
            field=models.CharField(default='-', max_length=45),
        ),
        migrations.AlterField(
            model_name='curso',
            name='secciones',
            field=models.IntegerField(default='0', verbose_name='Numero Secciones'),
        ),
        migrations.AlterField(
            model_name='escuela',
            name='cursos',
            field=models.IntegerField(default='0', verbose_name='Num Cursos'),
        ),
        migrations.AlterField(
            model_name='horaprofeperiodo',
            name='carga',
            field=models.IntegerField(default='0', verbose_name='Carga Horaria'),
        ),
    ]
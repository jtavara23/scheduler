from rest_framework import serializers
from .models import Asignacion, Bloque, Curso, Escuela, Fecha, HoraProfePeriodo, Periodo, Profesor


class AsignacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asignacion
        fields = ('id', 'bloque_id', 'fecha_id', 'periodo_id', 'profesor_id')


class BloqueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bloque
        fields = ('id', 'nrc_t', 'nrc_p', 'nrc_l', 'aula', 'cargaHora',
                  'curso_nombre_id', 'escuela_nombre_id', 'fecha_id', 'periodo_id')


class CursoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Curso
        fields = ('nombre', 'secciones', 'escuela_nombre')


class EscuelaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Escuela
        fields = ('nombre', 'cursos')


class FechaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fecha
        fields = ('id', 'dia_fecha', 'hora_ini', 'hora_fin')


class HoraProfePeriodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = HoraProfePeriodo
        fields = ('id', 'carga',  'periodo_id', 'profesor_id')


class PeriodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Periodo
        fields = ('id', 'nombre')


class ProfesorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profesor
        fields = ('id', 'id_profesor', 'nombre')

from rest_framework import serializers
from .models import Asignacion, Bloque, Curso, Escuela, Fecha, HoraProfePeriodo, Periodo, Profesor


def dictfetchall(cursor):
    "Return all rows from a cursor as a dict"
    columns = [col[0] for col in cursor.description]
    return [
        dict(zip(columns, row))
        for row in cursor.fetchall()
    ]


class AsignacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asignacion
        fields = ('id', 'bloque', 'fecha', 'periodo', 'profesor')


class BloqueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bloque
        fields = ('id', 'nrc_t', 'nrc_p', 'nrc_l', 'aula', 'cargaHora',
                  'curso_nombre', 'escuela_nombre', 'fecha', 'periodo')


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
        fields = ('id', 'carga',  'periodo', 'profesor')


class PeriodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Periodo
        fields = ('id', 'nombre')


class ProfesorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profesor
        fields = ('id', 'id_profesor', 'nombre')


class TablaPeriodoSerializer(serializers.Serializer):
    escuela_nombre_id = serializers.CharField()
    curso_nombre_id = serializers.CharField()
    nrc_t = serializers.CharField()
    nrc_p = serializers.CharField()
    nrc_l = serializers.CharField()
    aula = serializers.CharField()
    dia_fecha = serializers.CharField()
    hora_ini = serializers.TimeField()
    hora_fin = serializers.TimeField()
    id = serializers.IntegerField()
    cargaHora = serializers.IntegerField()
    profesor_id = serializers.IntegerField()
    nombre = serializers.CharField()

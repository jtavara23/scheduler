from rest_framework import serializers
from .models import Asignacion, Bloque, Curso, Escuela, Fecha, HoraProfePeriodo, Periodo, Profesor


def dictfetchall(cursor):
    "Return all rows from a cursor as a dict"
    columns = [col[0] for col in cursor.description]
    return [
        dict(zip(columns, row))
        for row in cursor.fetchall()
    ]


class AsignacionQuerySetSerializer(serializers.ModelSerializer):
    # used for filtering Asignacion
    class Meta:
        model = Asignacion
        fields = ('id', 'bloque_id', 'fecha_id', 'periodo_id', 'profesor_id')


class AsignacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asignacion
        fields = ('id', 'bloque', 'fecha', 'periodo', 'profesor')


class BloqueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bloque
        fields = ('id', 'nrc_t', 'nrc_p', 'nrc_l', 'aula', 'cargaHora',
                  'curso_nombre', 'escuela_nombre', 'fecha', 'periodo')
        extra_kwargs = {
            'nrc_t': {
                'required': False,
                'allow_blank': True,
            },
            'nrc_l': {
                'required': False,
                'allow_blank': True,
            },
            'nrc_p': {
                'required': False,
                'allow_blank': True,
            }
        }


class CursoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Curso
        fields = ('nombre', 'secciones', 'escuela_nombre')


class CursoQuerySetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Curso
        fields = ('nombre', 'secciones', 'escuela_nombre_id')


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
    bloque_id = serializers.IntegerField()
    escuela_nombre_id = serializers.CharField()
    curso_nombre_id = serializers.CharField()
    nrc_t = serializers.CharField()
    nrc_p = serializers.CharField()
    nrc_l = serializers.CharField()
    aula = serializers.CharField()
    fecha_id = serializers.IntegerField()
    dia_fecha = serializers.CharField()
    hora_ini = serializers.TimeField()
    hora_fin = serializers.TimeField()
    asig_id = serializers.IntegerField()
    cargaHora = serializers.IntegerField()
    profesor_id = serializers.IntegerField()
    nombre = serializers.CharField()


class TablaProfesoresSerializer(serializers.Serializer):
    id_profesor = serializers.IntegerField()
    code_profesor = serializers.CharField()
    nombre = serializers.CharField()
    carga = serializers.IntegerField()
    hpp_id = serializers.IntegerField()


class AvailableProfesoresSerializer(serializers.Serializer):
    nombre_prof = serializers.CharField()
    code_prof = serializers.CharField()
    id_prof = serializers.IntegerField()


class ViewHorarioSerializer(serializers.Serializer):
    curso_nombre_id = serializers.CharField()
    nrc_t = serializers.CharField()
    nrc_p = serializers.CharField()
    nrc_l = serializers.CharField()
    aula = serializers.CharField()
    dia_fecha = serializers.CharField()
    hora_ini = serializers.TimeField()
    hora_fin = serializers.TimeField()


class CargaTotalSerializer(serializers.Serializer):
    carga = serializers.IntegerField()

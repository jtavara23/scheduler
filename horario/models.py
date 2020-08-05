from django.db import models


class Fecha(models.Model):
    # PK autoincrement
    dia_fecha = models.CharField("Dia", max_length=45)
    hora_ini = models.TimeField("Hora Inicio")
    hora_fin = models.TimeField("Hora Fin")


class Periodo(models.Model):
    # PK autoincrement
    nombre = models.CharField("Nombre Periodo", max_length=45)


class Profesor(models.Model):
    # PK autoincrement
    id_profesor = models.CharField("Id Profesor", max_length=45)
    nombre = models.CharField("Nombre Profesor", max_length=45)


class HoraProfePeriodo(models.Model):
    # PK autoincrement
    profesor_id = models.ForeignKey(Profesor, on_delete=models.DO_NOTHING)
    periodo_id = models.ForeignKey(Periodo, on_delete=models.DO_NOTHING)
    carga = models.IntegerField("Carga Horaria", default=0)


class Escuela(models.Model):
    nombre = models.CharField(
        "Nombre Escuela", primary_key=True, max_length=50)
    cursos = models.IntegerField("Num Cursos", default=0)

    def __str__(self):
        return self.nombre


class Curso(models.Model):
    nombre = models.CharField("Nombre Curso", primary_key=True, max_length=45)
    secciones = models.IntegerField("Numero Secciones", default=0)
    escuela_nombre = models.ForeignKey(Escuela, on_delete=models.DO_NOTHING)


class Bloque(models.Model):
    # PK autoincrement
    periodo_id = models.ForeignKey(Periodo, on_delete=models.DO_NOTHING)
    escuela_nombre = models.ForeignKey(Escuela, on_delete=models.DO_NOTHING)
    curso_nombre = models.ForeignKey(Curso, on_delete=models.DO_NOTHING)
    nrc_t = models.CharField(max_length=45, default='')
    nrc_p = models.CharField(max_length=45, default='')
    nrc_l = models.CharField(max_length=45, default='')
    aula = models.CharField("Aula", max_length=45)
    cargaHora = models.IntegerField("Carga Horaria", default=0)
    fecha_id = models.ForeignKey(Fecha, on_delete=models.DO_NOTHING)


class Asignacion(models.Model):
    # PK autoincrement
    periodo_id = models.ForeignKey(Periodo, on_delete=models.DO_NOTHING)
    profesor_id = models.ForeignKey(Profesor, on_delete=models.DO_NOTHING)
    bloque_id = models.ForeignKey(Bloque, on_delete=models.DO_NOTHING)
    fecha_id = models.ForeignKey(Fecha, on_delete=models.DO_NOTHING)

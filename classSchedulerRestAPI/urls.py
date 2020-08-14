"""classSchedulerRestAPI URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from django.conf.urls import url
from horario import view_principal
from horario.views import view_profesor, view_periodo, view_escuela, view_curso, view_fecha, horaprofeperiodo

urlpatterns = [
    path('admin/', admin.site.urls),

    url(r'^api/horario/asignacion/$', view_principal.asignacion_create),
    url(r'^api/horario/asignacion/(?P<pk>[^\s]+)$',
        view_principal.asignacion_get_delete),
    url(r'^api/horario/asignacion_bloque/(?P<bloque_id>[^\s]+)$',
        view_principal.asignacion_bloque_get_update),
    url(r'^api/horario/asignacion_duplicate/(?P<asig_id>[^\s]+)$',
        view_principal.asignacion_bloque_duplicate),

    url(r'^api/horario/bloque/$', view_principal.bloque_create),
    url(r'^api/horario/bloque/(?P<pk>[^\s]+)$',
        view_principal.bloque_get_update),

    url(r'^api/horario/curso/$', view_curso.curso_list),
    url(r'^api/horario/curso/(?P<id>[^\s]+)$',  # nombre
        view_curso.curso_detail),

    url(r'^api/horario/escuela/$', view_escuela.escuela_list),
    url(r'^api/horario/escuela/(?P<nombre>[^\s]+)$',
        view_escuela.escuela_detail),

    url(r'^api/horario/fecha/$', view_fecha.fecha_list),
    url(r'^api/horario/fecha/(?P<id>[^\s]+)$',
        view_fecha.fecha_detail),

    url(r'^api/horario/hora_profe_periodo/$',
        horaprofeperiodo.hora_profe_periodo_list),
    url(r'^api/horario/hora_profe_periodo/(?P<id>[^\s]+)$',
        horaprofeperiodo.hora_profe_periodo_detail),
    url(r'^api/horario/hora_profe_periodo_carga/(?P<data>[^\s]+)$',
        horaprofeperiodo.hora_profe_periodo_carga),

    url(r'^api/horario/periodo/(?P<pk>[^\s]+)$',
        view_principal.tabla_periodo),  # get get_tabla_periodo store procedure

    url(r'^api/horario/periodos/$', view_periodo.periodo_list),
    url(r'^api/horario/periodos/(?P<id>[^\s]+)$', view_periodo.periodo_detail),

    url(r'^api/horario/profesor/$', view_profesor.profesor_list),
    url(r'^api/horario/profesor_available/$',
        view_profesor.get_available_teachers),
    url(r'^api/horario/profesor/(?P<id>[^\s]+)$',  # id_profesor
        view_profesor.profesor_detail),
    url(r'^api/horario/profesores_periodo/(?P<id_per>[^\s]+)$',  # id_profesor
        view_profesor.profesor_in_periodo),

]

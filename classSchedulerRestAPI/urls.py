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
from horario.views import view_profesor, view_periodo, view_escuela

urlpatterns = [
    path('admin/', admin.site.urls),
    url(r'^api/horario/profesor/$', view_profesor.profesor_list),
    url(r'^api/horario/profesor/(?P<id>[^\s]+)$',
        view_profesor.profesor_detail),
    url(r'^api/horario/periodo/$', view_periodo.periodo_list),
    url(r'^api/horario/periodo/(?P<id>[^\s]+)$', view_periodo.periodo_detail),
    url(r'^api/horario/escuela/$', view_escuela.escuela_list),
    url(r'^api/horario/escuela/(?P<nombre>[^\s]+)$',
        view_escuela.escuela_detail),
]

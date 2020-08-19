from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from django.db import connection

from .models import *
from .serializers import *


@api_view(['GET'])
def tabla_periodo(request, pk):
    cursor = connection.cursor()
    statement = "call get_tabla_periodo("+pk+")"
    cursor.execute(statement)
    results = dictfetchall(cursor)
    cursor.close()

    serializer = TablaPeriodoSerializer(
        results, context={'request': request}, many=True)
    return Response({
        'data': serializer.data
    })


@api_view(['GET', 'DELETE'])
def bloqueFromPeriodo(request, pk):
    try:
        bloques = Bloque.objects.filter(
            periodo=pk)
    except Bloque.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    result = list(bloques.values())
    if request.method == 'GET':
        data = []
        for res in result:
            r = {'id':  res['id'],
                 'periodo':  res['periodo_id'],
                 'escuela_nombre':  res['escuela_nombre_id'],
                 'curso_nombre':  res['curso_nombre_id'],
                 'nrc_t':  res['nrc_t'],
                 'nrc_p':  res['nrc_p'],
                 'nrc_l':  res['nrc_l'],
                 'aula':  res['aula'],
                 'cargaHora':  res['cargaHora'],
                 'fecha':  res['fecha_id']}
            data += [r]
        return Response(data, status=status.HTTP_202_ACCEPTED)

    elif request.method == 'DELETE':
        for res in result:
            bloque = Bloque.objects.get(pk=res['id'])
            bloque.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
def bloque_create(request):
    serializer = BloqueSerializer(data=request.data)
    if serializer.is_valid():
        bloque = serializer.save()
        return Response({'id': bloque.id}, status=status.HTTP_201_CREATED)
    elif isinstance(request.data, list):
        list_bloque = request.data
        new_bloques = []
        for obj in list_bloque:
            serializer = BloqueSerializer(data=obj)
            if serializer.is_valid():
                newBloque = serializer.save()
                new_bloques += [{'id': newBloque.id}]
        if len(new_bloques) == len(list_bloque):
            print(str(len(new_bloques)) + " objects were added")
            return Response(new_bloques, status=status.HTTP_201_CREATED)
    return Response(serializer.errors,  status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT'])
def bloque_get_update(request, pk):
    try:
        bloque = Bloque.objects.get(pk=pk)
    except Escuela.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = BloqueSerializer(bloque, context={'request': request})
        return Response({
            'data': serializer.data
        })

    elif request.method == 'PUT':
        serializer = BloqueSerializer(
            bloque, data=request.data,  context={'request': request})
        if serializer.is_valid():
            serializer.save()  # saves in the DB
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

####################################################################################


@api_view(['GET', 'DELETE'])
def asignacionFromPeriodo(request, period):
    try:
        asignaciones = Asignacion.objects.filter(
            periodo=period)
    except Asignacion.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    result = list(asignaciones.values())
    if request.method == 'GET':
        data = []
        for res in result:
            r = {'bloque':  res['bloque_id'],
                 'fecha':  res['fecha_id'],
                 'periodo':  res['periodo_id'],
                 'profesor':  res['profesor_id']}
            data += [r]
        return Response(data, status=status.HTTP_202_ACCEPTED)

    elif request.method == 'DELETE':
        for res in result:
            asignacion = Asignacion.objects.get(pk=res['id'])
            asignacion.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
def asignacion_create(request):
    serializer = AsignacionSerializer(data=request.data)
    if serializer.is_valid():
        asignacion = serializer.save()
        return Response({'id': asignacion.id}, status=status.HTTP_201_CREATED)

    elif isinstance(request.data, list):
        list_asig = request.data
        good = 0
        for obj in list_asig:
            serializer = AsignacionSerializer(data=obj)
            if serializer.is_valid():
                serializer.save()
                good = good + 1
        if good == len(list_asig):
            return Response(str(good) + " objects were added", status=status.HTTP_201_CREATED)
    return Response(serializer.errors,  status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'DELETE'])
def asignacion_get_update_delete(request, pk):
    # i think GET will be never used!!!!
    try:
        asignacion = Asignacion.objects.get(pk=pk)
    except Asignacion.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = AsignacionSerializer(
            asignacion, context={'request': request})
        return Response({
            'data': serializer.data
        })

    elif request.method == 'PUT':
        new_profesor = request.data['profesor']
        query = "UPDATE horario_asignacion set profesor_id =" + \
            str(new_profesor)
        print(">Updating asignacion: ", pk, "to profesor: ", new_profesor)

        cursor = connection.cursor()
        cursor.execute(query + " WHERE id = %s", pk)
        cursor.close()

        return Response("OK", status=status.HTTP_202_ACCEPTED)

    elif request.method == 'DELETE':
        asignacion.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'PUT'])
def asignacion_bloque_get_updateFecha(request, bloque_id):
    try:
        # print(request.data['bloque'])
        asignacion = Asignacion.objects.filter(bloque=bloque_id)
    except Asignacion.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        results = []
        asignaciones = list(asignacion.values())
        for asig in asignaciones:
            serializer = AsignacionQuerySetSerializer(
                asig, context={'request': request})
            results += [serializer.data]
        return Response({
            'data': results
        })
    # This updates only the FECHA field
    elif request.method == 'PUT':
        asignaciones = list(asignacion)
        new_fecha = request.data['fecha']
        query = "UPDATE horario_asignacion set fecha_id =" + str(new_fecha)
        cursor = connection.cursor()
        for asig in asignaciones:
            print(">> Updating asignacion_id: ",
                  asig.id, "to fecha: ", new_fecha)
            cursor.execute(
                query + " WHERE id = %s", asig.id)
        cursor.close()
        return Response("OK", status=status.HTTP_202_ACCEPTED)


@api_view(['POST'])
def asignacion_bloque_duplicate(request, asig_id):
    try:
        asignacion = Asignacion.objects.get(pk=asig_id)
    except Asignacion.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    profesor_28 = Profesor.objects.get(pk=28)
    asignacion_new = Asignacion(
        periodo=asignacion.periodo, profesor=profesor_28, bloque=asignacion.bloque, fecha=asignacion.fecha)
    asignacion_new.save()
    asignacion_json = asignacion_new.__dict__
    print(asignacion_new.__dict__)
    response = {'id': asignacion_json['id'],
                'periodo': asignacion_json['periodo_id'],
                'profesor': asignacion_json['profesor_id']}
    return Response(response, status=status.HTTP_201_CREATED)

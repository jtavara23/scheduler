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
    cursor.callproc('get_tabla_periodo', pk)
    results = dictfetchall(cursor)
    cursor.close()

    serializer = TablaPeriodoSerializer(
        results, context={'request': request}, many=True)
    return Response({
        'data': serializer.data
    })


@api_view(['POST'])
def bloque_create(request):
    serializer = BloqueSerializer(data=request.data)
    if serializer.is_valid():
        bloque = serializer.save()
        return Response({'id': bloque.id}, status=status.HTTP_201_CREATED)
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


@api_view(['POST'])
def asignacion_create(request):
    serializer = AsignacionSerializer(data=request.data)
    if serializer.is_valid():
        asignacion = serializer.save()
        return Response({'id': asignacion.id}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors,  status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT'])
def asignacion_get_update(request, pk):
    # i think this will be never used!!!!
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
        serializer = AsignacionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()  # saves in the DB
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT'])
def asignacion_bloque_get_update(request, bloque_id):
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

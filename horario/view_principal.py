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
        escuela = Bloque.objects.get(pk=pk)
    except Escuela.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = BloqueSerializer(escuela, context={'request': request})
        return Response({
            'data': serializer.data
        })

    elif request.method == 'PUT':
        # /TODO
        serializer = BloqueSerializer(data=request.data)
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

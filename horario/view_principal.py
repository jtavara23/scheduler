from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from django.db import connection

from .models import *
from .serializers import *


@api_view(['GET', 'POST'])
def tabla_periodo(request, pk):
    if request.method == 'GET':
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

    elif request.method == 'POST':
        serializer = CustomerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()  # saves in the DB
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

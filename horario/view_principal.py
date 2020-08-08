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

        data = []
        nextPage = 1
        previousPage = 1
        paginator = Paginator(results, 10)
        page = request.GET.get('page', 1)

        try:
            data = paginator.page(page)
        except PageNotAnInteger:
            data = paginator.page(1)
        except EmptyPage:
            data = paginator.page(paginator.num_pages)

        serializer = TablaPeriodoSerializer(
            data, context={'request': request}, many=True)

        if data.has_next():
            nextPage = data.next_page_number()
        if data.has_previous():
            previousPage = data.previous_page_number()

        return Response({
            'data': serializer.data,
            'count': paginator.count,  # the count of available customers
            'numpages': paginator.num_pages,
            'nextlink': '/api/horario/periodo_bloque/'+pk+'?page=' + str(nextPage),
            'prevlink': '/api/horario/periodo_bloque/'+pk+'?page=' + str(previousPage)
        })

    elif request.method == 'POST':
        serializer = CustomerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()  # saves in the DB
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

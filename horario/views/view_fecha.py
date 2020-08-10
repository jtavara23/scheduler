from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
# fecha in row 142 from original DB doesnt make sense. check it out
from ..models import Fecha
from ..serializers import FechaSerializer, dictfetchall
from django.db import connection


@api_view(['GET', 'POST'])
def fecha_list(request):
    if request.method == 'GET':
        fechas = Fecha.objects.all()
        serializer = FechaSerializer(
            fechas, context={'request': request}, many=True)
        return Response({
            'data': serializer.data
        })

    elif request.method == 'POST':
        try:
            fecha_obj = Fecha.objects.filter(
                dia_fecha=request.data['dia_fecha'],
                hora_ini=request.data['hora_ini'],
                hora_fin=request.data['hora_fin'])
            fecha = list(fecha_obj.values())
            if(len(fecha) > 0):
                return Response({'id': fecha[0]['id']}, status=status.HTTP_202_ACCEPTED)
            else:
                serializer = FechaSerializer(data=request.data)
                if serializer.is_valid():
                    serializer.save()
                    return Response({"id": serializer.data['id']}, status=status.HTTP_201_CREATED)
                return Response(serializer.errors,  status=status.HTTP_400_BAD_REQUEST)
        except Fecha.DoesNotExist:
            return Response(serializer.errors,  status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def fecha_lookup(request, data):
    data = data.split('-')
    cursor = connection.cursor()
    statement = "call get_fecha_id('" + \
        data[0]+"','" + data[1]+"','" + data[2]+"')"
    cursor.execute(statement)
    result = dictfetchall(cursor)
    cursor.close()
    return Response(result)


@api_view(['GET', 'PUT', 'DELETE'])
def fecha_detail(request, id):
    try:
        fecha = Fecha.objects.get(pk=id)
    except Fecha.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = FechaSerializer(fecha, context={'request': request})
        return Response(serializer.data)

    elif request.method == 'PUT':
        #old_fecha = fecha
        serializer = FechaSerializer(
            fecha, data=request.data, context={'request': request})
        if serializer.is_valid():
            # old_fecha.delete()
            serializer.save()
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        fecha.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

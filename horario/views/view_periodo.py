from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from ..models import Periodo
from ..serializers import PeriodoSerializer


@api_view(['GET', 'POST'])
def periodo_list(request):
    if request.method == 'GET':
        periodos = Periodo.objects.all()
        serializer = PeriodoSerializer(
            periodos, context={'request': request}, many=True)
        return Response({
            'data': serializer.data
        })

    elif request.method == 'POST':
        serializer = PeriodoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors,  status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def periodo_detail(request, id):
    try:
        periodo = Periodo.objects.get(pk=id)
    except Periodo.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = PeriodoSerializer(periodo, context={'request': request})
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = PeriodoSerializer(
            periodo, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        periodo.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

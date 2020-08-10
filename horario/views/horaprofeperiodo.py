from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.core import serializers
from ..models import HoraProfePeriodo
from ..serializers import HoraProfePeriodoSerializer


@api_view(['GET', 'POST'])
def hora_profe_periodo_list(request):
    if request.method == 'GET':
        horaprofeperiodos = HoraProfePeriodo.objects.all()
        serializer = HoraProfePeriodoSerializer(
            horaprofeperiodos, context={'request': request}, many=True)
        return Response({
            'data': serializer.data
        })

    elif request.method == 'POST':
        serializer = HoraProfePeriodoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        elif isinstance(request.data, list):
            list_horaprofeperiodo = request.data
            good = 0
            for obj in list_horaprofeperiodo:
                serializer = HoraProfePeriodoSerializer(data=obj)
                if serializer.is_valid():
                    serializer.save()
                    good = good + 1
            if good == len(list_horaprofeperiodo):
                return Response(str(good) + " objects were added", status=status.HTTP_201_CREATED)
        return Response(serializer.errors,  status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'DELETE'])
def hora_profe_periodo_detail(request, id):
    try:
        hora_profe_periodo = HoraProfePeriodo.objects.get(pk=id)
    except HoraProfePeriodo.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    """
    if request.method == 'GET':
        serializer = HoraProfePeriodoSerializer(
            hora_profe_periodo, context={'request': request})
        return Response(serializer.data)
    """
    if request.method == 'PUT':
        # old_hora_profe_periodo = hora_profe_periodo
        serializer = HoraProfePeriodoSerializer(
            hora_profe_periodo, data=request.data, context={'request': request})
        if serializer.is_valid():
            # old_hora_profe_periodo.delete()
            serializer.save()
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        hora_profe_periodo.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
def hora_profe_periodo_carga(request, data):
    param = data.split('-')  # periodo - profesor
    try:
        prof_periodo_cargaTotal = HoraProfePeriodo.objects.filter(
            periodo=param[0], profesor=param[1])
    except HoraProfePeriodo.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    result = list(prof_periodo_cargaTotal.values())
    data = {'id': result[0]['id'], 'carga':  result[0]['carga']}
    return Response(data, status=status.HTTP_202_ACCEPTED)

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
# fecha in row 142 from original DB doesnt make sense. check it out
from ..models import Fecha
from ..serializers import FechaSerializer


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
        serializer = FechaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        elif isinstance(request.data, list):
            list_fecha = request.data
            good = 0
            for profesor_obj in list_fecha:
                serializer = FechaSerializer(data=profesor_obj)
                if serializer.is_valid():
                    serializer.save()
                    good = good + 1
            if good == len(list_fecha):
                return Response(good + " objects were added", status=status.HTTP_201_CREATED)
        return Response(serializer.errors,  status=status.HTTP_400_BAD_REQUEST)


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

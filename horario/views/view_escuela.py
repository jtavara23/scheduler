from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from ..models import Escuela
from ..serializers import EscuelaSerializer


@api_view(['GET', 'POST'])
def escuela_list(request):
    if request.method == 'GET':
        escuelas = Escuela.objects.all()
        serializer = EscuelaSerializer(
            escuelas, context={'request': request}, many=True)
        return Response({
            'data': serializer.data
        })

    elif request.method == 'POST':
        serializer = EscuelaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors,  status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def escuela_detail(request, nombre):
    try:
        nombre = nombre.replace('-', ' ')
        escuela = Escuela.objects.get(pk=nombre)
    except Escuela.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = EscuelaSerializer(escuela, context={'request': request})
        return Response(serializer.data)

    elif request.method == 'PUT':
        old_escuela = escuela
        serializer = EscuelaSerializer(
            escuela, data=request.data, context={'request': request})
        if serializer.is_valid():
            old_escuela.delete()
            serializer.save()
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        escuela.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

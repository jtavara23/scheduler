from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from ..models import Profesor
from ..serializers import ProfesorSerializer


@api_view(['GET', 'POST'])
def profesor_list(request):
    if request.method == 'GET':
        profesores = Profesor.objects.all()
        serializer = ProfesorSerializer(
            profesores, context={'request': request}, many=True)
        return Response({
            'data': serializer.data
        })

    elif request.method == 'POST':
        serializer = ProfesorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        elif isinstance(request.data, list):
            list_profesores = request.data
            good = 0
            for profesor_obj in list_profesores:
                serializer = ProfesorSerializer(data=profesor_obj)
                if serializer.is_valid():
                    serializer.save()
                    good = good + 1
            if good == len(list_profesores):
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors,  status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def profesor_detail(request, id):
    try:
        profesor = Profesor.objects.get(id_profesor=id)
    except Profesor.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ProfesorSerializer(profesor, context={'request': request})
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = ProfesorSerializer(
            profesor, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        profesor.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
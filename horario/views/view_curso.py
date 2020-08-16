from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from ..models import Curso
from ..serializers import CursoSerializer, CursoQuerySetSerializer


@api_view(['GET', 'POST'])
def curso_list(request):
    if request.method == 'GET':
        cursos = Curso.objects.all()
        serializer = CursoSerializer(
            cursos, context={'request': request}, many=True)
        return Response({
            'data': serializer.data
        })

    elif request.method == 'POST':
        serializer = CursoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        elif isinstance(request.data, list):
            list_curso = request.data
            good = 0
            for profesor_obj in list_curso:
                serializer = CursoSerializer(data=profesor_obj)
                if serializer.is_valid():
                    serializer.save()
                    good = good + 1
            if good == len(list_curso):
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors,  status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def curso_from_escuela(request, escuela):
    escuela = escuela.replace('-', ' ')
    try:
        curso = Curso.objects.filter(escuela_nombre=escuela)
    except Curso.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    results = []
    cursos = list(curso.values())
    for c in cursos:
        serializer = CursoQuerySetSerializer(
            c, context={'request': request})
        results += [serializer.data]
    return Response({'data': results})


@api_view(['GET', 'PUT', 'DELETE'])
def curso_detail(request, id):
    id = id.replace('-', ' ')
    try:
        curso = Curso.objects.get(nombre=id)
    except Curso.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = CursoSerializer(curso, context={'request': request})
        return Response(serializer.data)

    elif request.method == 'PUT':
        #old_curso = curso
        serializer = CursoSerializer(
            curso, data=request.data, context={'request': request})
        if serializer.is_valid():
            # old_curso.delete()
            serializer.save()
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        curso.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

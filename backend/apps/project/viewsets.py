from rest_framework import viewsets
from . import serializers
from . import models
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from ai.test import Test


class ProjectViewSets(viewsets.ModelViewSet):
    queryset = models.Project.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'list':
            return serializers.ProjectListSerializer
        return serializers.ProjectDetailSerializer

    @action(detail=False, methods=['get'])
    def test_ai(self, request):
        res = Test(input="Who is the creator of Django?")


        return Response({
            "msg": "OKK",
            "response": res
        })


class EntryViewSets(viewsets.ModelViewSet):
    queryset = models.Entry.objects.all()


    def get_serializer_class(self):
        if self.action == 'list':
            return serializers.EntryListSerializer
        return serializers.EntrtDetailSerializer


class CommentViewSets(viewsets.ModelViewSet):
    queryset = models.Comment.objects.all()

    def get_serializer_class(self):
        if self.action == 'list':
            return serializers.CommentListSerializer
        return serializers.CommentDetailSerializer
from rest_framework import viewsets
from . import serializers
from . import models
from rest_framework.permissions import AllowAny, IsAuthenticated



class ProjectViewSets(viewsets.ModelViewSet):
    queryset = models.Project.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'list':
            return serializers.ProjectListSerializer
        return serializers.ProjectDetailSerializer


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
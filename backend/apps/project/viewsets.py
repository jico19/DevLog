# apps/project/viewsets.py
from rest_framework import viewsets
from . import serializers
from . import models
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from ai.test import Test
from rest_framework import status
from django.shortcuts import get_object_or_404

class ProjectViewSets(viewsets.ModelViewSet):
    queryset = models.Project.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'list':
            return serializers.ProjectListSerializer
        return serializers.ProjectDetailSerializer

    def list(self, request, *args, **kwargs):
        is_self = bool(request.GET.get('self'))

        if is_self:
            qs = models.Project.objects.filter(
                user = request.user
            )
            serializer = self.get_serializer(
                qs, 
                many=True
            )
        else:
            qs = self.get_queryset()
            serializer = self.get_serializer(
                qs,
                many=True
            )
        
        return Response(serializer.data , status=status.HTTP_200_OK)

class EntryViewSets(viewsets.ModelViewSet):
    queryset = models.Entry.objects.all()


    def list(self, request, *args, **kwargs):
        is_self = bool(request.GET.get('self'))

        if is_self:
            qs = models.Entry.objects.filter(
                project__user = request.user
            )
            serializer = self.get_serializer(
                qs, 
                many=True
            )
        else:
            qs = self.get_queryset()
            serializer = self.get_serializer(
                qs,
                many=True
            )
        
        return Response(serializer.data , status=status.HTTP_200_OK)


    def get_serializer_class(self):
        if self.action == 'list':
            return serializers.EntryListSerializer
        return serializers.EntrytDetailSerializer
    
    def destroy(self, request, *args, **kwargs):        
        instance = self.get_object()

        if instance.project.user != request.user:
            return Response({
                "msg": "You can't delete ts.",
            }, status=status.HTTP_403_FORBIDDEN)

        instance.delete()

        return Response({
            "msg": "Successfully Delete this entry."
        }, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        if request.user != instance.project.user:
            return Response({"msg": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = self.get_serializer(instance, data=request.data, partial=kwargs.get('partial', False))
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({
            "msg": "ok!!"
        }, status=status.HTTP_200_OK)

class CommentViewSets(viewsets.ModelViewSet):
    queryset = models.Comment.objects.all()

    def get_serializer_class(self):
        if self.action == 'list':
                return serializers.CommentListSerializer
        return serializers.CommentDetailSerializer
    
    def create(self, request, *args, **kwargs):
        try:
            models.Comment.objects.create(
                entry_id = request.data.get('entry'),
                user = request.user,
                body = request.data.get('body')
            )
        except Exception:
            return Response({
                "msg": "err!!"
            }, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            "msg": "ok!!",
        }, status=status.HTTP_200_OK)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        if instance.user != request.user:
            return Response({
                "msg": "You can't delete ts.",
            }, status=status.HTTP_403_FORBIDDEN)

        instance.delete()

        return Response({
            "msg": "ok!!",
        }, status=status.HTTP_200_OK)
    
class LikeViewSets(viewsets.ModelViewSet):
    queryset = models.Like.objects.all()

    def get_serializer_class(self, *args, **kwargs):
        if self.action == 'list':
            return serializers.LikeListSerializer
        return serializers.LikeDetailSerializer

    def create(self, request, *args, **kwargs):
        try:
            like, created = models.Like.objects.get_or_create(
                entry_id = request.data.get('id'),
                user = self.request.user
            )

            if not created:
                like.delete()
                return Response({"msg": "unliked", "liked": False}, status=status.HTTP_200_OK)

        except Exception:
            return Response({
                "msg": "Error nigga!"
            }, status=status.HTTP_400_BAD_REQUEST)

        return Response({"msg": "liked", "liked": True}, status=status.HTTP_200_OK)

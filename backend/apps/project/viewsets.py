# apps/project/viewsets.py
from rest_framework import viewsets
from . import serializers
from . import models
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from ai.test import Test
from rest_framework import status
from django.db.models import Sum, Count
from django.utils import timezone
from datetime import timedelta


class ProjectViewSets(viewsets.ModelViewSet):
    queryset = models.Project.objects.all()
    permission_classes = [IsAuthenticated]
    def get_serializer_class(self):
        if self.action == 'list':
            return serializers.ProjectListSerializer
        return serializers.ProjectDetailSerializer

    def list(self, request, *args, **kwargs):
        user_id = request.GET.get('id', None)

        if user_id:
            qs = models.Project.objects.filter(
                user_id = int(user_id)
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
    

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def own_projects(self, request):

        qs = models.Project.objects.filter(
            user = request.user
        )
        serializer = self.get_serializer(
            qs, 
            many = True
        )

    
        return Response(
            serializer.data, 
            status=status.HTTP_200_OK
        )

class EntryViewSets(viewsets.ModelViewSet):
    queryset = models.Entry.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve', 'get_trending_entries']:
            return serializers.EntryListSerializer

        return serializers.EntrytDetailSerializer

    def list(self, request, *args, **kwargs):
        user_id = request.GET.get('id', None)

        if user_id:
            qs = models.Entry.objects.filter(
                project__user_id = int(user_id)
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
    
    # custom actions
    @action(detail=False, methods=['get'])
    def get_trending_entries(self, request):
        # 1. Define 'Trending' (e.g., most liked in the last 7 days)
        time_threshold = timezone.now() - timedelta(days=7)

        qs = self.get_queryset().annotate(
            like_count=Count('likes')
        ).filter(
            created_at__gte=time_threshold # Only recent-ish posts
        ).order_by('-like_count', '-created_at')[:10]  # Top 10

        # Fallback: if there are no likes in the last 7 days, 
        # just show the most liked of all time
        if not qs.exists():
            qs = self.get_queryset().annotate(
                like_count=Count('likes')
            ).order_by('-like_count')[:10]

        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class CommentViewSets(viewsets.ModelViewSet):
    queryset = models.Comment.objects.all()
    permission_classes = [IsAuthenticated]

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
    permission_classes = [IsAuthenticated]

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


class UserAchievementsViewSets(viewsets.ModelViewSet):
    queryset = models.UserAchievement.objects.all()
    serializer_class = serializers.UserAchivementsSerializer
    permission_classes = [IsAuthenticated]


    @action(detail=True, methods=['get'])
    def my_achivements(self, request, pk=None):

        unlocked = models.UserAchievement.objects.filter(
            user=pk
        ).select_related('achievement').order_by('-unlocked_at')

        total_points = unlocked.aggregate(
            total=Sum('achievement__points')
        )['total'] or 0

        streak = models.Streaks.objects.filter(user=pk).first()

        return Response({
            'total_points': total_points,
            'current_streak': streak.current_streak if streak else 0,
            'longest_streak': streak.longest_streak if streak else 0,
            'achievements': [
                {
                    'key': ua.achievement.key,
                    'name': ua.achievement.name,
                    'description': ua.achievement.description,
                    'icon': ua.achievement.icon,
                    'category': ua.achievement.category,
                    'points': ua.achievement.points,
                    'unlocked_at': ua.unlocked_at,
                }
                for ua in unlocked
            ]
        })

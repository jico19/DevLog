# apps/project/serializer.py
from rest_framework import serializers
from . import models




class CommentListSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        source = 'user.username',
        read_only=True
    )
    user_id = serializers.IntegerField(
        source = 'user.id',
        read_only=True
    )

    class Meta:
        model = models.Comment
        fields = [
            'id',
            'user_id',
            'username',
            'body',
            'commented_at',
        ]

class CommentDetailSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Comment
        fields = [
            'user',
            'entry',
            'body',
            'commented_at',
        ]

class LikeListSerializer(serializers.ModelSerializer):

    username = serializers.CharField(
        source = 'user.username',
        read_only = True
    )

    class Meta:
        model = models.Like
        fields = [
            'username',
            'liked_at'
        ]

class LikeDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Like
        fields = [
            'entry',
            'user',
            'liked_at'
        ]

class EntryListSerializer(serializers.ModelSerializer):
    project_name = serializers.CharField(
        source = 'project.name',
        read_only = True
    )
    owner_name = serializers.CharField(
        source = "project.user.username",
        read_only = True
    )
    project_user_id = serializers.IntegerField(
        source = 'project.user.id',
        read_only  = True
    )
    comments = CommentListSerializer(many=True, read_only=True)
    likes = LikeListSerializer(many = True, read_only = True)

    class Meta:
        model = models.Entry
        fields = [
            'id',
            'project_user_id',
            'project_name',
            'owner_name',
            'title',
            'screenshot',
            'body',
            'is_milestone',
            'likes',
            'comments',
            'created_at',
        ]

class EntrytDetailSerializer(serializers.ModelSerializer):

    def validate_body(self, value):
        if len(value) <= 10:
            raise serializers.ValidationError("Cannot be less than 10.")
        return value

    class Meta:
        model = models.Entry
        fields = [
            'title',
            'project',
            'body',
            'screenshot',
            'is_milestone',
            'created_at',
        ]
        extra_kwargs = {
            'project': {'write_only': True}
        }

class ProjectListSerializer(serializers.ModelSerializer):
    project_owner = serializers.CharField(
        source = 'user.username',
        read_only =True
    )

    entries = EntryListSerializer(
        many = True,
        read_only = True,
    )

    class Meta:
        model = models.Project
        fields = [
            'id',
            'project_owner',
            'name',
            'description',
            'entries'
        ]

class ProjectDetailSerializer(serializers.ModelSerializer):

    def validate_description(self, value):
        if len(value) <= 10:
            raise serializers.ValidationError("Cannot be less than 10.")
        return value

    class Meta:
        model = models.Project
        fields = [
            'id',
            'user',
            'name',
            'description',
        ]
        extra_kwargs = {
            'user': {'write_only': True}
        }

class AchievementSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Achievement
        fields = '__all__' # all fields

class UserAchivementsSerializer(serializers.ModelSerializer):
    
    achievement_details = AchievementSerializer(
        source = 'achievement',
        read_only=True
    )


    class Meta:
        model = models.UserAchievement
        fields = [
            'user',
            'achievement',
            'achievement_details',
            'unlocked_at',
        ]


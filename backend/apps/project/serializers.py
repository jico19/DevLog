from rest_framework import serializers
from . import models


class ProjectListSerializer(serializers.ModelSerializer):
    project_owner = serializers.CharField(
        source = 'user.username',
        read_only =True
    )

    class Meta:
        model = models.Project
        fields = [
            'id',
            'project_owner',
            'name',
            'description',
        ]

class ProjectDetailSerializer(serializers.ModelSerializer):

    def validate_description(self, value):
        if len(value) <= 10:
            raise serializers.ValidationError("Cannot be less than 10.")
        return value

    class Meta:
        model = models.Project
        fields = [
            'user',
            'name',
            'description',
        ]
        extra_kwargs = {
            'user': {'write_only': True}
        }

class CommentListSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        source = 'user.username',
        read_only=True
    )

    class Meta:
        model = models.Comment
        fields = [
            'id',
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

class EntryListSerializer(serializers.ModelSerializer):
    project_name = serializers.CharField(
        source = 'project.name',
        read_only = True
    )

    comments = CommentListSerializer(many=True, read_only=True)

    class Meta:
        model = models.Entry
        fields = [
            'id',
            'project_name',
            'body',
            'is_milestone',
            'likes',
            'comments',
            'created_at',
        ]

class EntrtDetailSerializer(serializers.ModelSerializer):

    def validate_body(self, value):
        if len(value) <= 10:
            raise serializers.ValidationError("Cannot be less than 10.")
        return value

    class Meta:
        model = models.Entry
        fields = [
            'project',
            'body',
            'screenshot',
            'is_milestone',
            'created_at',
        ]
        extra_kwargs = {
            'project': {'write_only': True}
        }



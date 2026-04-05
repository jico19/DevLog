from rest_framework import serializers
from . import models
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from apps.project.serializers import ProjectListSerializer, EntryListSerializer
from django.db.models import Count

class UserDetailSerializer(serializers.ModelSerializer):



    class Meta:
        model = models.User
        fields = [
            'username',
            'password',
        ]
        extra_kwargs = {
            'password': {'write_only': True, 'min_length': 8}
        }

    def create(self, validated_data):
        data = models.User.objects.create_user(**validated_data)
        return data

class UserListSerializer(serializers.ModelSerializer):

    project_count = serializers.SerializerMethodField()

    class Meta:
        model = models.User
        fields = [
            'id',
            'username',
            'tag_name',
            'total_points',
            'project_count',
        ]
    

    def get_project_count(self, obj):
        return obj.project.count()
    



class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['username'] = user.username
        
        return token
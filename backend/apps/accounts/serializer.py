from rest_framework import serializers
from . import models
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


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
    class Meta:
        model = models.User
        fields = [
            'id',
            'username',
            'tag_name',
            'followers',
        ]


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['username'] = user.username
        
        return token
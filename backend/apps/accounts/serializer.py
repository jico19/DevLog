from rest_framework import serializers
from . import models


class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.User
        fields = [
            'username',
            'password',
        ]

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

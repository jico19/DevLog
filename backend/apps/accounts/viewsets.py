from rest_framework import viewsets
from . import models
from . import serializer


class UserViewSets(viewsets.ModelViewSet):
    queryset = models.User.objects.all()


    def get_serializer_class(self):
        if self.action == 'list':
            return serializer.UserListSerializer
        return serializer.UserDetailSerializer
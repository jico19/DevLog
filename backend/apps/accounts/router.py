from rest_framework import routers
from . import viewsets


router = routers.DefaultRouter()


router.register(r'user', viewsets.UserViewSets)
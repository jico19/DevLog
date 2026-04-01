from rest_framework import routers
from . import viewsets


router = routers.DefaultRouter()

router.register(f'project', viewsets.ProjectViewSets)
router.register(f'entry', viewsets.EntryViewSets)
router.register(f'comment', viewsets.CommentViewSets)
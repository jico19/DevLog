
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.project import viewsets as project
from apps.accounts import viewsets as accounts
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView, TokenRefreshView
)
router = DefaultRouter()

router.register(f'project', project.ProjectViewSets)
router.register(f'entry', project.EntryViewSets)
router.register(f'comment', project.CommentViewSets)
router.register(f'like', project.LikeViewSets)
router.register(r'user', accounts.UserViewSets)

urlpatterns = [
    path('admin/', admin.site.urls),

    # url login
    path('login/', TokenObtainPairView.as_view()),
    path('get/refresh/token/',  TokenRefreshView.as_view()),
] 

urlpatterns += router.urls
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
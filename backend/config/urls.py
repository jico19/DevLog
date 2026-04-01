
from django.contrib import admin
from django.urls import path, include

from rest_framework_simplejwt.views import (
    TokenObtainPairView, TokenRefreshView
)


urlpatterns = [
    path('admin/', admin.site.urls),

    # url login
    path('login/', TokenObtainPairView.as_view()),
    path('get/refresh/token/',  TokenRefreshView.as_view()),

    # apps
    path('', include('apps.project.urls')),
    path('', include('apps.accounts.urls')),
]

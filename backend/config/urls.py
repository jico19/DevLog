
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),

    # apps
    path('', include('apps.project.urls')),
    path('', include('apps.accounts.urls')),
]

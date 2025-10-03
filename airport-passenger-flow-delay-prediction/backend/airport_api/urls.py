from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from core import views
from django.http import JsonResponse

def root_view(request):
    return JsonResponse({
        "message": "Welcome to the Airport API 🚀",
        "available_endpoints": [
            "/api/dashboard-stats/",
            "/api/delay-predictions/",
            "/api/passenger-flow/",
            "/health/",
        ]
    })

def health_check_view(request):
    return JsonResponse({"status": "ok"})

urlpatterns = [
    path("", views.welcome_view),   # Public Welcome Page
    path("admin/", admin.site.urls),

    # API routes
    path("api/", include("core.urls")),
    path("health/", health_check_view),

    # JWT Authentication
    path("api/token/", TokenObtainPaireView.as_view(), name="oken_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
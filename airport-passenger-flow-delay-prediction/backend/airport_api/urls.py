from django.contrib import admin
from django.urls import path, include
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
    path("", root_view),
    path("admin/", admin.site.urls),
    path("api/", include("core.urls")),
    path("health/", health_check_view),
]

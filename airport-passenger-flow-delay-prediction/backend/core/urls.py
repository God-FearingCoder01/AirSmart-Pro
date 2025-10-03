from django.urls import path
from .views import (
    DashboardStatsView,
    FlightDelayPredictionView,
    PassengerFlowView,
)
from django.http import JsonResponse 

def api_root_view(request):
    return JsonResponse({
        "message": "Welcome to the Airport API 🚀",
        "available_endpoints": {
            "dashboard-stats": "/api/dashboard-stats/",
            "delay-predictions": "/api/delay-predictions/",
            "passenger-flow": "/api/passenger-flow/",
        }
    })

urlpatterns = [
    path("", api_root_view),
    path("dashboard-stats/", DashboardStatsView.as_view(), name="dashboard-stats"),
    path("delay-predictions/", FlightDelayPredictionView.as_view(), name="delay-predictions"),
    path("passenger-flow/", PassengerFlowView.as_view(), name="passenger-flow"),
]

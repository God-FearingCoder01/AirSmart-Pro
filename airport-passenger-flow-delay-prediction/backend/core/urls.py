from django.urls import path
from .views import (
    DashboardStatsView,
    FlightDelayPredictionView,
    PassengerFlowView,
    SignUpView,
    CustomLoginView
)
from django.http import JsonResponse 
from rest_framework_simplejwt.views import TokenRefreshView

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
    path("signup/", SignUpView.as_view(), name="signup"),
    path("login/", CustomLoginView.as_view(), name="login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]

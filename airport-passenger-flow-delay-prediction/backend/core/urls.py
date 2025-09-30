from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('passenger-flow/', views.PassengerFlowView.as_view(), name='passenger_flow'),
    path('flight-delay/', views.FlightDelayPredictionView.as_view(), name='flight_delay'),
    path('dashboard-stats/', views.DashboardStatsView.as_view(), name='dashboard_stats'),
]
from django.urls import path
from . import views

urlpatterns = [
    path('passenger-flow/', views.PassengerFlowView.as_view(), name='passenger_flow'),
    path('flight-delay/', views.FlightDelayView.as_view(), name='flight_delay'),
]
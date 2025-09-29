from django.urls import path
from core.views import PassengerFlowView, FlightDelayPredictionView

urlpatterns = [
    path('passenger-flow/', PassengerFlowView.as_view(), name='passenger_flow'),
    path('flight-delay/', FlightDelayPredictionView.as_view(), name='flight_delay'),
]
from django.contrib import admin
from django.urls import path, include
from core.views import PassengerFlowView, FlightDelayPredictionView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('core.urls')),
    path('passenger-flow/', PassengerFlowView.as_view(), name='passenger_flow'),
    path('flight-delay/', FlightDelayPredictionView.as_view(), name='flight_delay'),
]
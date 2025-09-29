from rest_framework import viewsets
from .models import PassengerFlow, FlightDelay
from .serializers import PassengerFlowSerializer, FlightDelaySerializer
from rest_framework.views import APIView
from rest_framework.response import Response

class PassengerFlowView(APIView):
    def get(self, request):
        return Response({"message": "Passenger flow endpoint"})

class FlightDelayPredictionView(APIView):
    def get(self, request):
        return Response({"message": "Flight delay prediction endpoint"})

class PassengerFlowViewSet(viewsets.ModelViewSet):
    queryset = PassengerFlow.objects.all()
    serializer_class = PassengerFlowSerializer

class FlightDelayViewSet(viewsets.ModelViewSet):
    queryset = FlightDelay.objects.all()
    serializer_class = FlightDelaySerializer
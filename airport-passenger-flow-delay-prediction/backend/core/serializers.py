from rest_framework import serializers
from .models import PassengerFlow, FlightDelay

class PassengerFlowSerializer(serializers.ModelSerializer):
    class Meta:
        model = PassengerFlow
        fields = '__all__'

class FlightDelaySerializer(serializers.ModelSerializer):
    class Meta:
        model = FlightDelay
        fields = '__all__'
from rest_framework import serializers
from .models import PassengerFlow, FlightDelay, CustomUser

class PassengerFlowSerializer(serializers.ModelSerializer):
    class Meta:
        model = PassengerFlow
        fields = '__all__'

class FlightDelaySerializer(serializers.ModelSerializer):
    class Meta:
        model = FlightDelay
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ("id", "username", "email", "password", "is_approved")
        read_only_fields = ("is_approved",)

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )
        return user
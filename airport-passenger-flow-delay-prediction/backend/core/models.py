from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    is_approved = models.BooleanField(default=False)

class PassengerFlow(models.Model):
    date = models.DateField()
    time = models.TimeField()
    passenger_count = models.IntegerField()

    def __str__(self):
        return f"{self.date} {self.time} - {self.passenger_count} passengers"

class FlightDelay(models.Model):
    flight_number = models.CharField(max_length=10)
    scheduled_departure = models.DateTimeField()
    actual_departure = models.DateTimeField()
    delay_duration = models.IntegerField()

    def __str__(self):
        return f"{self.flight_number} - Delay: {self.delay_duration} minutes"
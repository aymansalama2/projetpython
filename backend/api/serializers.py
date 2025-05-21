from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Location, Bus, Schedule, Reservation

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')
        read_only_fields = ('id',)

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = '__all__'

class BusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bus
        fields = '__all__'

class ScheduleSerializer(serializers.ModelSerializer):
    departure_location = LocationSerializer(read_only=True)
    arrival_location = LocationSerializer(read_only=True)
    bus = BusSerializer(read_only=True)

    class Meta:
        model = Schedule
        fields = '__all__'

class ReservationSerializer(serializers.ModelSerializer):
    schedule = ScheduleSerializer(read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = Reservation
        fields = '__all__'
        read_only_fields = ('user', 'total_price', 'status')

class CreateReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = ('schedule', 'number_of_seats', 'special_requests')

    def validate(self, data):
        schedule = data['schedule']
        number_of_seats = data['number_of_seats']

        if number_of_seats > schedule.available_seats:
            raise serializers.ValidationError("Pas assez de places disponibles")

        return data 
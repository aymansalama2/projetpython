from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Location, Bus, Route, Schedule, Reservation, UserProfile

class UserSerializer(serializers.ModelSerializer):
    is_admin = serializers.BooleanField(source='profile.is_admin', read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'is_admin', 'is_staff', 'is_superuser')
        read_only_fields = ('id', 'is_admin', 'is_staff', 'is_superuser')

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = UserProfile
        fields = ('id', 'user', 'full_name', 'phone', 'is_admin', 'created_at', 'updated_at')
        read_only_fields = ('is_admin', 'created_at', 'updated_at')

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = '__all__'

class BusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bus
        fields = '__all__'

class RouteSerializer(serializers.ModelSerializer):
    departure_location_detail = LocationSerializer(source='departure_location', read_only=True)
    arrival_location_detail = LocationSerializer(source='arrival_location', read_only=True)

    class Meta:
        model = Route
        fields = ('id', 'name', 'departure_location', 'arrival_location', 'distance', 
                 'duration', 'price', 'created_at', 'updated_at', 
                 'departure_location_detail', 'arrival_location_detail')

class ScheduleSerializer(serializers.ModelSerializer):
    departure_location = LocationSerializer(read_only=True)
    arrival_location = LocationSerializer(read_only=True)
    bus = BusSerializer(read_only=True)

    class Meta:
        model = Schedule
        fields = '__all__'

class CreateUpdateScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = ('departure_location', 'arrival_location', 'bus', 'departure_time', 'arrival_time', 'price', 'available_seats')
        
    def validate(self, data):
        # Validation que l'heure d'arrivée est après l'heure de départ
        if data.get('departure_time') and data.get('arrival_time'):
            if data['arrival_time'] <= data['departure_time']:
                raise serializers.ValidationError({"arrival_time": "L'heure d'arrivée doit être après l'heure de départ."})
        
        # Validation que les lieux de départ et d'arrivée sont différents
        if data.get('departure_location') and data.get('arrival_location'):
            if data['departure_location'] == data['arrival_location']:
                raise serializers.ValidationError({"arrival_location": "Les lieux de départ et d'arrivée ne peuvent pas être identiques."})
        
        return data

class ReservationSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    schedule = ScheduleSerializer(read_only=True)

    class Meta:
        model = Reservation
        fields = '__all__'
        read_only_fields = ('user', 'total_price', 'created_at', 'updated_at')

class CreateReservationSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False)

    class Meta:
        model = Reservation
        fields = ('user', 'schedule', 'number_of_seats', 'special_requests')

    def validate(self, data):
        schedule = data['schedule']
        number_of_seats = data['number_of_seats']

        if number_of_seats > schedule.available_seats:
            raise serializers.ValidationError("Pas assez de places disponibles")

        return data 
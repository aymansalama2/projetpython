from django.shortcuts import render
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from .models import Bus, Location, Schedule, Reservation
from .serializers import (
    BusSerializer, LocationSerializer, ScheduleSerializer,
    UserSerializer, ReservationSerializer, CreateReservationSerializer
)

# Create your views here.

class BusViewSet(viewsets.ModelViewSet):
    queryset = Bus.objects.all()
    serializer_class = BusSerializer
    permission_classes = [permissions.IsAuthenticated]

class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = [permissions.IsAuthenticated]

class ScheduleViewSet(viewsets.ModelViewSet):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Schedule.objects.all()
        departure = self.request.query_params.get('departure', None)
        arrival = self.request.query_params.get('arrival', None)
        date = self.request.query_params.get('date', None)

        if departure:
            queryset = queryset.filter(departure_location__city__icontains=departure)
        if arrival:
            queryset = queryset.filter(arrival_location__city__icontains=arrival)
        if date:
            queryset = queryset.filter(departure_time__date=date)

        return queryset

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def profile(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

class ReservationViewSet(viewsets.ModelViewSet):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'create':
            return CreateReservationSerializer
        return ReservationSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def user(self, request):
        reservations = Reservation.objects.filter(user=request.user)
        serializer = self.get_serializer(reservations, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        reservation = self.get_object()
        if reservation.status == 'confirmed':
            reservation.status = 'cancelled'
            reservation.save()
            return Response({'status': 'reservation cancelled'})
        return Response(
            {'error': 'Cannot cancel this reservation'},
            status=status.HTTP_400_BAD_REQUEST
        )

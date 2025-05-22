from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Bus, Location, Route, Schedule, Reservation, UserProfile
from .serializers import (
    BusSerializer, LocationSerializer, RouteSerializer, ScheduleSerializer,
    UserSerializer, ReservationSerializer, CreateReservationSerializer,
    UserProfileSerializer, CreateUpdateScheduleSerializer
)
from rest_framework.views import APIView
from .permissions import IsAdminOrReadOnly, IsAdminUser, IsOwnerOrAdmin
import logging

logger = logging.getLogger(__name__)

# Create your views here.

class BusViewSet(viewsets.ModelViewSet):
    queryset = Bus.objects.all()
    serializer_class = BusSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]

class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]

class RouteViewSet(viewsets.ModelViewSet):
    queryset = Route.objects.all()
    serializer_class = RouteSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]

    def get_queryset(self):
        queryset = Route.objects.all()
        departure = self.request.query_params.get('departure', None)
        arrival = self.request.query_params.get('arrival', None)

        if departure:
            queryset = queryset.filter(departure_location__city=departure)
        if arrival:
            queryset = queryset.filter(arrival_location__city=arrival)

        return queryset

class ScheduleViewSet(viewsets.ModelViewSet):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return CreateUpdateScheduleSerializer
        return ScheduleSerializer

    def get_queryset(self):
        queryset = Schedule.objects.all()
        departure = self.request.query_params.get('departure', None)
        arrival = self.request.query_params.get('arrival', None)
        date = self.request.query_params.get('date', None)

        if departure:
            queryset = queryset.filter(departure_location__city=departure)
        if arrival:
            queryset = queryset.filter(arrival_location__city=arrival)
        if date:
            queryset = queryset.filter(departure_time__date=date)

        return queryset

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

    @action(detail=False, methods=['get'])
    def profile(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            profile = UserProfile.objects.get(user=request.user)
            if profile.is_admin:
                profiles = UserProfile.objects.all()
                serializer = UserProfileSerializer(profiles, many=True)
            else:
                serializer = UserProfileSerializer(profile)
            return Response(serializer.data)
        except UserProfile.DoesNotExist:
            logger.info(f"Creating profile for user {request.user.username}")
            profile = UserProfile.objects.create(
                user=request.user,
                full_name=f"{request.user.first_name} {request.user.last_name}",
                phone="",
                is_admin=request.user.is_superuser
            )
            serializer = UserProfileSerializer(profile)
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error in UserProfileView.get: {str(e)}")
            return Response(
                {'error': 'Une erreur est survenue lors de la récupération du profil'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def patch(self, request):
        try:
            if request.user.profile.is_admin:
                profile = get_object_or_404(UserProfile, user_id=request.data.get('user_id'))
            else:
                profile = get_object_or_404(UserProfile, user=request.user)
            serializer = UserProfileSerializer(profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except UserProfile.DoesNotExist:
            return Response(
                {'error': 'Profil utilisateur non trouvé'},
                status=status.HTTP_404_NOT_FOUND
            )

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class ReservationViewSet(viewsets.ModelViewSet):
    serializer_class = ReservationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Reservation.objects.all()
        return Reservation.objects.filter(user=user)

    def get_serializer_class(self):
        if self.action == 'create':
            return CreateReservationSerializer
        return ReservationSerializer

    def perform_create(self, serializer):
        user = self.request.user
        if user.is_staff and 'user' in serializer.validated_data:
            # Si c'est un admin et qu'un utilisateur est spécifié
            serializer.save(user=serializer.validated_data['user'])
        else:
            # Sinon, utiliser l'utilisateur actuel
            serializer.save(user=user)

class UserReservationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.profile.is_admin:
            reservations = Reservation.objects.all()
        else:
            reservations = Reservation.objects.filter(user=request.user)
        serializer = ReservationSerializer(reservations, many=True)
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

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Créer le profil utilisateur
            UserProfile.objects.create(
                user=user,
                full_name=request.data.get('full_name', ''),
                phone=request.data.get('phone', '')
            )
            # Générer le token
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': serializer.data,
                'token': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            username = request.data.get('username')
            password = request.data.get('password')
            
            if not username or not password:
                return Response({
                    'error': 'Veuillez fournir un nom d\'utilisateur et un mot de passe'
                }, status=status.HTTP_400_BAD_REQUEST)

            user = authenticate(username=username, password=password)
            
            if user:
                # Créer le profil utilisateur s'il n'existe pas
                try:
                    profile = UserProfile.objects.get(user=user)
                except UserProfile.DoesNotExist:
                    profile = UserProfile.objects.create(
                        user=user,
                        full_name=f"{user.first_name} {user.last_name}",
                        phone="",
                        is_admin=user.is_superuser
                    )

                refresh = RefreshToken.for_user(user)
                serializer = UserSerializer(user)
                return Response({
                    'user': serializer.data,
                    'token': {
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                    }
                })
            
            return Response({
                'error': 'Identifiants invalides'
            }, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            logger.error(f"Error in LoginView: {str(e)}")
            return Response({
                'error': 'Une erreur est survenue lors de la connexion'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

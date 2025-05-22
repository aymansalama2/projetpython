from django.urls import path
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'buses', views.BusViewSet)
router.register(r'locations', views.LocationViewSet)
router.register(r'routes', views.RouteViewSet)
router.register(r'schedules', views.ScheduleViewSet)
router.register(r'reservations', views.ReservationViewSet, basename='reservation')
router.register(r'users', views.UserViewSet, basename='user')

urlpatterns = [
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/login/', views.LoginView.as_view(), name='login'),
    path('auth/user/', views.CurrentUserView.as_view(), name='current-user'),
    path('users/me/', views.UserProfileView.as_view(), name='user-profile'),
    path('users/profile/', views.UserProfileView.as_view(), name='user-profile-detail'),
    path('reservations/user/', views.UserReservationsView.as_view(), name='user-reservations'),
] + router.urls 
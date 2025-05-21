from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'locations', views.LocationViewSet)
router.register(r'buses', views.BusViewSet)
router.register(r'schedules', views.ScheduleViewSet)
router.register(r'reservations', views.ReservationViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 
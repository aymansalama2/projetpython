from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Bus(models.Model):
    plate_number = models.CharField(max_length=20, unique=True)
    capacity = models.IntegerField()
    model = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.model} - {self.plate_number}"

class Location(models.Model):
    city = models.CharField(max_length=100)
    address = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.city

class Schedule(models.Model):
    bus = models.ForeignKey(Bus, on_delete=models.CASCADE, related_name='schedules')
    departure_location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='departures')
    arrival_location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='arrivals')
    departure_time = models.DateTimeField()
    arrival_time = models.DateTimeField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    available_seats = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.departure_location} → {self.arrival_location} - {self.departure_time}"

class User(models.Model):
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=100)
    full_name = models.CharField(max_length=200)
    phone = models.CharField(max_length=20)
    is_admin = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.username

class Reservation(models.Model):
    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('confirmed', 'Confirmée'),
        ('cancelled', 'Annulée'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reservations')
    schedule = models.ForeignKey(Schedule, on_delete=models.CASCADE, related_name='reservations')
    number_of_seats = models.IntegerField()
    special_requests = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.total_price:
            self.total_price = self.schedule.price * self.number_of_seats
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Réservation de {self.user.username} - {self.schedule}"

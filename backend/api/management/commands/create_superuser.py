from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import transaction
from api.models import UserProfile

User = get_user_model()

class Command(BaseCommand):
    help = 'Crée un superuser admin avec des identifiants par défaut'

    def handle(self, *args, **options):
        try:
            with transaction.atomic():
                if not User.objects.filter(username='admin').exists():
                    # Créer le superuser
                    user = User.objects.create_superuser(
                        username='admin',
                        email='admin@example.com',
                        password='admin123'
                    )
                    # Créer le profil admin associé
                    UserProfile.objects.create(
                        user=user,
                        full_name='Administrateur',
                        phone='0000000000',
                        is_admin=True
                    )
                    self.stdout.write(self.style.SUCCESS('Superuser admin créé avec succès'))
                else:
                    self.stdout.write(self.style.WARNING('Le superuser admin existe déjà'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Erreur lors de la création du superuser: {str(e)}')) 
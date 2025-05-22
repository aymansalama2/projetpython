from rest_framework import permissions

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Permet aux administrateurs d'avoir un accès complet en lecture/écriture.
    Les autres utilisateurs ont uniquement un accès en lecture.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.profile.is_admin

class IsAdminUser(permissions.BasePermission):
    """
    Permet uniquement aux administrateurs d'accéder à la vue.
    """
    def has_permission(self, request, view):
        return request.user and request.user.profile.is_admin

class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Permet aux administrateurs d'avoir un accès complet.
    Les autres utilisateurs ne peuvent accéder qu'à leurs propres données.
    """
    def has_object_permission(self, request, view, obj):
        if request.user.profile.is_admin:
            return True
        return obj.user == request.user 
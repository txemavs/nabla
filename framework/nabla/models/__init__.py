from .device import *


class Profile(models.Model):
    ''' Mas datos del usuario
    '''
    id =            models.IntegerField(primary_key=True)
    user =          models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    view =          models.ForeignKey(View, on_delete=models.CASCADE, null=True, blank=True)
    dark =          models.BooleanField(default=True)
    own =           models.BooleanField(default=False)
    
    @classmethod
    def queryset_user(cls, user):
        qs = Profile.objects.filter(user=user)
        
        if qs.count()>0: return qs
        
        new = Profile(id = user.id, user = user)
        new.save()
        return Profile.objects.filter(user=user)

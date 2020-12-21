import uuid
import json
import datetime
from django.db import models
from django.db.models import Q
from django.forms.models import model_to_dict
from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework import serializers, viewsets, filters, permissions, generics, viewsets, renderers, fields
from rest_framework.renderers import JSONRenderer, BrowsableAPIRenderer

from model_utils import FieldTracker
from nabla.channel import *






class IsOwnerOrReadOnly(permissions.BasePermission):
    
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS: return True
        return obj.created_by == request.user




class BaseModel(models.Model):
    
    class Meta:
        abstract = True
        ordering = ('created_at', )

    id =            models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name =          models.CharField(max_length=255, null=True, blank=True) 
    public =        models.BooleanField(default=False)    
    created_by =    models.ForeignKey(User, on_delete=models.PROTECT, null=True, blank=True)
    created_at =    models.DateTimeField(default=timezone.now, blank=True)
    modified_at =   models.DateTimeField(default=timezone.now, blank=True)


    def save(self, *args, **kwargs):
        if not self.pk: self.created_at = timezone.now()
        self.modified_at = timezone.now()
        super().save(*args, **kwargs)
        group = "public" if self.public else "user-%s" % self.created_by_id
        group_message( group, 'object', {
            'model':self.__class__.__name__.lower(),
            'saved':str(self.id),
            'user':self.created_by_id,
            #'data' serializaer UUID
        })


    def delete(self, *args, **kwargs):
        group = "public" if self.public else "user-%s" % self.created_by_id
        message = {
            'model':self.__class__.__name__.lower(),
            'deleted':str(self.id),
            'user':self.created_by_id,    
        }
        super().delete(*args, **kwargs)
        group_message( group, 'object', message)


    def __unicode__(self):
        return "%s %s" % (self.name, self.id)

    def owner(self):
        if self.created_by is None: return ""
        return self.created_by.username

    @classmethod
    def serializer(cls):
        ''' Get the default model serializer
        '''
        class Serializer(serializers.ModelSerializer): #Hyperlinked?

            owner = serializers.CharField(read_only=True,)
            class Meta:
                model = cls
                exclude = ['created_at', 'modified_at']
                read_only_fields = ('id', 'created_by')
        
        Serializer.__name__ =  cls.__name__ + "Serializer"
        return Serializer


    @classmethod
    def objects_user(cls, user):
        ''' Get available objects for an user
        '''
        return cls.objects.filter( Q(public=True) | Q(created_by=user) )


    @classmethod
    def viewset(cls):
        ''' Get the default model view set
        '''

        class ViewSet(viewsets.ModelViewSet):
    
            serializer_class = cls.serializer()
            permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
            
            def get_queryset(self):
                if self.request.user.is_anonymous: return cls.objects.filter(public=True)
                return cls.objects_user( self.request.user )

            def perform_create(self, serializer):
                serializer.save(created_by=self.request.user)
        
        ViewSet.__name__ =  cls.__name__ + "Objects"
        return ViewSet






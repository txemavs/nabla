from django.contrib import admin
from .models import *


class ScopeAdmin(admin.ModelAdmin):
    list_display  = ('id','name', 'public', 'created_by')

admin.site.register(Scope,ScopeAdmin)


class ComponentAdmin(admin.ModelAdmin):
    list_display  = ('id','name', 'public', 'created_by')

admin.site.register(Component, ComponentAdmin)


class ProfileAdmin(admin.ModelAdmin):
    list_display  = ('user', )

admin.site.register(Profile, ProfileAdmin)


class DeviceAdmin(admin.ModelAdmin):
    list_display  = ('id','name','bound', 'created_by')

admin.site.register(Device, DeviceAdmin)


class PropertyAdmin(admin.ModelAdmin):
    list_display  = ('id','name')

admin.site.register(Property, PropertyAdmin)


class ViewAdmin(admin.ModelAdmin):
    list_display  = ('id','name', 'public', 'created_by')

admin.site.register(View,ViewAdmin)

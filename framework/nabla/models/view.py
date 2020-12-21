from .base import *


class Scope(BaseModel):
    ''' Es un espacio de nombres para una determinada View
    '''
    pass



class Property(models.Model):
    ''' Una variable dentro de un scope, envia un mensaje 'property' al canal scope si cambia
    '''

    class Type(models.IntegerChoices):
        String = 0
        Number = 1
        Boolean = 2
        Object = 3
        Array = 4
    
    scope =         models.ForeignKey( Scope, on_delete=models.PROTECT, null=True, blank=True)
    type =          models.IntegerField( choices=Type.choices, default=Type.String)
    name =          models.CharField( max_length=255, null=True, blank=True) 
    value =         models.TextField( null=True, blank=True)
    tracker =       FieldTracker()

    class Meta:
        verbose_name_plural = "Properties"
        index_together = [("scope", "name")] 
        unique_together = [["scope", "name"]]


    @property
    def has_changed(self):
        return bool(self.tracker.changed())

    def __unicode__(self):
        return "%s %s" % (self.name, self.created_by)

    def publish(self):
        send_group( "scope-%s" % self.scope_id, {
            "type": "type__property", 
            "name": self.name, 
            "value": self.value, 
            "scope": str(self.scope_id) 
        })

    def save(self, *args, **kwargs):
        if self.scope is not None and self.has_changed: self.publish()
        super().save(*args, **kwargs)



class Component(BaseModel):
    ''' Es un componente de Vue
    '''    
    template =      models.TextField( null=True, blank=True)
    script =        models.TextField( null=True, blank=True)
    style =         models.TextField( null=True, blank=True)
    width =         models.IntegerField(null=True, blank=True)
    height =        models.IntegerField(null=True, blank=True)
    tracker =       FieldTracker()

    def __unicode__(self):
        return "%s %s" % (self.name, self.created_by)

    def changes(self):
        actual = {}  
        for field in self.tracker.changed().keys():
            value = getattr(self, field)
            if isinstance(value, uuid.UUID): value=str(value)
            if isinstance(value, datetime.datetime): value=value.isoformat()
            actual[field]=value
        return actual

    def save(self, *args, **kwargs):

        changes = self.changes()
        super().save(*args, **kwargs)
        if changes:
            devices = [] 
            for view in self.view_set.all(): 
                for device in view.device_set.all(): 
                    if not device in devices: devices.append(device)
            for device in devices:
                group_message( "device-%s" % device.id, 'component', {'changes': changes} )
        



class View(BaseModel):
    ''' Es una vista que consta de un componente y un scope, si cambia notifica a self.device_set
    '''
    scope =         models.ForeignKey(Scope, on_delete=models.PROTECT, null=True, blank=True)
    component =     models.ForeignKey(Component, on_delete=models.PROTECT, null=True, blank=True)
    tracker =       FieldTracker()

    def __unicode__(self):
        return "%s %s" % (self.name, self.created_by)


    def changes(self):
        actual = {}  
        for field in self.tracker.changed().keys():
            value = getattr(self, field)
            if isinstance(value, uuid.UUID): value=str(value)
            if isinstance(value, models.Model): value=str(value.id)
            if isinstance(value, datetime.datetime): value=value.isoformat()
            actual[field]=value
        return actual



    def save(self, *args, **kwargs):

        changes = self.changes()
        super().save(*args, **kwargs)    
        if changes:
            for device in self.device_set.all(): 
                group_message( "device-%s" % device.id, 'view', {'changes': changes} )
        




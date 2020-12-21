from .view import *

class Device(BaseModel):
    ''' Es un dispositivo unico (o cada navagador) con una cookie que lo identifica
        - Deberia tener una view, si no la tiene habra que configurarla
        - Tiene un channel por el que decirle cosas

        Al crear un nuevo dispositivo, se le crea un channel (que solo vale para configurar)
        *Varios channel pueden ir al mismo scope

    '''
    
    view =          models.ForeignKey(View, on_delete=models.PROTECT, null=True, blank=True)
    binding =       models.BooleanField(default=False)
    control =       models.ForeignKey("Device", on_delete=models.SET_NULL, null=True, blank=True)
    bound =         models.BooleanField(default=False)
    system =        models.CharField(max_length=255, null=True, blank=True)
    browser =       models.CharField(max_length=255, null=True, blank=True)
    width =         models.IntegerField(null=True, blank=True)
    height =        models.IntegerField(null=True, blank=True)
    ip =            models.CharField(max_length=255,null=True, blank=True)
    camera =        models.BooleanField(default=False)
    gps =           models.BooleanField(default=False)
    bluetooth =     models.BooleanField(default=False)
    fullscreen =    models.BooleanField(default=False)
    scale =         models.BooleanField(default=False)
    width =         models.IntegerField(null=True, blank=True)
    height =        models.IntegerField(null=True, blank=True)
    rotation =      models.IntegerField(null=True, blank=True)
    pos_x =         models.IntegerField(null=True, blank=True)
    pos_y =         models.IntegerField(null=True, blank=True)
    
    tracker =       FieldTracker()

    def changes(self):
        #c =  JSONRenderer().render(DeviceSerializer(self, fields=self.changed_fields).data)
        actual = {}  
        for field in self.tracker.changed().keys():
            value = getattr(self, field)
            print("Reactive.changes",field, value, type(value))
            if isinstance(value, uuid.UUID): value=str(value)
            if isinstance(value, models.Model): value=str(value.id)
            if isinstance(value, datetime.datetime): value=value.isoformat()
            actual[field]=value
        return actual


    def __str__(self):
        return "%s %s" % (self.name, self.id)

    def __unicode__(self):
        return "%s %s" % (self.name, self.id)


    def save(self, *args, **kwargs):

        changes = self.changes()
        if changes:
            #message = {'type':'type__device', 'changes': changes }
            super().save(*args, **kwargs)        
            #send_group( "device-%s" % self.id, message )
            group_message( "device-%s" % self.id, 'device', {'changes': changes} )
            #print(changes)
        else:
            super().save(*args, **kwargs)
 


    def changes1(self):
        #c =  JSONRenderer().render(DeviceSerializer(self, fields=self.changed_fields).data)
        val = {}  
        
        for field in self.changed_fields:
            value = getattr(self, field)
            print("Device.changes",field, value, type(value))
            if isinstance(value, datetime.datetime): value=value.isoformat()
            if isinstance(value, Device): value=str(value.id)
            if isinstance(value, View): value=str(value.id)
            if isinstance(value, User): value=value.id
            val[field]=value
        return val


    @staticmethod
    def viewset():

        class DeviceViewSet(viewsets.ModelViewSet):
            
            serializer_class = Device.serializer()
            filter_backends = [filters.OrderingFilter]
            ordering_fields = '__all__'

            def get_queryset(self):
                if self.request.user.is_anonymous:
                    return Device.objects.filter(created_by=None)
                queryset = Device.objects.filter(created_by=self.request.user)
                return queryset


        return DeviceViewSet











class DeviceSerializer(serializers.ModelSerializer):

 
    class Meta:
        model = Device
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        fields = kwargs.pop('fields', None)
        super().__init__(*args, **kwargs)
        if fields is not None:
            allowed = set(fields)
            existing = set(self.fields)
            for field_name in existing - allowed:
                self.fields.pop(field_name)















import sys
import json
import datetime
from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from nabla.models import *

JSON = JSONRenderer()


@database_sync_to_async
def del_session_key(session, key):
    del session[key]
    session.save()

    print("               DELETED SESSION "+key)
    




def text_data(event):
    ''' Don't touch event type, IDKW
    '''
    message = event.copy()
    message['type']=event['type'].replace('type__','')
    return json.dumps(message)




class DeviceData(serializers.ModelSerializer):

    id = serializers.CharField(max_length=36)
    view = serializers.PrimaryKeyRelatedField(read_only=True, pk_field=fields.UUIDField(format='hex_verbose'))

    class Meta:
        model = Device
        fields = ['id', 'view', 'name', 
                'system','scale', 'width', 'height', 'camera', 'bluetooth', 'gps', 'fullscreen', 'created_by']



class DeviceInfo(object):

    def __init__(self, device_id):
        try:
            self.device = Device.objects.get(id=device_id)
        except Device.DoesNotExist:
            self.device = None
            self.scope_id = None
            self.controls = []
            return

        self.scope_id = None if self.device.view is None else self.device.view.scope_id
        self.controls = list(self.device.device_set.all().select_related())
        self.data = DeviceData(self.device).data

@database_sync_to_async
def get_device_info(device_id):
    return DeviceInfo(device_id)



class ControlInfo(object):
    def __init__(self, device):
        print("REGISTERED NEW CONTROL")
        self.device = device
        self.scope_id = None
        self.controls = []
        self.data = DeviceData(self.device).data

@database_sync_to_async
def new_control_device(user):
    device = Device(
        name = "Control "+ user.username,
        binding = False,
        bound = True,
        created_by = user
    )
    device.save()
    return ControlInfo(device)
    


@database_sync_to_async
def new_device_bound(user, control_id=None):
    device = Device(
        name=datetime.datetime.now().strftime("%Y/%m/%d %H:%M:%S"),
        binding=False,
        bound = True,
        created_by = user,
        control_id = control_id,
    )
    device.save()
    return device
    



@database_sync_to_async
def get_scopes(user):
    return list(Scope.objects_user(user))






#Descartado
@database_sync_to_async
def channel_create(channel_id, device_id):
    Channel(id=channel_id, device_id=device_id).save()

#Descartado
@database_sync_to_async
def channel_discard(channel_id):
    try:
        Channel.objects.get(id=channel_id).delete()
    except:
        pass








@database_sync_to_async
def get_device(pk):
    try:
        return Device.objects.get(id=pk)
    except Device.DoesNotExist:
        return None



@database_sync_to_async
def object_save(obj):
    obj.save()



@database_sync_to_async
def get_device(pk):
    try:
        return Device.objects.get(id=pk)
    except Device.DoesNotExist:
        return None




@database_sync_to_async
def get_device_bind(device_id, control_id, user_id):
    try:
        device = Device.objects.get(id=device_id)
    except Device.DoesNotExist:
        return None

    device.binding = False
    device.bound = True
    device.control_id = control_id
    device.created_by_id = user_id
    device.save()
    return device
    




@database_sync_to_async
def get_device_scope_id(device_id):
    try:
        device = Device.objects.get(id=device_id)
    except Device.DoesNotExist:
        return None

    if device.view is None: return None

    return device.view.scope_id



@database_sync_to_async
def get_view_scope_id(view_id):
    try:
        view = View.objects.get(id=view_id)
    except View.DoesNotExist:
        return None

    return view.scope_id



@database_sync_to_async
def set_property(scope_id, name, value):
    for prop in Property.objects.filter(scope_id=scope_id, name=name):
        prop.value=value
        prop.save()









@database_sync_to_async
def get_control_devices(device_id):
    try:
        device = Device.objects.get(id=device_id)
    except Device.DoesNotExist:
        return []
    
    
    return list(device.device_set.all().select_related())
    #return [{"id":x.id, "name":x.name} for x in device.devices.all()]


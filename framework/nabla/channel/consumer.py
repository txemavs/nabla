from .groups import *
from urllib import parse



class NablaConsumer(Messages):
    ''' Websocket messages

        Groups are needed to communicate one device with another.
        New device uses token, known device uses id cookie
        
        Control does not create a device!!!

        Case:
        * Binding: assigned to group binding-token and wait for control to send
          the bound message.
        * Device: device group
        * Control:

        Note:
        - Django session cookie only available if requested from authenticated 
          page in the same domain

    '''

    device_type = "device"
    binding = False
    unknown = True
    info = None
    

    def parameters(self):
        qs = parse.parse_qs(self.scope['query_string'])
        if b'type' in qs.keys():
            self.device_type = qs[b'type'][0].decode('utf-8')
        if b'binding' in qs.keys():
            self.binding = qs[b'binding'][0].decode('utf-8')


    async def get_info(self, device_id):
        self.info = await get_device_info(device_id)

        self.unknown = self.info.device is None
        if self.unknown: 
            self.name = self.token[0:8]
            return

        self.name = self.info.device.name
        await self.group.connect_scope()

        if self.device_type=='control':
            for device in self.info.controls:
                self.group.connect_extra('device-%s' % device.id)
                


    async def connect(self):
        ''' Minimo canal device, y si existe a view.scope
        '''

        self.user = self.scope["user"]
        self.token = self.scope['url_route']['kwargs']['token']
        self.group = Group(self)
        self.protocol = Protocol(self)
        self.parameters()
        
        
        
        await self.get_info(self.token)
        
        if self.device_type=='control':
            await self.group.connect_user()
        

        if self.unknown: 
            self.binding=True

        await self.group.connect_own('token' if self.binding else 'device')
        await self.accept()

        self.log("   ++> Connected %s %s%s: %s %s %s %s" % (
            self.name,
            self.device_type,
            "" if self.user.is_anonymous else " (%s)" % self.user,
            self.group.own, 
            self.group.user,
            self.group.scope, 
            self.group.extra,            
        ))

        reply = {'ts':datetime.datetime.timestamp(datetime.datetime.now())*1000}

        if not self.user.is_anonymous:
            reply['user'] = self.user.id        
        
        if self.info.device is not None:
            reply['device'] = self.info.data        
        
        if self.unknown:
            reply['unknown'] = True

        await self.send_reply('device', reply)

        session = self.scope['session']
        scanned = session.get('scanned', False)
        if scanned and not self.user.is_anonymous:
            await self.device_bind(scanned)
            await del_session_key(session, 'scanned')

            print("******************* SCANNED: %s" % scanned)

    async def disconnect(self, close_code):
        ''' Disconnect all groups
        '''
        print("   -X- %s" % self.name)
        await self.group.disconnect()










    async def device_bind(self, token):
        ''' Control scanned a token
        '''
        
        if self.user.is_anonymous:
            print("ANONYMOUS BINDING??????")
            self.send_error('auth')
            return     

        
        if self.info.device is None:
            print("==============NEW CONTROL", self.user)
            self.info = await new_control_device(self.user)
            await self.send_reply('device', {'identificate': str(self.info.device.id) })
        
        control_id = self.info.device.id
        
        print ("*** Control "+str(control_id)+" binds "+token)

        device = await new_device_bound(self.user, control_id)

        if device is None: 
            await self.send_error('failed new device')
            return

        
        await self.channel_layer.group_send("token-"+token, {
            'type':'type__device',
            'device':str(device.id), 
            'status':'bound' 
        })




    async def device_bound(self, device):
        ''' New device confirms bound
        '''

        device_id = device['id']
        
        
        self.token = device_id
        await self.group.reconnect_own('device')
        await self.get_info(device_id)
        
        self.binding = False
        await self.send_reply('device', {'device':str(device_id), 'status':'ready' })



        # group_old =  self.con.group_own
        #self.con.group_own = 'device-%s' % (data['device']['id'])
        #await self.con.channel_layer.group_discard( group_old, self.con.channel_name )
        #await self.con.channel_layer.group_add( self.con.group_own , self.con.channel_name )
        #await self.con.send_reply('device', {'log': '%s to %s' % (group_old, self.con.group_own) })















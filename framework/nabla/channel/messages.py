from .protocol import *

class Messages(AsyncWebsocketConsumer):

    debug = True
    

    def log(self, message):
        if not self.debug: return
        print(message.replace("'",""))


     

    async def send_reply(self, message, data):
        self.log("<--   %s [%s] %s" % (self.name, message,data) )
        data.update({'type': 'type__'+message})
        await self.send(text_data=text_data(data))

    async def send_error(self, message):
        await self.send_reply('error', {'error':message})

    async def send_device(self, message, data, device_id=None):
        self.log("<==   %s [%s] %s" % (self.name, message, data) )
        data.update({'type': 'type__'+message})
        if device_id is None: device_id=self.token
        await self.channel_layer.group_send( "device-%s" % device_id, data )


    async def send_scope(self, message, data):
        self.log("<=-   %s [%s] %s" % (self.name, message, data) )
        data.update({'type': 'type__'+message})
        await self.channel_layer.group_send( self.group_scope, data  )


    # RX ----------------------------------------------------------------------

    async def receive(self, text_data):

        self.log("   -%s%s" % ("-> " if self.user.is_anonymous else "-"+self.user.username+"-> ", text_data.replace('"', '')))
        
        data = json.loads(text_data)

        await self.protocol.message(data)




    # TX ----------------------------------------------------------------------


    async def type__error(self, event):
        self.log("ERR    %s" % event)
        await self.send(text_data=text_data(event))


    async def type__object(self, event):
        self.log("<<<    %s" % event)
        await self.send(text_data=text_data(event))


        

    async def type__property(self, event):
        self.log("<--    %s" % event)
        await self.send(text_data=text_data(event))
        

    async def type__device(self, event):
        ''' Viene por device, y cambia al grupo del nuevo scope
        '''
        self.log("<--    %s" % event)
        await self.send(text_data=text_data(event))

        
        if 'changes' in event.keys():
            if 'view' in event['changes'] or 'view_id' in event['changes']:
                #self.info = await get_device_info(self.device_id)                
                #await self.connect_scope()
                await self.get_info(self.token)
            

    async def type__view(self, event):
        self.log("<--    %s" % event)
        await self.send(text_data=text_data(event))



    async def type__component(self, event):
        self.log("<--    %s" % event)
        await self.send(text_data=text_data(event))


        






from .sync import *

import django


class Protocol(object):


    def __init__(self, consumer):

        self.con = consumer

    def check(self, kwargs):
        for kw, val in kwargs.items():
            print("******** Unexpected Argument:"+kw)


    async def message(self, data):
        message = data["message"]
        del data["message"]

        if hasattr(self, message):
            method = getattr(self, message)
            await method(**data)
        else:   
            self.con.send_error('Unknown protocol for '+message)








    async def property(self, name, value):
        ''' Set property value in the current scope
        '''
        await set_property(self.con.info.scope_id, name, value)



    async def scope_property(self, scope, name, value):
        ''' Set property value in a scope
        TODO: check user or device permission
        '''
        await set_property(scope, name, value)




    async def clock(self):
        print("CLOCK!")
        await self.con.send_device('device', {'utc':datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')})



    async def bind(self, token, **kwargs):
        ''' Control scanned a token
        '''
        self.check(kwargs)
        await self.con.device_bind(token)


    async def bound(self, device, **kwargs):
        ''' New device confirms bound
        '''
        self.check(kwargs)
        await self.con.device_bound(device)



    async def cmd(self, cmd, **kwargs):
        ''' New device confirms bound
        '''

        if cmd=='help':
            
            stdout = 'Sorry, no help available yet.\n'
            
            await self.con.send_reply('log', {'stdout':stdout})


        if cmd=='version':
            
            stdout = 'Python %s\n' % (sys.version.split('\n')[0])
            stdout += 'Django %s\n' % django.get_version() 
            stdout += 'Nabla Framework\n'
            
            await self.con.send_reply('log', {'stdout':stdout})



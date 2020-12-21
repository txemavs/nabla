from .messages import *



class Group(object):
    '''
    '''
    control = None
    scope = None
    user = None
    own = None

    def __init__(self, consumer):
        self.con = consumer
        self.extra = []

    async def add(self, group):
        await self.con.channel_layer.group_add( group , self.con.channel_name )

    async def discard(self, group):
        await self.con.channel_layer.group_discard( group , self.con.channel_name )


    async def connect_own(self, cls):
        ''' Conect device
        '''
        self.own = '%s-%s' % (cls, self.con.token)
        await self.add( self.own )
        
    async def reconnect_own(self, cls):
        previous = self.own

        await self.connect_own(cls)
        await self.discard( previous )
        print("=============RECONNECTED %s TO %s" % (previous, self.own) )
        

    async def connect_user(self):
        ''' Conect user
        '''
        await self.add( 'public' )
        if self.con.user.is_anonymous: return
        self.user = 'user-%s' % (self.con.user.id)
        await self.add( self.user )
        scopes = await get_scopes(self.con.user)
        for scope in scopes:
            await self.connect_extra("scope-%s" % scope.id)

    async def connect_scope(self):
        ''' Disconect from connected scope and connect to current scope
        '''
        if not self.con.info: return

        if self.scope is not None:
            self.con.log(" ***  Disconnect %s" % self.scope)
            await self.discard( self.scope )

        if self.con.info.scope_id is not None:
            self.scope = 'scope-%s' % self.con.info.scope_id
            await self.add( self.scope )


    async def connect_extra(self, extra):
        self.extra.append(extra)
        await self.add(extra)


    async def disconnect(self):
        ''' Disconnect all groups
        '''
        
        await self.discard( 'public' )
        await self.discard( self.own )
    
        if self.scope is not None: 
            await self.discard( self.scope )
    
        for extra in self.extra: 
            await self.discard( extra )

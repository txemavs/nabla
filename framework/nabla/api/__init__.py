from django.http import Http404
from django.urls import reverse
from rest_framework import views, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from nabla.models import *



@api_view(['GET'])
def no_data(request, format=None):
    return Response({'error': 'unknown endpoint'})



@api_view(['GET'])
def Nabla_Framework_API(request, format=None):
    '''API web index
    '''
    return Response({
        'user':  reverse('user-detail'),
        'device':  reverse('device-list'),
        'component':  reverse('component-list'),
        'scope':  reverse('scope-list'),
        'view':  reverse('view-list'),
    })








class IsUser(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user


class ProfileSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    class Meta:
        model = Profile
        exclude = ['user']


class ProfileViewSet(viewsets.ModelViewSet):

        serializer_class = ProfileSerializer
        permission_classes = [IsUser]
        
        def get_queryset(self):
            return Profile.queryset_user( self.request.user )




profile_detail = ProfileViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'delete': 'destroy'
})

















class UserSerializer(serializers.ModelSerializer):
    ''' Only own model sets
    '''
    
    profile =          ProfileSerializer()
    #device_set =       Device.serializer()( many=True, read_only=True)
    #component_set =    Component.serializer()( many=True, read_only=True)
    #scope_set =        Scope.serializer()( many=True, read_only=True)
    #view_set =         View.serializer()( many=True, read_only=True)

    class Meta:
        model = User
        #fields = ['id', 'username', 'profile', 'device_set', 'view_set', 'component_set', 'scope_set']
        fields = ['id', 'username', 'profile']


class UserDetail(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user
        










class PropertySerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Property
        fields = ['name', 'value', 'type']





class PropertyCreateSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Property
        fields = ['scope', 'name', 'value', 'type']





class PropertyList(views.APIView): #ListCreateAPIView
    ''' Scope properties list and create
    '''
    renderer_classes = [JSONRenderer, BrowsableAPIRenderer]
    
    def get(self, request, *args, **kwargs):
        ''' Get property value
        '''
        scope_id = kwargs.get('scope', None)
        properties = Property.objects.filter(scope_id=scope_id)
        serializer = PropertySerializer(properties, many=True)
        return Response(serializer.data)


    def post(self, request, *args, **kwargs):
        data = request.data
        data['scope'] = kwargs.get('scope', None)
        
        serializer = PropertyCreateSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





class PropertyDetail(views.APIView): #RetrieveUpdateDestroyAPIView

    renderer_classes = [JSONRenderer, BrowsableAPIRenderer]
    
    def get_object(self, *args, **kwargs):
        scope_id = kwargs.get('scope', None)
        name = kwargs.get('name', None)

        qs = Property.objects.filter(scope_id=scope_id, name=name)
        if qs.count()==1: 
            return qs[0]
        raise Http404



    def get(self, request, *args, **kwargs):
        ''' Get property value
        '''
        p = self.get_object(*args, **kwargs)
        return Response({"value":p.value, "type":Property.Type(p.type).label})


    def put(self, request, *args, **kwargs):
        ''' Update property value
        '''
        p = self.get_object(*args, **kwargs)

        if not "value" in request.data.keys():
            return Response({'error': 'no value'})

        p.value = request.data["value"]
        p.save()
        return Response({"value":p.value, "type":Property.Type(p.type).label})


    def delete(self, request, *args, **kwargs):
        ''' New property NO
        '''
        p = self.get_object(*args, **kwargs)
        p.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



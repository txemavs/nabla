
import uuid
import json
import cssutils
import datetime
from django.http import HttpResponse, Http404
from django.template import RequestContext, loader
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from nabla.models import *

APOCALYPSE = "Sat, 18 Feb 2034 00:00:00 UTC"

class DeviceResponse(object):
    ''' Browser identification with cookie
    '''
    
    device=None

    def __init__(self, request):

        self.request = request
        self.cookie = request.COOKIES.get('device')
        self.response = HttpResponse()
        self.context = {}

        if self.cookie is not None:
            try:
                self.device = Device.objects.get(id=self.cookie)
            except:
                pass

        
        self.context['device']=self.device
        if self.device is None: self.context['token'] = uuid.uuid1()    


    def new_device(self):
        
        self.device = Device(
            name=datetime.datetime.now().strftime("%Y/%m/%d %H:%M:%S"),
            binding=True
            )

        if 'user-agent' in self.request.headers: self.device.browser = self.request.headers['user-agent']
        self.device.save()
        self.response.set_cookie('device', value=self.device.id, expires=APOCALYPSE)

    def render(self, template):

        self.response.write(
            loader.get_template(template).render(context=self.context, request=self.request)
        )
        return self.response


def control(request):
    ''' Remote Control Application
    '''
    response = DeviceResponse(request)
    scanned = request.session.get('scanned', False)
    if scanned:
        response.context['scanned']=scanned
    return response.render('nabla/control.html')


def control_scan(request, token_id):
    ''' Remote Control Application
    '''
    request.session['scanned'] = token_id
    response = DeviceResponse(request)
    response.context['scanned']=token_id
    return response.render('nabla/www.html' if request.user.is_anonymous else 'nabla/control.html')


def device(request):
    ''' Active View Page.
    '''
    response = DeviceResponse(request)
    return response.render('nabla/device.html')

    

def scope(request, view_id):
    ''' Get initial scope properties
    '''
    try:
        view = View.objects.get(id=view_id)
    except:
        raise Http404("Scope does not exist")
    

    props = Property.objects.filter(scope=view.scope)
    data = {
        'view':{'name':view.name},
        'scope':str(view.scope_id), 
        'property': {},
        'type': {},
         
    }
    for p in props:
        data['property'][p.name]=p.value
        data['type'][p.name]=Property.Type(p.type).label

    if view.component is not None:
        c = view.component
        data['component'] = {
            'name': c.name,
            'width': c.width,
            'height': c.height
        }

    return HttpResponse(json.dumps(data), content_type='application/json')



def component(request, view_id):
    ''' Returns the Vue component
    '''
    try:
        view = View.objects.get(id=view_id)
    except:
        raise Http404("View does not exist")

    component = view.component
    
    if component is None:
        html = ""
        css = None
        js = None
    else:
        html = component.template
        css = component.style
        js = component.script
    

    #add = "template, mixins: [mix], name:'view-%s'" % view.id
    add = "mixins: [def]"

    if js is None:
        js = "export default {%s}\n\n" % add
    else:
        if "export default {" in js:
            js = js.replace(
                "export default {",
                "export default {%s," % add
            )
        else:
            js += "export default {%s}\n\n" % add


    if css is not None:
        pre = ".view-"+str(view.id)+" "
        sheet = cssutils.parseString(css)
        for rule in sheet:
            if rule.type == rule.STYLE_RULE:
                rule.selectorText = pre + rule.selectorText
        css = sheet.cssText.decode("utf-8")

    code = loader.render_to_string('nabla/view.js',context={
        'view':view,
        'template': html,
        'script': js,
        'style': css,
        'scope': None if view.scope is None else ','.join(["'%s'" % p.name for p in view.scope.property_set.all()])
    })

    code = code.replace('$prop','$store.state.property')
    return HttpResponse(code, content_type='application/javascript')






def bind_channel(request, device_id):
    device = Device.objects.get(id=device_id)
    data = { 'device': str(device.id), 'channel': str(device.channel.id) }
    return HttpResponse(json.dumps(data), content_type='application/json')

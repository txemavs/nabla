from django.urls import path, re_path, include
from nabla import views

urlpatterns = [

    re_path(r'^(?P<view_id>.*).js$',                    views.component,            name="component"),
    re_path(r'^(?P<view_id>.*).json$',                  views.scope,                name="scope"),
    path('',                                            views.device,               name="device"),
    path('control/',                                    views.control,              name="control"),
    re_path(r'^control/(?P<token_id>[a-f0-9\-]+)$',     views.control_scan,         name="control_scan"),

    path('api/', include('nabla.api.urls')),

]


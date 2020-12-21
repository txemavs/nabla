from django.urls import path, re_path, include
from rest_framework import routers
from nabla import api
from nabla.models import *

router = routers.SimpleRouter()
router.register(r'device',      Device.viewset(),       basename='device')
router.register(r'component',   Component.viewset(),    basename='component')
router.register(r'scope',       Scope.viewset(),        basename='scope')
router.register(r'view',        View.viewset(),         basename='view')

urlpatterns = [
    path(r'',                                                       api.Nabla_Framework_API ),
    path(r'',                                                       include(router.urls)),
    path(r'user/',                                                  api.UserDetail.as_view(),           name='user-detail'),
    re_path(r'^profile/(?P<pk>[a-f0-9\-]+)/$',                      api.profile_detail,                 name='profile-detail'),
    re_path(r'^property/(?P<scope>[a-f0-9\-]+)/$',                  api.PropertyList.as_view(),         name='property-list'),
    re_path(r'^property/(?P<scope>[a-f0-9\-]+)/(?P<name>\w+)/$',    api.PropertyDetail.as_view(),       name='property-detail'),
    re_path(r'^.*/$',                                               api.no_data),
]


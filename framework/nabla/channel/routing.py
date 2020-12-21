from django.urls import re_path
from .consumer import NablaConsumer

websocket_urlpatterns = [
    re_path(r'channel/(?P<token>[a-f0-9\-]+)/$',            NablaConsumer),
]
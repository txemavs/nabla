from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


def send_group(group_name, message):
    channel_layer = get_channel_layer()
    return async_to_sync(channel_layer.group_send)(group_name, message)



def group_message(group_name, type_message, data):
    data.update({'type':'type__'+type_message})
    channel_layer = get_channel_layer()
    return async_to_sync(channel_layer.group_send)(group_name, data)


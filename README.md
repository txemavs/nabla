Nabla Framework
***************


This application is used to remotely control a set of web browsers.
It is used to create advertising, public or industrial information systems.

For example, you can deploy a set of Raspberry Pis in kiosk mode, 
all navigating to the same page, and once you bind them you can assign 
the content remotely.

This system uses websockets to push the changes to the devices, 
and it also supports interactive screens.

There is a server running this framework at nabla.net

Introduction
============

Devices
-------

When a browser navigates to the web for the first time, it enters bind mode: 
it shows a link and waits to be bound by a remote control.

Once you scan the QR with the app, the device is saved in the database
and and its identification token is stored in a cookie.

Now a view can be assigned to it.

Views
-----

The control app allows to assign and has a code editor to create views in place. 

The view can be a simple a piece of HTML, that`s enough.
But it can have javascript and css, and also can be connected to a 
synchronized variable namespace.

A view is the combination of two things: A component and a variable scope.

The component has three parts of code (it is a Vue component):
 - The template uses HTML5, Vue and Vuetify for the html markup
 - The script contains the JS code.
 - The style allows to use a scoped CSS sheet

The scope is a list of properties. They are reactive across all the views.

The devices load a Vue component with this information 
to compose the final view, extended with computed properties
for the syncronized reactive scope.

Basic URLs
----------

 - / The device page
 - /control/ The remote control applicarion
 - /admin/ Django administration
 - /api/ The REST API

Technology
----------

The backend is a Django 3.1 with DRF, Channels v2.4 and Allauth
The frontend uses Vue, Vuex and Vuetify.


Installation
============

Use docker to bring up all the services. See the makefile for details.





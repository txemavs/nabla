/**
 * Nabla Active Framework 
 * (c) 2020 Txema Vicente
 * Released under the MIT License.
 *
 * $bus
 * $nabla.emitter
 * $nabla.setter
 * handlers object
 * 
 * Methods:
 * objectNew(model)
 * objectCopy(model, object)
 * objectCreate(model, data)
 * objectRead(model, id)
 * objectUpdate(model, id, data)
 * objectDelete(model, id)
 * 
 */

import NTerminal from './ui/terminal.js';
import NScreen from './screen.js';

import { NTextField, NCheckbox, NSelect, NSelectObject } from './components/form.js';
import { NFill, NBtn, NTabs, NTab, NBtnConfirm } from './components/layout.js';



function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}


//Django REST API CSRF
axios.defaults.headers.common['X-CSRFToken'] = getCookie('csrftoken')




/**
 * Event bus
 * ----------------------------------------------------------------------------
 */

export const bus = new Vue({
  sock: null,
  data() { return {
    ts: new Date().getTime(),
    user: null,
    type: null,
    channel: null,
    device: getCookie('device'),
    connected: false
  }},
  computed: {
    websocket() {
      //let uuid = this.device.id;
      let p = [];
      if (!this.device) {
        //uuid = this.device.name;
        p.push('binding=1');
      }
      if (this.type) {p.push('type='+this.type)}
      return window.location.origin.replace('http','ws')+'/channel/'+this.channel+'/'+(p.length ? "?"+p.join('&'):"") 
    }
  },
  beforeCreate: function() {
    //this.ts = new Date().getTime()
    console.log("Global bus initializing", this.ts)
  },
  beforeDestroy: function() {
    // Useless?
    this.$off('channel:open', this.onChannelOpen);
    this.$off('channel:close', this.onChannelClose);
    this.$off('channel:message', this.onChannelMessage);
    console.log("Global bus destroyed")
  },

  methods: {

    log: (text)=> ( store.commit('print', text) ),

    channelConnect: function() {
      var self = this;
      this.sock = new WebSocket(this.websocket);
      this.sock.onopen = function(e) { self.$emit('channel:open', e); };
      this.sock.onclose = function(e) { self.$emit('channel:close', e); };
      this.sock.onmessage = function(e) { self.$emit('channel:message', e); };
    },

    onChannelOpen: function(e) {
      this.log("bus: Channel connected!");
      console.log("CONN",e)
      this.connected=true;
      this.$emit('connected');
    },

    onChannelClose: function(e) {
      this.log("err: Channel disconnected!");
      console.log(e)
      this.connected=false;
      this.$emit('disconnected');
      setTimeout(this.channelConnect, 10000)
    },
    
    onChannelMessage: function(e) {
      console.log("net: Received "+e.data);
      const data = JSON.parse(e.data);
      if (data.type=="log") {
        store.commit('print', data.stdout)
      }
      if (data.type=="property") {
        store.commit('property', data)
      }
      
      if (data.type=="device") {
        if (data.user) {
          this.log('bus: user id '+data.user)
          //this.user = data.user
        }
      }

      this.$emit('received', data);
    },

    connect: function() {
      console.log("bus: Connecting to "+this.websocket);
      this.$on('channel:open', this.onChannelOpen);
      this.$on('channel:close', this.onChannelClose);
      this.$on('channel:message', this.onChannelMessage);
      this.channelConnect();
    },


    send: function(obj) {
      this.sock.send(JSON.stringify(obj));
    },

    property: function(obj) {
      this.send({...obj, 'message':'property' });
    },

    set: function(name, value) {
      this.send({name, value, 'message':'property' });
    },

    scope_set: function(scope, name, value) {
      
      console.log("BUS SET "+name+"="+value)
      this.send({scope, name, value, 'message':'scope_property' });
    },

    status: function(status, obj={}) {
      this.send({...obj,'status':status, 'message':'DEVICE', 'id':this.device.id });
    },

  }

});





/**
 * Data
 * ----------------------------------------------------------------------------
 */


const store = new Vuex.Store({
  state: {
    stdout:'<b>Nabla Framework</b>\n&copy;2020 Txema Vicente \n\n',
    user: {},
    property: {},
    type: {},
    set: {},
  },

  getters: {
//    property: function(state) {
//      console.log("GET PROPERTY ")
//      return state.property[state.scope];
//    },

    property: (state) => (scope, property) => {

      return state.property[scope][property];
    },


    filter: (state) => (model, field, value) => {
      // Get object from the set objectRelation (model)
      return state.set[model].filter(obj => obj[field]==value);
    },

    object: (state) => (model, id) => {
      //Get object from the set
      var x = state.set[model].find(obj => obj.id === id)
      console.log('object'+ model+'.'+id+"="+x)
      return x


    },

    objectIndex: (state) => (model, id) => {
      //Get index of object from the set
      return state.set[model].findIndex(obj => obj.id === id)
    },

    setSorted: (state) => (model, sorted_by) => {
      console.log("SetSorted",state.set[model])
      var set=state.set[model];
      if (set.length==0) return [];
      function by( a, b ) {
        if (a[sorted_by]==b[sorted_by]) {return 0} 
        return (a[sorted_by]<b[sorted_by]) ? -1:1;
       }
      return _.clone(set).sort(by)
    }

  },

  mutations: {
    print (state, o) { 
      //Add a line to the text output
      state.stdout+=o+'\n';
      bus.$emit('stdout') 
    },
    
    setUser(state, data) { 
      // Load a new list of objects (after an api:get)
      console.log("USEEEEEEEEEEEEEEEEEER")
      console.log(data)
      state.user=data;   
    },

    scope(state, o) { 
      //Load a new property set (on scope changed)
      if (! state.property.hasOwnProperty(o.scope)) {
        bus.log("sto: add scope "+o.scope)
        Vue.set(state.property, o.scope, {})
        Vue.set(state.type, o.scope, {})
      }
      state.property[o.scope]=o.property;
      state.type[o.scope]=o.type;
      //state.scope = o.scope
      //state.property = state.scope[o.scope]
    },

    property(state, o) {
      //Change value 
      console.log("Mutating property "+o.scope+":"+o.name+"="+o.value)
      if (! state.property.hasOwnProperty(o.scope)) {
        console.log("Scope up "+o.scope)
        Vue.set(state.property, o.scope, {})
      }
      state.property[o.scope][o.name]=o.value;
    },

    setObjects(state, o) { 
      // Load a new list of objects (after an api:get)
      state.set[o.model]=o.data;   
    },

    setSort(state, o) {
      var field=o.field;
      function by( a, b ) {
        if (a[field]==b[field]) {return 0} 
        return (a[field]<b[field]) ? -1:1;
       }
      state.set[o.model].sort(by)
    },

    objectCreated(state, o) {
      // Add new object to model set
      state.set[o.model].push(o.data)
      this.commit('print', 'sto: created '+o.model+' '+o.id)
      bus.$emit('set.'+o.model+'.created', o)
    },

    objectUpdated(state, o) {
      var object = this.getters.object(o.model, o.id)
      if (!object) {
        this.commit('objectCreated', o);
        return;
      }
      var change = {};
      for(var field in o.data) {
        var value = o.data[field];          
        if (object[field]!=value) {
          //API MAGIC REACTION 
          object[field] = value;
          change[field] = value;
        }
      }
      this.commit('print', 'sto: updated '+o.model+' '+o.id)
      bus.$emit('set.'+o.model+'.updated', {model:o.model, id: o.id, data:change })  
    },

    objectDeleted(state, o) {
      // Update a list object and commit changes
      var i = this.getters.objectIndex(o.model, o.id);
      state.set[o.model].splice(i, 1);
      this.commit('print', 'sto: deleted '+o.model+' '+o.id)
      bus.$emit('set.'+o.model+'.deleted', o)
    },

  },

  actions: {

    initialize(context) {
      context.dispatch('getUser');
      context.dispatch('getSet', 'device');
      context.dispatch('getSet', 'component');
      context.dispatch('getSet', 'scope');
      context.dispatch('getSet', 'view');
    },

    getUser(context, o) {
      var self = this;
      axios.get('/api/user/').then(function (response) {
        console.log(response)
        context.commit('setUser', response.data );
      })
      .catch(function (error) {
        if (error.response.status === 403) {
          console.log('No user!');
          return;
        }
        console.log("ERROR USER")
        console.log(error);
        
      })
    },


    getSet(context, model) {
      //Read a objects list
      var self = this;
      console.log("Dispatching action get_set "+model)
      Vue.set(self.state.set, model, [])
      axios.get('/api/'+model+'/').then(function (response) {
        context.commit('setObjects', {model, data:response.data });
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {
        self.commit('print', 'api: got '+self.state.set[model].length+' '+model+' objects ')
      });
    },
    
    getObject(context, o) {
      var self = this;
      console.log("Dispatching action get_object "+o.model+' '+o.id)
      axios.get('/api/'+o.model+'/'+o.id+'/').then(function (response) {
        context.commit('objectUpdated', { model:o.model, id:o.id, data:response.data });
      })
      .catch(function (error) {
        self.commit('print', 'err: api/'+o.model+'/'+o.id+'/')
        console.log(error);
      })
    },

    receivedObject(context, data) {
      //Django saved or deleted a object
      //TODO: send the object directly instead of GET
      if (data.hasOwnProperty('saved')) {
        context.dispatch('getObject', {model:data.model, id:data.saved} )
      } else if (data.hasOwnProperty('deleted')) {
        context.commit('objectDeleted', {model:data.model, id:data.deleted }); 
      } else {
        console.log("store error")
      }

    }

  },

})






/**
 * Global plugin
 * ----------------------------------------------------------------------------
 */

class Nabla {
 /**
  * Provides the global $bus access
  * 
  * Injects:
  *  handlers:Components can register handlers
  * 
  * 
  * 
  */
  constructor() {
    console.log("Nabla Active Framework") 

  }

  install(Vue, options) {


    var self = this;
    Vue.prototype.$bus = bus;

    Vue.prototype.$nabla = {
    
      //Device ID cookie
      //device: self.device,

      emitter: function(...args) { 
        //A helper for directives
        return ()=>( bus.$emit(...args) )
      },

      setter: function(name, value) { 
        //Function to set global scope property value
        //return ()=>( bus.set(name, value) )  
        return function(){ 
          bus.log("set: "+name+"="+value);
          bus.set(name, value);
        }
      }

    }

    //Available custom components
    Vue.component('n-terminal', NTerminal)
    Vue.component('n-screen', NScreen)
    Vue.component('n-fill', NFill)
    Vue.component('n-tabs', NTabs)
    Vue.component('n-tab', NTab)
    Vue.component('n-text-field', NTextField)
    Vue.component('n-checkbox', NCheckbox)
    Vue.component('n-select', NSelect)
    Vue.component('n-select-object', NSelectObject)
    Vue.component('n-btn', NBtn)
    Vue.component('n-btn-confirm', NBtnConfirm)

    
    
    


    Vue.mixin({

      methods: {
        
        objectNew(model) {
          this.objectCreate(model, {name:'*'+model+' '+new Date().getTime()});
        },

        objectCopy(model, object) {
          var copy = _.clone(object)
          delete copy.id;
          delete copy.owner;
          delete copy.created_by;
          copy.name+=" (Copy)";
          console.log(copy)
          this.objectCreate(model, copy);
        },
        
        objectCreate(model, data) {
          // API POST

          axios.post("/api/"+model+"/", data).then(function (response) {
            console.log(response)
            if (response.status==201) {
              bus.log("api: create "+model+".id="+response.data.id);
              bus.$emit('obj.'+model+'.created', response.data);
            } else {
              bus.log("api: Create failed ("+response.status+")");
              console.log(response);
            }
          }).catch(function (error) { console.log(error); })

        },
        
        objectRead(model, id) {
          // API GET

          axios.get("/api/"+model+"/"+id+"/").then(function (response) {
            console.log(response)
            if (response.status==200) {
              bus.log("api: Read "+model+" "+id)
            }
          }).catch(function (error) {
            console.log(error);
          })
          
        },
        
        objectUpdate(model, id, data) {
          // API UPDATE

          axios.put("/api/"+model+"/"+id+"/", data).then(function (response) {
            console.log(response)
            if (response.status==200) {
              bus.log("api: update "+model+" "+response.data.id);
              bus.$emit('obj.'+model+'.updated', response);
            
            } else {
              bus.log("api: update "+model+" failed ("+response.statusText+")");
              console.log(response);
            }
          }).catch(function (error) {
            console.log(error);
          })

        },
        
        objectDelete(model, id) {
          // API DELETE
          axios.delete("/api/"+model+"/"+id+"/").then(function (response) {
            console.log(response)
            if (response.status==204) {
              bus.log("api: delete "+model+" "+id)
              bus.$emit('obj.'+model+'.deleted', {id});
            }
          }).catch(function (error) {
            console.log(error);
          })
          
        },



        //Save an object and send message
        //create_model(model, data) { this.$store.commit('create',{model, data}) },
      
        //Save an object and send message (store->API->ws->store)
        save_model(model, id, data) { this.$store.commit('object',{model, id, data}) },
        
      },
      created: function () {

        //Check handlers option
        if(this.$options.handlers){
          var that=this;
          var tag = that.$vnode.componentOptions.tag;
          that.$handlers = [];
          //console.log("Nabla.create", tag, that._uid);

          Object.keys(that.$options.handlers).forEach(method => {
            const event = that.$options.handlers[method];
            const handler = function() { 
              if (event!="stdout") {
                bus.log('evt: "'+event+'" -> '+tag+'.'+method+'('+JSON.stringify(Array.prototype.slice.call(arguments))+')');
              }
              that.$options.methods[method].apply(that, arguments)
            }
            that.$handlers.push({event, handler});
            bus.$on(event, handler );
            //console.log("Handler on "+event+" "+method)
          });
        }
      },

      beforeDestroy(){
        if(! this.$options.handlers){return}
        var that=this;
        if(this.$handlers){
          this.$handlers.forEach(on => {
            bus.$off(on.event, on.handler)
          });
        }
      }
    })

    
    Vue.directive('sync', {
      bind (el, binding, vnode, oldVnode) {
        console.log(binding)
      }
    })
  



  }
}


if (typeof window !== 'undefined' && window.Vue) {
  const nabla = new Nabla();
  window.Vue.use(nabla)
}








/**
 * App mixin
 * ----------------------------------------------------------------------------
 */

const vuetify = new Vuetify({ theme: { dark: true } });

const framework = {
  delimiters: ['[[', ']]'],
  vuetify,
  store,
  el: '#nabla',
  data: function () {
    return {
      dt:0,
      time:null,
      timer: null,
      screen: null,
      fullscreen: false,
      fullscreen_el: "main"
    }
  },

  watch: {
    fullscreen: function(value) {
      var elem = document.getElementById(this.fullscreen_el); 
      if (value) {
        if (document.fullscreenElement==elem) {return};
        if (elem.requestFullscreen) { elem.requestFullscreen();} 
        else if (elem.webkitRequestFullscreen) {elem.webkitRequestFullscreen();} 
        else if (elem.msRequestFullscreen) { elem.msRequestFullscreen();}  
      } else {
        if (!document.fullscreenElement) {return};
        document.exitFullscreen();
      }
    }
  },

  mounted: function() {
    var self=this;
    this.timer = setInterval(this.tick, 1000);
    document.getElementById(this.fullscreen_el).addEventListener('fullscreenchange', (event) => {
      self.fullscreen = Boolean(document.fullscreenElement) 
    });
    bus.$on("fullscreen", (value)=>{self.fullscreen = (value==undefined) ? !self.fullscreen : value });

  },

  beforeDestroy: function() {
    clearInterval(this.timer);
  },
  
  methods: {
    
    print: function(o) { this.$store.commit('print', o); },
    
    log(text) {this.$bus.log(text)},

    identificate(cookie) {
      console.log("SETTING COOKIE device="+cookie)
      document.cookie= "device="+cookie+"; expires=Sat, 18 Feb 2034 00:00:00 UTC"
      bus.log("app: device cookie set")
    },

    tick: function() {
      let local = new Date();
      this.time = new Date(local.getTime()+this.dt/1000.0);
    },

    awaken: function(name, value) {
      if ('wakeLock' in navigator) {
        var lock = navigator.wakeLock.request('screen')
        bus.log("app: Wake lock requested", lock)
      }
    },

  }
}

export default framework;



/**
 * Nabla Active Framework 
 * (c) 2020 Txema Vicente
 * Released under the MIT License.
 * 
 * REMOTE CONTROL APP
 */  

import framework from '/static/nabla/framework.js'
import Navmenu from '/static/nabla/ui/menu.js';
import Devices from './ui/devices.js';
import Views from './ui/views.js';



export default {

  mixins: [framework],
  


  components:{
    Navmenu, Devices, Views
  },

  data: function () {
    return {
      page: 'Nabla Link',
      title: 'Remote Control',
      seo: null,
      nav: true,
      view: null,
      own: false,
      
      screen: null,
      show: {
        terminal: false,
        devices: false,
        screen: false,
        views: false,
      },
    }
  },
  
  watch: {
    user: {
      deep: true,
      handler(is, was) {
        if (is.id) {
          this.dark = Boolean(is.profile.dark)
          this.own = Boolean(is.profile.own)
          console.log("OOOOOOOOOOOOOOOOOOOOOOO", this.own)
        }
      }
    }
  },
  
  computed: {
    user() {
      return this.$store.state.user;
    },
    dark: {
      get() {
        return this.$vuetify.theme.dark;
      },
      set(value) {
        this.$vuetify.theme.dark = value
        if (this.user.id) this.objectUpdate('profile', this.user.id, {dark:value});
      }
    },

    my_view() {
      console.log("MY ", this.$store.state.set.device) 
      if (!this.$bus.device) return null;
      if (!this.$store.state.set.device) return null;
      let me = this.$store.getters.object('device', this.$bus.device );
      if (!me) return null
      console.log("MY ",me)
      console.log("MY ",me.view)
      return me.view ? me.view : null
    },

    subtitle() {
      return this.user.username;
    },

    view_count() {
      return this.$store.state.set.view ? this.$store.state.set.view.length : 0;
    },
    device_count() {
      return this.$store.state.set.device ? this.$store.state.set.device.length : 0;
    },
    menu() {
      return [
        {icon:'mdi-eye-outline', text:'Views', show:'views', tab: 0 },    
        {icon:'mdi-monitor-multiple', text:'Devices', show:'devices', tab: 0 },
        {icon:'mdi-qrcode-scan', text:'Add device', go:'nabla/ui/qr/scan' },
        {icon:'mdi-account-cog', text:'Configuration', go:'ui/config' },
      ]
    }
  },

  methods: {
    
    mount_home: function() {
      const home = document.getElementById('home');
      this.seo =  Vue.component("page",{template:"<div class='home'>"+home.innerHTML+"</div>"})
      home.innerHTML="";
      this.home();
    },

    home: function() {
      this.screen=this.seo
    },

    go_show: function(show) { 
      this.screen=null;
      for (const s in this.show) { this.show[s]=(s==show) }
    },

    on_menu_item: function(item) { 
      if (item.show) {  
        this.go_show(item.show);
      //  if (item.hasOwnProperty('tab')) {
      //    if (this.$refs[item.show]) this.$refs[item.show].set_tab(item.tab);
      //  }
      }
      if (item.screen) this.screen = item.screen; 
      if (item.go) this.go(item.go, item.text);

    },
    
    go: function(js, title) {
      //this.show.views = false;
      for (const s in this.show) { this.show[s]=false }
      this.$bus.log("app: go "+js)
      if (title) this.page=title;
      this.screen = Vue.component(js.replace(/\//g, '_') ,() => import("/static/app/"+js+".js?"+this.$bus.ts));      
    },


    bind_device: function(url) {
      //Function to bind a device to this control
      var last = url.split("nabla.link/").pop()
      var token = last.split("?")[0]
      //var user_id = store.state.user.is_anonymous ? 0 : store.state.user.id;

      this.$bus.log("Binding token "+token)
      this.$bus.send({message:'bind', token });
    },

    received(data) {
      var self = this;
      app.status='Updated '+(new Date()).toLocaleString();

      //bus.log("app: received "+data.type)

      switch (data.type) {
        
        case 'object':
          this.$store.dispatch('receivedObject', data)
          break;

        case "device":
          if (data.identificate) {
            this.$bus.log("app: control identification "+data.identificate)
            this.identificate(data.identificate)
          }
          break;
        
        default:
          //bus.log("app: received "+data.type+" unhandled")
          console.log("warning: unhandled mensagge:",data)
      }
    },

    view_updated(data) {
      if (!data) return;   
      if (this.view && this.view.id!=data.id) return
      //var view = this.$store.getters.object('view', this.view.id)
      var preview = this.$refs['preview'];
      preview.load(this.view.id)
    },
    component_updated(data) {
      if (this.view && this.view.component!=data.id) return
      this.view_updated(this.view);
    },
    scope_updated(data) {
      if (this.view && this.view.scope!=data.id) return
      this.view_updated(this.view);
    }
    
  },
  mounted() {
    var self = this;
    var bus = this.$bus;
    
    //this.$vuetify.theme.dark = false
    this.$vuetify.breakpoint.mobileBreakpoint=960;
    this.mount_home()
    bus.log("Nabla Link Remote Control v0.0.1")
    bus.$on("menu:visible", (nav)=>(self.nav = nav));
    bus.$on("menu:item", self.on_menu_item );
    bus.$on("received", self.received);
    bus.$on('qr:scanned', self.bind_device)
    bus.$on('set.view.updated', self.view_updated)
    bus.$on('set.component.updated', self.component_updated)
    bus.$on('set.scope.updated', self.scope_updated)
    

    this.$store.dispatch('initialize')
    document.body.style.backgroundImage="none";
    
    
    
    bus.type="control";
    bus.$on("connected", function(data) {
      bus.send({"message":"CONTROL", "status":"ONLINE"})
      bus.log("PING SENT")
    })
    bus.connect();
    bus.log("bus: Control "+ bus.device)
  },

}
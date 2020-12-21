/**
 * Nabla Active Framework 
 * (c) 2020 Txema Vicente
 * Released under the MIT License.
 */  


import {items_own} from '/static/nabla/components/base.js';
import DeviceEdit from './device/edit.js';
import DeviceTable from './device/table.js';


const tabs = `
<template v-slot:top>
  <v-toolbar color="transparent" class="pl-0 pr-0" dense flat>
    <n-tabs v-model="tab" class="pr-0 pl-0">
      <v-tab class="bg-hard"><v-icon>mdi-monitor-multiple</v-icon></v-tab>
      <v-tab class="bg-soft"><v-icon left>mdi-monitor</v-icon>DEVICE</v-tab>
      <v-tab class="bg-blue"><v-icon left>mdi-monitor-eye</v-icon>SET</v-tab>
    </n-tabs>
  </v-toolbar>
</template>
`;


const toolbar=`
<template v-slot:header>
  <div v-if="tab<2">
    <v-toolbar color="transparent" flat>
      <v-select outline class="pt-4 pr-4 pl-0" return-object v-model="device" placeholder="Select device" item-text="name" :items="devices">${items_own}</v-select>
      <n-btn v-if="device" @click.native="device=null" icon="mdi-layers-triple">ALL</n-btn>
      <n-btn v-else @click.native="$root.go('nabla/ui/qr/scan')" icon="mdi-qrcode-scan" :disabled="!$root.user.id">ADD</n-btn>
    </v-toolbar>
  </div>
</template>
`

const mosaic=`
<v-container class='pt-0 pb-0'>
  <v-row>
    <v-col v-for="d in devices" :key="d.id"  cols="6" xs="6" sm="4" md="3" lg="2" xl="2">
      
        <v-card @click.native="device_select(d.id)" :class="(device && d.id==device.id)?'selected':''">
          <v-toolbar color="transparent" dense>
            <a><v-card-text class="pr-2 pl-2 pt-1 pb-1">{{d.name}}</v-card-text></a>
          </v-toolbar>
          <v-theme-provider dark>
            <v-responsive :aspect-ratio="16/9">
              <div class='preview'>
                
                <n-screen :ref="'device-'+d.id" :view_id='device_view_id(d)' scale ></n-screen>
                
              </div>
            </v-responsive>
          </v-theme-provider>
        </v-card>
      
    </v-col>
  </v-row>
</v-container>
`


export default {
  name: "devices",
  components: { DeviceEdit, DeviceTable },
  template: `
  <n-fill v-on="$listeners" :header="(tab==1)?'bg-soft':''">
    ${tabs}
    ${toolbar}  
    <n-fill  v-show="tab==0" v-on="$listeners" class="bg-hard">${mosaic}</n-fill>
    <device-edit :device="device" v-show="tab==1" />
    <device-table v-show="tab==2" />
  </n-fill>
  `,


  data: function () {
    return {
      tab:0,
      device: null, 
    }
  },

  watch: {
    view(is, was) {
      
      if (this.tab==0 && is) this.tab=1;
      if (this.tab==1 && !is) this.tab=0;
      if (!is) return
      this.$root.page = "View - "+is.name;
      this.$root.view = is;
    }
  },
  computed: {
    ...Vuex.mapGetters(['object','setSorted']),
    
    devices() { return this.setSorted('device', 'name') },

    views() { return this.setSorted('view', 'name') },


  },

  methods: {
    
    device_view_id(device) {
      if (!device) return null;
      if (!device.view) return null;
      return this.object('view', device.view).id
    },
  
    device_select(device_id) {
//      this.$root.page='View'

      console.log("device_select "+device_id)
      this.device=(device_id) ? this.object('device', device_id ) : null
      if (this.tab==0 && this.device) this.tab=1;

    },

    view_created(data) {
      console.log("BUS VIEW CREATED")
    },

    view_deleted(data) {
      console.log("BUS VIEW DELETED", data)
    },

    view_updated(data) {
      console.log("SHOULD REFRESH")
      var preview = this.$refs['preview-'+data.id];
      console.log(preview)
      if (preview.length) {
        //preview[0].load(null)
        preview[0].load(data.id)
      }
    },
    component_updated(data) {
      console.log("SHOULD REFRESH CCCCCCCCCCCCCCCC")
      var self=this;
      this.$store.getters.filter('view', 'component', data.id).forEach( function(view) {
        self.view_updated(view)
      })
    },
    scope_updated(data) {
      console.log("SHOULD REFRESH CCCCCCCCCCCCCCCC")
      var self=this;
      this.$store.getters.filter('view', 'scope', data.id).forEach( function(view) {
        self.view_updated(view)
      })
    }
  },

  handlers: { // See Nabla plugin

    //view_select: 'view_select',
    //view_deleted: 'set.view.deleted',
    //view_updated: 'set.view.updated',
    //view_created: 'set.view.created',

    //scope_updated: 'set.scope.updated',
    //component_updated: 'set.component.updated',

  },
  
  mounted(){
    this.$root.page='Devices'
  }
}


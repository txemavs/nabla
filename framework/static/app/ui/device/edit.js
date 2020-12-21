/**
 * Nabla Active Framework 
 * (c) 2020 Txema Vicente
 * Released under the MIT License.
 */              




const DeviceEdit = {
  name: "device-control",

  template: `
    <v-container>
      <v-row>
        <v-col cols="12" >
          <n-text-field :value="device" label="Name" model='device' field='name' prepend-icon="mdi-square-edit-outline"></n-text-field>
          <n-checkbox :value="device"  model='device' field='binding' label="Binding"></n-checkbox>
          <n-checkbox :value="device"  model='device' field='scale' label="Scale"></n-checkbox>
          
        </v-col>

      </v-row>
    </v-container>
`,
  props: ['device'],
}  




const select_view = `
  <n-fill v-if="device" v-show="tab==0" header="bg-form">
    <template v-slot:header>
      <v-container class="pt-0 pb-0" >
        <v-row>
          <v-col cols="12" class="pt-0 pb-0">
            <n-select :value="device" model="device" field="view" :items="views" prepend-icon="mdi-eye" @change='on_change_view' />
          </v-col>
        </v-row>
      </v-container>
    </template>
    <n-screen :view_id='view_id' scale></n-screen>
  </n-fill>
`;



export default {
  name: "device-select",
  template: `

  <n-fill content="bg-form" header="bg-soft">
    <template v-slot:header>
      <v-tabs v-model="tab" background-color="transparent">
        <v-tabs-slider color="blue lighten-3"></v-tabs-slider>    
        <v-tab class="bg-form">VIEW</v-tab>
        <v-tab class="bg-form">EDIT</v-tab>
      </v-tabs>
    </template>
    ${select_view}
    <device-edit v-if="device" v-show="tab==1" :device="device" @change_view="on_change_view"></device-edit>
  </n-fill>
  
  `,
  components: {Screen, DeviceEdit}, 

  props: {
    device: {type:Object}
  },

  data: function () {
    return {
      view_id: null,
      tab: null,
     }
  },

  computed: {
    ...Vuex.mapGetters(['setSorted']),

    devices() {
      console.log("DEVICES")
      return this.setSorted('device', 'name')
    },
    views() {
      console.log("VIEWS--------")
      return this.setSorted('view', 'name')
    },
    
  },

  watch: {
    device: function(device) {
      console.log("WATCH DEVICE", device)
      this.on_change_view(device.view)
    }
  },

  mounted: function() {
    if(this.device) {
      this.view_id = device.view.id;
    }
  },

  methods: {

    on_change_view(value) {
      this.view_id = value;
      this.$emit('change_view', value)
    }

  },


}

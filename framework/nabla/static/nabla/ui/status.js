/**
 * Nabla Active Framework 
 * (c) 2020 Txema Vicente
 * Released under the MIT License.
 */

const StatusBtn = {
  name: "status-btn",
  props: ['btn'],
  template: `
    <v-btn icon small class="pa-0 ma-0" @click.stop="btn.click"><v-icon size="16px">{{ btn.icon }}</v-icon></v-btn>
  `,
}  



export default {
  name: "status",
  components:{ StatusBtn},
  template: `
  <v-footer v-if="!fullscreen" app>
    <v-row justify="center" align="center">
      <v-col class="pa-0">
        <span id="status"> {{status}} </span>
      </v-col>
      <v-col class="pa-0 text-right">
        <status-btn v-for="btn in buttons" :key="btn.icon" :btn="btn"></status-btn>  
      </v-col>
    </v-row>
  </v-footer>
  `,
  props: ['status', 'fullscreen'],

  data() { return {
    buttons: [      
      {icon:'mdi-vuetify',            click:this.$nabla.setter("bg", "https://i1.wp.com/blog.logrocket.com/wp-content/uploads/2019/09/Vue-stateless-components-nocdn.png")},
      {icon:'mdi-emoticon-happy',     click:this.$nabla.setter("bg", "https://cyberpunkcity.store/wp-content/uploads/2019/04/wallpaper-cyberpunk-2.jpg")},
      {icon:'mdi-console-line',       click:this.$nabla.emitter("show:terminal")},
      {icon:'mdi-monitor-cellphone',  click:this.$nabla.emitter("show:qrcode", true)},
      {icon:'mdi-movie',              click:this.$nabla.emitter("awaken")},
      {icon:'mdi-fullscreen',         click:this.$nabla.emitter("fullscreen")}, 
    ]
  }},
  computed: {
    ...Vuex.mapState(['prop'])
  },


  mounted: function() {
    console.log("sb mounted")
    
  },
  beforeDestroy: function() {
    
  },

}

console.log("System bar loaded")
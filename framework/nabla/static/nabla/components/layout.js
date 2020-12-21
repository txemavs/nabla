/**
 * Nabla Active Framework 
 * (c) 2020 Txema Vicente
 * Released under the MIT License.
 */

//"color:#fff;background-color:#000020"
export const NFill = {
  //Text field that commits changes
  name: "n-fill",
  props:{
    top: { type: String },
    //class: { type: String },
    header: { type: String },
    content: { type: String },
    footer: { type: String },
  },
  template: `
  <div class="flex-container">
    <div class="flex-height">
      <div class="flex-fix" :class="top" v-if="$slots['top']" >
        <slot name="top" />
      </div>  
      <div class="flex-fix" :class="header" v-if="$slots['header']">
        <slot name="header" />
      </div>  
      <div class="flex-grow" :class="content">
        <slot />
      </div>
      <div class="flex-fix" :class="footer" v-if="$slots['footer']" >
        <slot name="footer" />
      </div>  
    </div>        
  </div>
`
}  


export const NBtn1 = {
  name:'n-btn',
  template: `<v-btn icon v-bind="$attrs" v-on="$listeners"><v-icon><slot /></v-icon></v-btn>`, 
}

export const NBtn = {
  name:'n-btn',
  template: `
    <v-btn v-if="$vuetify.breakpoint.mobile" icon v-bind="$attrs" v-on="$listeners"><v-icon>{{icon}}</v-icon></v-btn>
    <v-btn v-else text v-bind="$attrs" v-on="$listeners"><v-icon left>{{icon}}</v-icon><slot /></v-btn>
  `, 
  props: {
    icon: { type: String, default:'mdi-square' },
  }
}






export const NTabs = {
  name:'n-tabs',
  template: `<v-tabs v-bind="$attrs" v-model="value2" background-color="transparent" show-arrows hide-slider></v-icon><slot /></v-tabs>`, 
  props: ['value'],
  computed: {
    value2: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      }
    }
  }
}


export const NTab = {
  name:'n-tab',
  template: `<v-tab><v-icon left>{{icon}}</v-icon><slot /></v-tab>`, 
  props:{
    icon: { type: String, default:'mdi-blank' },
  },

}







export const NBtnConfirm1 = {
  name:'n-btn-confirm',
  template: `
    <v-dialog v-model="modal" persistent max-width="290">
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on" icon><v-icon><slot /><v-btn>
      </template>
      <v-card>
        <v-card-title class="headline">
          {{ title }}
        </v-card-title>
        <v-card-text>
          {{ text }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" @click="cancel" text>Cancel</v-btn>
          <v-btn color="green" text @click="accept">Accept</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-btn>
  `, 
  props:{
    title: { type: String, default:'Are you sure?' },
    text: { type: String, default:'' },
    
  },
  data() {
    return {
      modal:false
    }
  },

  methods: {

    cancel() {
      this.modal=false;
      this.$emit('cancel')
    },
    accept() {
      this.modal=false;
      this.$emit('accept')
    }
  
  }

}

export const NBtnConfirm = {
  name:'n-btn-confirm',
  template: `
    <n-btn v-bind="$attrs" @click.stop="modal=true" :icon="icon"><slot /></-icon>
      <v-dialog v-model="modal" persistent max-width="290">
        <v-card>
          <v-card-title class="headline">
            {{ title }}
          </v-card-title>
          <v-card-text>
            {{ text }}
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" @click.stop="cancel" text>Cancel</v-btn>
            <v-btn color="green" text @click.stop="accept">Accept</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </n-btn>
  `, 
  props:{
    title: { type: String, default:'Are you sure?' },
    text: { type: String, default:'' },
    icon: { type: String, default:'mdi-alert-circle' },
    
  },
  data() {
    return {
      modal:false
    }
  },

  methods: {

    cancel() {
      this.modal=false;
      this.$emit('cancel')
    },
    accept() {
      this.modal=false;
      this.$emit('accept')
    }
  
  }

}
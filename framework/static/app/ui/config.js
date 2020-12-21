
/**
 * Nabla Active Framework 
 * (c) 2020 Txema Vicente
 * Released under the MIT License.
 */  

const tabs = `
<v-toolbar color="transparent" class="pl-0 pr-2" dense flat>
  <n-tabs v-model="tab" class="pr-4 pl-0" grow>
    <v-tab class="bg-form" :v-show="view"><v-icon left>mdi-account</v-icon>USER</v-tab>
    <v-tab><v-icon left>mdi-card-account-details</v-icon>PROFILE</v-tab>
  </n-tabs>
</v-toolbar>
`;



const toolbar = `
<v-toolbar color="transparent" flat>
<v-spacer></v-spacer>
<v-btn text href="/accounts/logout/">LOGOUT</v-btn>
</v-toolbar>
`;

const form = `
<v-checkbox label="Show only own views" v-model="$root.user.profile.own" />
`;

export default {
  name: "account",
  components: {},
  template: `
  <n-fill v-on="$listeners" :header="(tab==0)?'bg-hard':''">
    <template v-slot:top>
      ${tabs}
    </template>
    
    <n-fill v-show="tab==0" class='bg-form'>
      <template v-slot:header>${toolbar}</template>
      <v-container class="pb-0">
        <v-row>
          <v-col cols="12">${form}</v-col>
        </v-row>
      </v-container>
    </n-fill>

    
  </n-fill>
  `,

  data: function () {
    return {
      tab:0,
      view: null,
      mode: 'mosaic',
     
    }
  },

  watch: {

  },
  computed: {
    ...Vuex.mapGetters(['object','setSorted']),
    views() {
      return this.setSorted('view', 'name')
    },
    profile() {
      return this.$root.user.profile
    }

  },

  methods: {

  },


  
  mounted(){

  }
}


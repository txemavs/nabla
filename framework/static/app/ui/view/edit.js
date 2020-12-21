import {NNameDialog, items_own} from '/static/nabla/components/base.js';
import ComponentEdit from '../component/edit.js';
import ScopeEdit from '../scope/edit.js';


export const ComponentCreate = {
  name:'component-create',
  extends: NNameDialog,
 
  data: function() {
    return {
      label: 'CREATE',
      title: 'NEW PAGE',
      icon: 'mdi-plus',
      name: null,
    //  disabled: !this.$root.user.id
    }
  },
  methods: {
    accept() {
      this.objectCreate('component', {name:this.name});
    }
  }
}

export const ScopeCreate = {
  name:'scope-create',
  extends: NNameDialog,
 
  data: function() {
    return {
      label: 'CREATE',
      title: 'NEW SCOPE',
      icon: 'mdi-database-plus',
      name: null,
    //  disabled: !this.$root.user.id
    }
  },
  methods: {
    accept() {
      this.objectCreate('scope', {name:this.name});
    }
  }
}

const tabs = `
<n-tabs v-model="tab" class="pr-4 pl-4">
  <n-tab class="bg-form" icon="mdi-eye-settings-outline">EDIT</n-tab>
  <n-tab class="bg-blue" icon="mdi-movie-outline">PAGE</n-tab>
  <n-tab class="bg-brown" icon="mdi-database-outline">DATA</n-tab>   
</n-tabs>
`;

const toolbar = `
<v-toolbar color="transparent" flat>
  <v-spacer></v-spacer>
  <div>
    <n-btn-confirm @accept="view_delete" text="This view will be deleted forever" :disabled="((!own)||(device_count>0))" icon="mdi-eye-remove">DELETE</n-btn-confirm>
    <n-btn @click.native="view_copy" icon="mdi-content-copy" :disabled='!$root.user.id'>COPY</n-btn>
    
    </div>
</v-toolbar>
`;

const form = `
<n-text-field label="Name" :value="view" model='view' field='name' prepend-icon="mdi-square-edit-outline" :disabled="!own" />
<n-select label="View component" :value="view" model="view" field="component" :items="components" prepend-icon="mdi-movie-edit" :disabled="!own" @change="on_change" />
<n-select label="Variable scope" :value="view" model="view" field="scope" :items="scopes" prepend-icon="mdi-database-edit" :disabled="!own" @change="on_change" />  
<n-checkbox label="Public" v-if="own" :value="view" model="view" field="public" />
`;

const preview = `
<v-card>
  <v-responsive :aspect-ratio="16/9">
    <n-screen scale ref="preview" :view_id='view_id' />
  </v-responsive>
</v-card>
`;

const footer = `
<v-footer dark> 
  <v-tooltip top>
    <template v-slot:activator="{ on, attrs }">
      <span v-bind="attrs" v-on="on">
        <span v-if='view.public'>Public view</span> 
        <span v-else>Private view</span> 
        <span>&nbsp;by {{view.owner}}</span>
      </span>
    </template>
    <span>{{view.id}}</span>
  </v-tooltip>
  <v-spacer/>
</v-footer>
`;




const components = `
<v-toolbar color="transparent" flat>
  <n-select outline class="pt-4 pr-4" :value="view" model="view" field="component" :items="components" :disabled="!own" @change="on_change">
    ${items_own}
  </n-select>
  <!--v-btn icon @click.native='on_click_new_component' ><v-icon>mdi-plus</v-icon></v-btn-->
  <component-create :disabled="!$root.user.id" />
</v-toolbar>
`;






const scopes = `
<v-toolbar color="transparent" flat>
  <n-select outline class="pt-4 pr-4" :value="view" model="view" field="scope" :items="scopes" :disabled="!own" @change="on_change">
    ${items_own}
  </n-select>
  <scope-create :disabled="!$root.user.id" />
</v-toolbar>
`;



export default {
  name: "view-edit",
  components: { Screen, ComponentCreate, ComponentEdit, ScopeCreate, ScopeEdit },
  template: `
  <n-fill header="bg-soft" content="bg-form">
    <template v-slot:top><slot /></template>
  
    <template v-slot:header>${tabs}</template>
    <n-fill v-show="tab==0">
      <template v-slot:header>${toolbar}</template>
      <v-container v-if="view" class="pt-0 pb-0">
        <v-row>
          <v-col cols="12" md="6">${form}</v-col>
          <v-col cols="12" md="6">${preview}</v-col>
        </v-row>
      </v-container>
      <template v-slot:footer>${footer}</template>
    </n-fill>

    <component-edit v-show="tab==1" :component="component">
      <template v-slot:top>
        ${components}
      </template>
    </component-edit>

    <scope-edit v-show="tab==2" :scope="scope">
      <template v-slot:top>
        ${scopes}
      </template>
    </scope-edit>

  </n-fill>
  `,

  props:{
    view: { type: Object },
  },


  data: function () {
    return {
      del_dialog:false,
      tab: 0,
    }
  },

  watch: {

    view: function(view) {
      this.$refs.preview.load(this.view_id)
    },

  },

  computed: {
    ...Vuex.mapGetters(['setSorted', 'object']),
    
    own() {
      return this.view.created_by == this.$root.user.id;
    },

    view_id() {
      if (!this.view) {return null}
      return this.view.id
    },

    components() {
      return this.setSorted('component', 'name')
    },
    component() {
      if (this.view==null) {return null;}
      var item = this.object('component', this.view.component )
      console.log("***view.edit.computed.component ",item)
      return item
    },
    scopes() {
      return this.setSorted('scope', 'name')
    },
    scope() {
      if (this.view==null) {return null;}
      return this.object('scope', this.view.scope )
    },

    device_count() {
      return this.$store.getters.filter('device', 'view', this.view_id).length
    },
  },

  methods: {

    on_change() {
      this.$refs.preview.load(this.view_id)
    },


    on_click_new_component() {
      this.objectNew('component');
    },

    on_click_new_scope() {
      this.objectNew('scope');
    },

    view_copy() {
      this.objectCopy('view', this.view);
    },

    view_delete() {
      this.objectDelete('view', this.view.id);
      this.$bus.$emit('view_select', null)
      console.log("edit.delete")
    },

  }



}

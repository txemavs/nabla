/**
 * Nabla Active Framework 
 * (c) 2020 Txema Vicente
 * Released under the MIT License.
 */  


import {NNameDialog, items_own} from '/static/nabla/components/base.js';
import ViewEdit from './view/edit.js';
import ViewTable from './view/table.js';

export const ViewCreate = {
  name:'view-create',
  extends: NNameDialog,
 
  data: function() {
    return {
      label: 'NEW',
      title: 'NEW VIEW',
      icon: 'mdi-eye-plus',
      name: null,
    //  disabled: !this.$root.user.id
    }
  },
  methods: {
    accept() {
      this.objectCreate('view', {name:this.name});
    }
  }
}


const tabs = `
<template v-slot:top>
  <v-toolbar color="transparent" class="pl-0 pr-0" dense flat>
    <n-tabs v-model="tab" class="pr-0 pl-0">
      <v-tab class="bg-hard"><v-icon>mdi-view-grid</v-icon></v-tab>
      <v-tab class="bg-soft" :v-show="view"><v-icon left>mdi-eye</v-icon>VIEW</v-tab>
      <v-tab class="bg-red"><v-icon left>mdi-view-list</v-icon>LIST</v-tab>
    </n-tabs>
  </v-toolbar>
</template>
`;


const toolbar=`
<template v-slot:header>
  <div v-if="tab<2">
    <v-toolbar color="transparent" flat>
      <v-select outline class="pt-4 pr-4 pl-0" return-object v-model="view" placeholder="Select view" item-text="name" :items="views">${items_own}</v-select>
      <n-btn v-if="view" @click.native="view=null" icon="mdi-layers-triple">EXIT</n-btn>
      <view-create v-if="!view" :disabled="!$root.user.id" />
    </v-toolbar>
  </div>
</template>
`

const mosaic=`
<v-container class='pt-0 pb-0'>
  <v-row>
    <v-col v-for="v in views" :key="v.id"  cols="6" xs="6" sm="4" md="3" lg="2" xl="2">
      
        <v-card @click.native="view_select(v.id)" :class="(view && v.id==view.id)?'selected':''">
          <v-toolbar color="transparent" dense>
            <a><v-card-text class="pr-2 pl-2 pt-1 pb-1">{{v.name}}</v-card-text></a>
          </v-toolbar>
          <v-theme-provider dark>
            <v-responsive :aspect-ratio="16/9">
              <div class='preview'>
                
                <n-screen :ref="'preview-'+v.id" :view_id='v.id' scale ></n-screen>
                
              </div>
            </v-responsive>
          </v-theme-provider>
        </v-card>
      
    </v-col>
  </v-row>
</v-container>
`


export default {
  name: "view-editor",
  components: { ViewCreate, ViewEdit, ViewTable },
  template: `
  <n-fill v-on="$listeners" :header="(tab==0)?'bg-hard':'bg-soft'"><!--VIEWS-->
    ${tabs}
    ${toolbar}  
    <n-fill v-show="tab==0" v-on="$listeners" class="bg-hard">${mosaic}</n-fill>
    <view-edit v-show="tab==1" v-if="view" :view="view"></view-edit>     
    <view-table v-show="tab==2"></view-table>
  </n-fill><!--/VIEWS-->
  `,
  template2: `


  `,
  props: {
    tab_set: { type:Number }
  },

  data: function () {
    return {
      tab:0,
      view: null, 
    }
  },

  watch: {
    tab_set(value) {
      this.tab=value
      this.tab_set=null
    },
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
    views() {
      var items = this.setSorted('view', 'name');
      if (this.$root.own) return items.filter(obj => obj.created_by==this.$root.user.id)
      return items
    },

  },

  methods: {
    set_tab(tab) {
      this.tab=tab
    },
    on_click_grid() {
      this.panel = ViewMosaic,
      this.view=null
    },
    on_click_table() {
      this.panel = ViewTable,
      this.view=null
    },
    on_click_new() {
      this.objectNew('view');
    },

    view_select(view_id) {
//      this.$root.page='View'

      console.log("view_select "+view_id)
      this.view=(view_id) ? this.object('view', view_id ) : null
      console.log("view_select ",this.view)
      if (this.tab==0 && this.view) this.tab=1;

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

    view_select: 'view_select',
    view_deleted: 'set.view.deleted',
    view_updated: 'set.view.updated',
    view_created: 'set.view.created',

    scope_updated: 'set.scope.updated',
    component_updated: 'set.component.updated',

    //view_created_local: 'obj.view.created'
  },
  
  mounted(){
    this.$root.page='Views'
  }
}



import {NNameDialog} from '/static/nabla/components/base.js';

export const PropertyCreate = {
  name:'property-create',
  extends: NNameDialog,
 

  data: function() {
    return {
      label: 'NEW',
      title: 'NEW PROPERTY',
      icon: 'mdi-plus-circle',
      name: null,
    }
  },
  methods: {
    accept() {
      this.$emit('accept',this.name);
    }
  }
}


const PROPERTY_ICON = {
  'String':'mdi-circle-outline',
  'Number':'mdi-numeric-1-circle-outline',
  'Boolean':'mdi-circle-half-full',
  'Object':'mdi-code-braces-box',
  'Array':'mdi-code-array',
  
}



const tabs = `
<v-tabs v-if="scope" class="pl-4 pr-4 tabs-form" v-model="tab" background-color="transparent" show-arrows>
  <n-tab icon="mdi-database-edit-outline">EDIT</n-tab>
  <n-tab icon="mdi-database-sync-outline">PROPERTIES</n-tab>
</v-tabs>

`;

const toolbar = `
<v-toolbar color="transparent" flat>
<v-spacer></v-spacer>
<div>
  <n-btn @click.native="store_del" icon="mdi-database-remove" :disabled="!own">DELETE</n-btn>
  <n-btn @click.native="store_copy" icon="mdi-content-copy" :disabled='!$root.user.id'>COPY</n-btn>
</div>
</v-toolbar>
`;

const form = `
<template >
  <template v-if="own">
    <n-text-field :value="scope" model="scope" field="name" label="Name" prepend-icon="mdi-square-edit-outline" />
    <n-checkbox  v-show="own" :value="scope" model="scope" field="public" label="Public"/>
  </template>
  <template v-else>
    <n-text-field v-show="!own" :value="scope" model="scope" field="owner" label="Owner" prepend-icon="mdi-account" disabled />
  </template>
</template>
`;

const footer = `
<v-footer v-if="scope" dark> 
  <v-tooltip top>
    <template v-slot:activator="{ on, attrs }">
      <span v-bind="attrs" v-on="on">
        <span v-if='scope.public'>Public scope</span> 
        <span v-else>Private scope</span> 
        <span>&nbsp;by {{scope.owner}}</span>
      </span>
    </template>
    <span>{{scope.id}}</span>
  </v-tooltip>
  <v-spacer/>
</v-footer>
`;

const properties_toolbar = `
<v-toolbar color="transparent" flat>
<v-spacer></v-spacer>
<div>
  <property-create :disabled="!$root.user.id || !own" @accept="property_create" />

</div>
</v-toolbar>
`;
const properties = `
<v-container class="pb-0">
  <v-row v-for="name in properties" :key="name">
    <v-text-field :disabled="!own" :value="property_get(name)" @change="property_set(name, arguments[0])" :label="name" :prepend-icon="property_icon(name)" />
  </v-row>
</v-container>
`;

export default {
  name: "scope-edit",
  components: {PropertyCreate},
  template: `
  <n-fill header="bg-brown">
    <template v-slot:header>
      <slot name="top" />
      ${tabs}
    </template>
    

    <n-fill v-show="tab==0" v-if="scope">
      <template v-slot:header>${toolbar}</template>
      <v-container class="pb-0">
        <v-row>
          <v-col cols="12">${form}</v-col>
        </v-row>
      </v-container>
        
    </n-fill>
  
    <n-fill v-show="tab==1" v-if="scope">
      <template v-slot:header>${properties_toolbar}</template>
      <v-container class="pb-0">
        <v-row>
          <v-col cols="12">${properties}</v-col>
        </v-row>
      </v-container>

    </n-fill>
    <template v-slot:footer>${footer}</template>
  </n-fill>
  `,

  props:{
    scope: { type: Object, default:null },
  },

  computed: {
    properties: function() {
      return Object.keys(this.$store.state.property[this.scope.id]) 
    },
    own() {
      return this.scope.created_by == this.$root.user.id;
    },
  },

  data: function () {
    return {
      tab: 0,     
    }
  },

  watch: {

    scope: function(scope) {
      console.log("scope.edit.watch.component", scope)
      //this.load()
    },

  },

  methods: {
    property_get: function(name) {
      return this.$store.state.property[this.scope.id][name];
    },

    type_get: function(name) {
      return this.$store.state.type[this.scope.id][name];
    },

    property_icon: function(name) {
      return PROPERTY_ICON[this.type_get(name)];
    },

    property_set: function(name, value) {
      console.log("Property set -------------------------"+name, value)
      this.$bus.scope_set(this.scope.id, name, value);
    },


    copy() {
      this.objectCopy('scope', this.scope);
    },

    del() {
      this.objectDelete('scope', this.scope.id);
      this.scope=null;
    },
    
    property_create(name) {
      console.log(name)
      
      axios.post("/api/property/"+this.scope.id+"/", {name}).then(function (response) {
        console.log(response)
        if (response.status==201) {
          this.$bus.log("api: create property "+name+" in scope "+response.data.scope);
        } else {
          this.$bus.log("api: Create failed ("+response.status+")");
          console.log(response);
        }
      }).catch(function (error) { console.log(error); })


    }
  },

}

console.log("Scope editor loaded")

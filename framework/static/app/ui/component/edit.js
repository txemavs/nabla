import Codemirror from '/static/nabla/components/codemirror.js'


//v-model:tab and value bug


const tabs = `
<v-tabs v-if="component" class="pl-4 pr-4 tabs-form" v-model="tab" background-color="transparent" show-arrows>
  <v-tab>EDIT</v-tab>
  <v-tab>HTML</v-tab>
  <v-tab>CSS</v-tab>
  <v-tab>JS</v-tab>  
</v-tabs>
`;

const toolbar = `
<v-toolbar color="transparent" flat>
<v-spacer></v-spacer>
<div>
  <n-btn @click.native="del" icon='mdi-delete-forever' :disabled="!own">DELETE</n-btn>
  <n-btn @click.native="copy" icon='mdi-content-copy' :disabled='!$root.user.id'>COPY</n-btn>
</div>
</v-toolbar>
`;

const form = `
<template v-if="own">
  <n-text-field :value="component" model="component" field="name" label="Name" prepend-icon="mdi-movie-edit-outline" />
  <n-checkbox  v-show="own" :value="component" model="component" field="public" label="Public"/>
  <n-text-field type="number" :value="component" model="component" field="width" label="Width" prepend-icon="mdi-square-edit-outline" />
  <n-text-field type="number" :value="component" model="component" field="height" label="Height" prepend-icon="mdi-square-edit-outline" />
</template>
<template v-else>
  <n-text-field v-show="!own" :value="component" model="component" field="owner" label="Owner" prepend-icon="mdi-account" disabled />
</template>
`;

const footer = `
<v-footer dark>
  <v-tooltip top>
    <template v-slot:activator="{ on, attrs }">
      <span v-bind="attrs" v-on="on">
        <span v-if='component.public'>Public component</span> 
        <span v-else>Private component</span> 
        <span>&nbsp;by {{component.owner}}</span>
      </span>
    </template>
    <span>{{component.id}}</span>
  </v-tooltip>
  <v-spacer/>
</v-footer>
`;


export default {
  name: "component-edit",
  components: { Codemirror },
  template: `
  <n-fill header="bg-blue">
    <template v-slot:header>
      <slot name="top" />
      ${tabs}
    </template>

    <n-fill v-if="component" v-show="tab==0">
      <template v-slot:header>${toolbar}</template>
      <v-container v-if="component" class="pb-0">
        <v-row>
          <v-col cols="12">${form}</v-col>
        </v-row>
      </v-container>
      <template v-if="component" v-slot:footer>${footer}</template>  
    </n-fill>

      
    <div v-if="component" v-show="tab==1" class="codemirror-wrap"  theme='vibrant-ink'>
      <codemirror icon="mdi-iframe-outline" title="TEMPLATE" ref="template" :load="template" :locked="!own" :start='start.template' @on_save="templateSave" mode='htmlmixed' />
    </div>

    <div v-if="component" v-show="tab==2" class="codemirror-wrap">
      <codemirror icon="mdi-iframe-braces-outline" title="STYLE" ref="style" :load="style" :locked="!own" :start='start.style'  @on_save="styleSave" mode='css' />
    </div>

    <div v-if="component" v-show="tab==3" class="codemirror-wrap">
      <codemirror icon="mdi-iframe-variable-outline" title="SCRIPT" ref="script" :load="script" :locked="!own" :start='start.script' @on_save="scriptSave" mode='javascript' line-numbers />
    </div>
    
  </n-fill>
  `,

  props:{
    component: { type: Object, default:null },
  },

  data: function () {
    return {
      own: false,
      tab: 0,
      tabs: [null, 'template', 'style', 'script'],
      template: "", style: "", script: "",
      start: {
        template: false, style: false, script: false,
      },
    }
  },

  watch: {

    component: function(component) {
      this.load()
    },

    tab: function(x) {
      var sel = this.tabs[x];
      if (sel) { this.$refs[sel].refresh(); this.start[sel] = true }
    },
  },

  methods: {
    
    load() {
      if (this.component) {
        this.own = this.component.created_by == this.$root.user.id;
        this.template = html_beautify(this.component.template, { indent_size: 2, space_in_empty_paren: true });
        this.script =     js_beautify(this.component.script, { indent_size: 2, space_in_empty_paren: true });
        this.style =     css_beautify(this.component.style, { indent_size: 2, space_in_empty_paren: true });
      } else {
        this.own = false;
        this.template = "";
        this.script = "";
        this.style = "";
      }
    },
    
    templateSave(code) { this.objectUpdate('component', this.component.id, {template: code}); },
    scriptSave(code)   { this.objectUpdate('component', this.component.id, {script: code}); },
    styleSave(code)    { this.objectUpdate('component', this.component.id, {style: code}); },

    copy() {
      this.objectCopy('component', this.component);
    },

    del() {
      this.objectDelete('component', this.component.id);
      this.component=null;
    },
    


  },

  beforeDestroy: function() {
    console.log("component.edit.destroy")
    //this.load()
  },

  mounted: function() {
    console.log("component.edit.mounted")
    this.load()
  }

}

console.log("Component editor loaded")

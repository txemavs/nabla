/**
 * Nabla Active Framework 
 * (c) 2020 Txema Vicente
 * Released under the MIT License.
 * 

 */

const item_public_owner=`
<span v-if="data.item.created_by==$root.user.id">{{ data.item.name }} <span v-if="data.item.public" class="public">(public)</span></span>
<span v-else>{{ data.item.name }} <span class="owner">({{data.item.owner}})</span></span>
`

export const items_own=`
<template v-slot:selection="data">${item_public_owner}</template>
<template v-slot:item="data">${item_public_owner}</template>
`


export const NNameDialog = Vue.component('n-name-dialog', {
  template: `
    <v-dialog v-model="modal" persistent max-width="290px">
      <template v-slot:activator="{ on, attrs }">
        <n-btn v-bind="attrs" v-on="on" :icon="icon" :disabled="disabled">{{label}}</n-btn>
      </template>
      <v-card>
        <v-card-title><v-icon left>{{icon}}</v-icon> {{title}}</v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field label="Name" v-model="name" v-on:keyup.enter="on_accept" required></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="red" @click="modal = false">Cancel</v-btn>
          <v-btn text color="green" @click="on_accept">Create</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  `,
  props: {
    disabled: {type:Boolean}
  },
  
  data: function() {
    return {
      icon:'mdi-alert-circle',
      title:'No title',
      label:'LABEL',
      //disabled:false,
      modal:false,
      name:null,
    }
  },
  methods: {
    accept() {
      console.log('Not implemented')
    },
    on_accept() {
      this.modal = false;
      this.accept()
    }
  }

})





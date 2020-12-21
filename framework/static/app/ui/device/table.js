/**
 * Nabla Active Framework 
 * (c) 2020 Txema Vicente
 * Released under the MIT License.
 */


const item_public_owner=`
<span v-if="data.item.created_by==$root.user.id">{{ data.item.name }} <span v-if="data.item.public" class="public">*</span></span>
<span v-else>{{ data.item.name }} <span class="owner">*</span></span>
`

export const items_own=`
<template v-slot:selection="data">${item_public_owner}</template>
<template v-slot:item="data">${item_public_owner}</template>
`



const toolbar = `
<v-toolbar color="transparent" flat>
  <v-spacer></v-spacer>
</v-toolbar>
`;

const table = `
<v-simple-table>
  <template v-slot:default>
    <thead class="bg-blue">
      <tr>
        <th class="text-left"><v-icon left>mdi-monitor</v-icon> Device</th>
        <th class="text-left"><v-icon left>mdi-eye</v-icon> View</th> 
      </tr>
    </thead>
    <tbody>
      <tr v-for="d in devices" :key="d.id"> 
        <td>
          <n-text-field dense solo flat hide-details placeholder="No name?" :value="d" model='device' field='name' />
        </td>
        <td>
          <n-select solo flat dense hide-details placeholder="None" :value="d" model="device" field="view" :items="views">
            ${items_own}
          </n-select>
        </td>
      </tr>
    </tbody>
  </template>
</v-simple-table>
`;

export default {
  name: "device-table",
  template: `
  <n-fill header="bg-blue">
    <template v-slot:header>${toolbar}</template>
    ${table}
  </n-fill>
  `,

  data: function () {
    return {
      view: null,
  
      }
  },

  computed: {
    ...Vuex.mapGetters(['object','setSorted']),
    devices() {
      return this.setSorted('device', 'name')
    },
    views() {
      return this.setSorted('view', 'name')
    },
    
  },

}


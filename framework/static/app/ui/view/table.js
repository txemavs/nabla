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
    <thead class="bg-red">
      <tr>
        <th class="text-center"><v-icon>mdi-monitor-multiple</v-icon> </th>
        <th class="text-left"><v-icon left>mdi-eye-outline</v-icon> View</th>
        <th class="text-left"><v-icon left>mdi-movie-outline</v-icon> Component</th>
        <th class="text-left"><v-icon left>mdi-database-outline</v-icon> Scope</th>
        <th class="text-left">Owner</th>
       
      </tr>
    </thead>
    <tbody>
      <tr v-for="view in views" :key="view.id">
        <td class="text-center">
        <span :class="view.public?'public':''">
          <span :class="view.created_by!=$root.user.id?'owner':''">
        
            {{ device_count(view.id) || '-' }}
          </span>
        </span>
        </td>
        
        
        <td>
        
          <n-text-field dense solo flat hide-details placeholder="No name?" :value="view" model='view' field='name' :disabled="view.created_by!=$root.user.id" />


        </td>
        <td>
          <n-select solo flat dense hide-details placeholder="None" :value="view" model="view" field="component" :items="components" :disabled="view.created_by!=$root.user.id" >
            ${items_own}
          </n-select>
        </td>
        <td>
          <n-select solo flat dense hide-details placeholder="None" :value="view" model="view" field="scope" :items="scopes" :disabled="view.created_by!=$root.user.id">
            ${items_own}
          </n-select>
        </td>
        <td>{{ (view.created_by!=$root.user.id) ? view.owner:'' }}</td>

        
      </tr>
    </tbody>
  </template>
</v-simple-table>
`;

export default {
  name: "view-table",
  components: {  },
  template: `
  <n-fill header="bg-red">
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
    views() {
      return this.setSorted('view', 'name')
    },
    components() {
      return this.setSorted('component', 'name')
    },
    scopes() {
      return this.setSorted('scope', 'name')
    },
  },

  methods: {
    device_count(view_id) {
      return this.$store.getters.filter('device', 'view', view_id).length
    },
  
  }
}


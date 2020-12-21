/**
 * Nabla Active Framework 
 * (c) 2020 Txema Vicente
 * Released under the MIT License.
 */

import table from '/static/nabla/mixins/table.js';


const form = {
  name: "detail-device",
  template: `
    <v-card v-if="item">
      <v-card-title>
        Device {{ item.id }}
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field v-model="item.name" name="name" label="Name" prepend-icon="mdi-square-edit-outline"></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-select v-model="item.view" item-value="id" item-text="name" :items="views" prepend-icon="mdi-eye" @change="on_view_change" />
            </v-col>
            <v-col cols="12" md="4">
              <v-checkbox v-model="item.binding" name="binding" label="Binding"></v-checkbox>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
    <v-card v-else>
      <v-card-title>
        Select Device
      </v-card-title>
    </v-card>
  `,

  props: ['item'],

  computed: {
    views () {
      return this.$store.state.views
    },
  },

  methods: {
    on_view_change(view_id) {
      this.$bus.$emit('api:put', {'model':'device','pk': this.item.id, data:{'view':view_id} })
    }
  },

  no_watch: {
    item: {
      handler () {
        console.log("FORM WATCH",this.item)
      },
      deep: true,
    },
  },
}  







export default {

  name:"table-device",

  mixins: [table],

  data: function () {
    return {
      title: "Device List",
      api: 'device',
      detail: form
    }
  },

  computed: {
    headers () {
      return [
        {
          text: 'Device',
          align: 'start',
          sortable: false,
          value: 'id',
        },
        {
          text: 'Name',
          value: 'name',
        },
        { text: 'View', value: 'view' },
      ]
    },
  },
  
  methods: {
    on_click_row(e) {
      this.selected = e;
    }
  },

}
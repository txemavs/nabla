/**
 * Nabla Active Framework 
 * (c) 2020 Txema Vicente
 * Released under the MIT License.
 */


export const NTextField = {
  //Text field that commits changes
  name: "n-text-field",
  props: ['value', 'model', 'field'],
  template: `
    <v-text-field 
      :value="value[field]" 
      @change="on_change"
      v-bind="$attrs"
    ></v-text-field>`,
  methods: {
    on_change(value) {
      //this.save_model(this.model, this.value.id, {[this.field]: value});
      this.objectUpdate(this.model, this.value.id, {[this.field]: value});

    },
  },
}  


export const NCheckbox = {
  //Checkbox that commits changes :value="get_value(value)"  true-value="true" false-value="false" 
  name: "n-select",
  template: `
    <v-checkbox
      :input-value="value[field]" 
      @change="on_change"
      
      v-bind="$attrs"
    ></v-checkbox>`,
    
  props:{
    value: { type: Object },
    model: { type: String },
    field: { type: String },
  },
  
  mounted: function() {
    console.log("NCheckbox "+this.model+"."+this.field, this.value)
  },

  methods: {
    get_value() {
      var value = this.value[this.field]
      console.log(this.value, value);
      return value
    },

    on_change(value) {
      console.log(value)
      this.objectUpdate(this.model, this.value.id, {[this.field]: value});
      this.$emit('change', value)
    },
  },
}  





export const NSelect = {
  //Select widget that commits changes
  name: "n-select",
  template: `
    <v-select
      :value="value[field]" 
      @change="on_change"
      :items="items"
      :itemValue="itemValue"
      :itemText="itemText"
      v-bind="$attrs"
    >
    <slot v-for="(_, name) in $slots" :name="name" :slot="name" />
    <template v-for="(_, name) in $scopedSlots" :slot="name" slot-scope="slotData"><slot :name="name" v-bind="slotData" /></template>
    </v-select>
  `,
    
  props:{
    value: { type: Object },
    model: { type: String},
    field: { type: String},
    items: { type: Array },
    itemValue: { type: String, default: 'id'},
    itemText: { type: String, default: 'name'},
  },
  
  methods: {
    on_change(value) {
      this.objectUpdate(this.model, this.value.id, {[this.field]: value});
      this.$emit('change', value)
    },
  },
}  


export const NSelectObject = {
  //Select widget that commits changes and returns object
  name: "n-select-object",
  template: `
    <v-select
      return-object
      :value="get_value(value)" 
      @change="on_change"
      :items="items"
      :itemText="itemText"
      v-bind="$attrs"
    ></v-select>`,
    
  props:{
    value: { type: Object },
    model: { type: String},
    field: { type: String},
    items: { type: Array },
    itemValue: { type: String, default: 'id'},
    itemText: { type: String, default: 'name'},
  },

  methods: {
    get_value(value) {
      if (!value) {
        console.log("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF");
        return null
      }
      var object = this.$store.getters.object(this.field, value[this.field] )
      return object[this.itemText]
    },
    on_change(value) {
      this.objectUpdate(this.model, this.value.id, {[this.field]: value[this.itemValue]});
      this.$emit('change', value)
    },
  },
}  











export const NTextField1 = {
  name: "n-text-field",
  props: ['value', 'model', 'field'],
  template: `
    <v-text-field 
      :value="value[field]" 
      @input="on_input" 
      @change="on_change(model, field, arguments[0])"
      v-bind="$attrs"
    ></v-text-field>`,
  methods: {
    on_input(value) {
      this.input_value = value
    },
    on_change(model, field, value) {
      var data = {};
      data[field]=value;
      this.save_model(model, this.value.id, data);
    },
  },
  data() {
    return {
      input_value:null
    }
  }
}  
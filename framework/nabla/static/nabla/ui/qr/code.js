/**
 * Nabla Active Framework 
 * (c) 2020 Txema Vicente
 * Released under the MIT License.
 */

import qrcode from '/static/js/qrcode.js';

export default {
  name: "qrcode-modal",
  template: `
    <v-row justify="center">
      <v-dialog v-model="show" persistent max-width="320" light >
        <v-card>
        <v-card-title class="headline justify-center">{{title}}</v-card-title>
        <div id="qr"></div>
        <v-card-actions  class=" justify-center">
         <v-btn :href="data" target="_rc" text block>control link</v-btn>
        </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  `,

  methods: {
    create_qr: function() {
      console.log("create QR")
      var el = document.getElementById('qr')
      if (!el) {return}
      const qr = new qrcode(0, 'H');
      qr.addData(this.data);
      qr.make();
      el.innerHTML = qr.createSvgTag({});  
    }
  },
  
  updated() {
    console.log("updated "+ this.data)
    if (this.value) { this.$nextTick(this.create_qr) }
  },
  mounted: function() {
    console.log("mounted "+ this.data)
    //if (this.value) { this.create_qr() }
  },
  props: { 
    value: Boolean, 
    title: {type:String, default:"SCAN TO BIND"}, 
    data: String 
  }, 

  computed: {
    show: {
      get () { 
        console.log("show "+this.value);
        return this.value},
      set (value) { this.$emit('input', value) }
    }
  }
}
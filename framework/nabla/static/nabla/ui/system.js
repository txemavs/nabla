/**
 * Nabla Active Framework 
 * (c) 2020 Txema Vicente
 * Released under the MIT License.
 */

export default {
  name: "systembar",
  template: `
  <v-system-bar>
    <span>{{title}}</span>
    <v-spacer></v-spacer>
    <span :style="style">
      <v-icon v-if="$bus.connected">mdi-link-variant</v-icon><v-icon v-else>mdi-link-variant-off</v-icon>
    </span>
    <span>{{clock}}</span>
  </v-system-bar>
  `,
  props: ['title', 'time'],
  watch: {
    time: function(value) {
      this.dots = (this.dots==":") ? " ":":";
      this.clock = value.toLocaleTimeString().split(":",2).join(this.dots);
    }
  },
  computed: {
    ...Vuex.mapState(['prop', 'status']),
    style() {
      return {
        color : (this.$bus.connected) ? 'white' : 'red',
      };
    },
  },
  data: function () {
    return {
      clock:"00:00",
      dots:":",
    }
  },
}

console.log("System bar loaded")
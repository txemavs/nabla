/**
 * Nabla Active Framework 
 * (c) 2020 Txema Vicente
 * Released under the MIT License.

          <v-list-item-avatar rounded=0>
            <img src="/static/vue/assets/nabla.png">
          </v-list-item-avatar>

 */

const MenuItem = {
  name: "menu-item",
  props: ['item'],
  template: `
    <v-list-item link @click.native="click">
      <v-list-item-icon v-if='item.badge'>
          <v-badge overlap :content="item.badge">
            <v-icon>{{item.icon}}</v-icon>
          </v-badge>
        </v-list-item-icon>

        <v-list-item-icon v-else>
          <v-icon>{{item.icon}}</v-icon>
        </v-list-item-icon>
      
      <v-list-item-content><v-list-item-title>{{item.text}}</v-list-item-title></v-list-item-content>
    </v-list-item>
  `,
  methods: {
    click: function(item) {
      this.$emit('click', this.item)
    }
  },
}  

export default {
    name: "navmenu",
    components:{
      MenuItem
    },
    props: ['title', 'subtitle', 'nav', 'menu'],
    data: function() { return { visible:true }},
    watch: {
      visible: function(is, was) {this.$bus.$emit('menu:visible', this.visible )},
      nav: function(is, was) {this.visible = is;}
    },
    
    //computed: {...Vuex.mapState(['menu'])},
    
    template: `
      <v-navigation-drawer v-model="visible" clipped app>

        <v-list-item>

          <v-list-item-content>
            <v-list-item-title class="title">{{title}}</v-list-item-title>
            <v-list-item-subtitle>{{subtitle}}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        
        <v-divider></v-divider>
        <slot></slot>
        <v-divider></v-divider>
        
        <v-list dense nav>
          <menu-item v-for="item in menu" :key="item.id" :item="item" @click="click"></menu-item>  
        </v-list>


        <template v-slot:append>
          <slot name="footer" />
        </template>
        
      </v-navigation-drawer> 
    `,

    methods: {
      click: function(item) {
        if (this.$vuetify.breakpoint.mobile) { this.visible = false;}
        this.$bus.$emit("menu:item", item)
      }

    },
 
  }
  

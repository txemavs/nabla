/**
 * Nabla Active Framework 
 * (c) 2020 Txema Vicente
 * Released under the MIT License.
 */

export default {
  name: "n-screen",
  template: `
  <div ref='rescale' class='rescale'>
    <div ref='screen' :class="'screen view-'+view_id">
      <!--SCREEN-->
      <component v-bind:is="screen"></component>
    </div>
  </div>  
  `,
  computed: {
    ...Vuex.mapState(['property']),
    width () {
      if (this.component && this.component.width) { return this.component.width; }
      return 1920
    },
    height () {
      if (this.component && this.component.height) { return this.component.height; }
      return 1080
    }
  },
  props:{
    view_id: { type: String, default:null },
    scale: { type: Boolean }
  },
  data: function () {
    return {
      screen: null,
      component:null,
      ro:null
    }
  },

  mounted: function () {
    this.load(this.view_id)
    
    
  },

  watch:{
    view_id: function(view_id) {
      console.log("--------------------VIEW", view_id)
      this.load(view_id)
    },
    scale: function(v) {
      console.log("--------------------SCALE", v)
      this.set_scale()
    }
  },

  handlers:{
    load:'screen:view'
  },

  methods: {
    load: function(view_id) {
      console.log("SCREEN.LOAD", view_id)
      //if (!view_id) {
      //  this.screen = null;
      //  console.log("NO")
      //  return
      //}

      var self = this;
      const ts=(new Date()).getTime();
      this.$bus.view = view_id;
      if (!view_id) { self.screen=null; return}
      const url = window.location.origin+'/'+view_id;
      fetch(url+'.json?ts='+ts, { headers: { "Content-Type": "application/json" }})
        .then(res => res.json()) 
        .then(function(data) {
          if (data.component) { self.component = data.component; }
          self.$store.commit('scope', data)
          console.log("Load component: "+url+'.js');
          try {
            var loaded = Vue.component('screen-'+view_id,() => import(url+'.js?ts='+ts));
            self.screen = loaded  
          } catch (e) {
            console.log("SCREEN ERROR:"+url);
            console.log(e); // pasar el objeto exception al controlador de errores (es decir, su propia función)
          }
          self.$bus.log("scr: composed "+view_id);
        })
        .catch(err => {
          self.$bus.log("err: composing "+view_id);
          console.log(err)
      }).then(function() {
        if (self.scale) (self.set_scale())
      });
    
    },

    set_scale() {

      if (!this.scale) {
        if (this.ro) this.ro.disconnect()
        this.noscale()
        return
      }

      var self=this;
      var rescale = this.$refs.rescale;
      var wrapper = rescale.parentNode;
      var full = document.getElementById('fullscreen');
      if (full) { wrapper=full }
      var aw = wrapper.offsetWidth
      var ah = wrapper.offsetHeight
      this.rescale(aw,ah)
      this.ro = new ResizeObserver(entries => {
        for (let entry of entries) {
          const cr = entry.contentRect;
          self.rescale(cr.width, cr.height)
        }
      });      
      this.ro.observe(wrapper);    
    },
    reload: function(view_id) {
      this.load(this.view)
    },

    rescale(cw,ch) {
      var screen = this.$refs.screen;
      if (!screen) {return}
      var rescale = this.$refs.rescale;
      var w = this.width;
      var h = this.height;
      screen.style.width = w+'px'
      screen.style.height = h+'px'
      screen.style.transform = 'scale('+cw/parseFloat(w)+','+ch/parseFloat(h)+')'
      rescale.style.width = cw+'px'
      rescale.style.height = ch+'px'
    },

    noscale() {
      var screen = this.$refs.screen;
      if (!screen) {return}
      var rescale = this.$refs.rescale;
      screen.style.width = '100%'
      screen.style.height = '100%'
      screen.style.transform = 'scale(1,1)'
      rescale.style.width = '100%'
      rescale.style.height = '100%'
    }
  },
}


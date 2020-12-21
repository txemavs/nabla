/**
 * Nabla Active Framework 
 * (c) 2020 Txema Vicente
 * Released under the MIT License.
 */

const LOG_COLOR = {
  app: "#ddd",
  bus: "#0f0",
  sto: "#f0f",
  err: "#f44",
  scr: "#ff0",
  evt: "#999",
  api: "#f80",
  net: "#0ff",
}



export default {
    name: "terminal",
    template: `
      <div id="console_win" style = "height:100%; overflow-y:auto;">
        <pre id="console"><div v-html="highlighted"></div><input @keyup.enter="enter" @blur="blur" id="stdin"></pre>
      </div>
    `,
    props: ['show'],
    data: function () {
      return {
        input:"",
        last:"",
        updating: false,
        html:"",
        pos:0,
      }
    },
    watch: {
      show(visible) { if(visible) { this.focus() }},
      input(is, was) {
        this.last=was; 
      },
      
    },
    computed: {
      highlighted: function() {
        if (!this.$store) {return}
        //return this.$store.state.stdout;
        var line = "";    
        var n=0;
        while (( n = this.$store.state.stdout.indexOf('\n', this.pos)) !== -1) {
          line =  this.$store.state.stdout.substring(this.pos, n);
          let pre = line.split(":")[0];
          let color = LOG_COLOR.hasOwnProperty(pre) ? LOG_COLOR[pre] : "#f0f0f0";

          this.html+='<span style="color:'+color+'">'+line+'</span>\n'
          this.pos = n + 1;
        }
        this.focus();
        return this.html;

      }
    },

    handlers: {
      onUpdate: 'stdout'
    },

    methods: {

      log: function(o) { store.commit('print', o); },
      
      focus: function() { 
        var stdin=document.getElementById("stdin");
        if (stdin) {stdin.focus();}
      },

      blur: function() { 
        if(document.activeElement==document.body) {this.focus()};
      },

      enter: function(e) {
        var cmd = e.target.value;
        this.input = cmd;
        e.target.value = ""

        this.$bus.log(cmd);
        this.$bus.send({"message":"cmd", "cmd":cmd})

      },
      update: function() {
        this.updating = false;
        let win = document.getElementById('console_win');
        if (win) {
          win.scrollTo(0, document.getElementById('console').scrollHeight);
        }
      },
      onUpdate: async function(event) {
        if (this.updating) { return }
        this.updating = true;
        this.$nextTick(this.update);
      },
    },
  }

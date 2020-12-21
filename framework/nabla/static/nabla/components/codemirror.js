

export default {
  name: "codemirror",
  template: `

  <n-fill header="bg-form" content="white">
    <template v-slot:header>
      <v-toolbar color="transparent" flat dense>
        <div>
          <v-icon left>{{icon}}</v-icon>{{ title }}
        </div>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn v-show="!locked" @click.stop="on_revert" text :disabled="!enable.revert"><v-icon left>mdi-cloud-download</v-icon>Revert</v-btn>
          <v-btn v-show="!locked" @click.stop="on_save" text :disabled="!enable.save"><v-icon left>mdi-cloud-upload</v-icon>Save</v-btn>
        </v-toolbar-items>
      </v-toolbar>  
    </template>
    <div ref="wrap" class="codemirror-wrap">
      <textarea ref="editor" style="height:100%"></textarea>
    </div>
  </n-fill>
  `,

  props: {
    load:{ type:String },
    start:{ type:Boolean, default:false },
    icon: { type:String, default:'mdi-iframe' },
    mode: { type:String, default:'javascript' },
    theme: { type:String, default:'nabla-cm' },
    lineNumbers:{ type:Boolean, default:false },
    title: { type:String, default:'Code' },
    locked: { type:Boolean, default:true },
  },

  data: function () {
    return {
      text:'',
      started: false,
      CodeMirror: null,
      cm: null,
      enable: {
        revert:false,
        save:false
      }
    }
  },

  computed: {
    code: {
      get: function () {
        if (!this.started) { return this.text; }
        //.CodeMirror-lint-marker-error
        //console.log(document.querySelectorAll('#main-div .CodeMirror-lint-marker-error').length;)

        
        return this.cm.getValue()
      },
      set: function (text) {
        //console.log("nabla.components.codemirror.code.set", text)
        this.text = text
        if (this.started) { this.cm.setValue(this.text); }
      }
    },
  },

  watch: {
    
    start: function(x) {
      if (!this.started && x) {
        this.started=true;
        this.create_editor()
      }    
    },
    
    load: function(text) { 
      this.code=text; 
    },

    locked: function(readOnly) { 
      if (this.cm) {
        this.cm.setOption('readOnly',readOnly)
      }
      
    },

  },
  mounted: function() {

  },

  beforeDestroy: function() {
    if (this.cm) {
      this.cm.off("change",this.on_change);
    }
  },

  methods: {
    create_editor: function() {
      var self=this;
    //console.log("Requiring CODEMIRROR ---------------------------");
    //requirejs(["codemirror/loader"], function(CodeMirror) {


      self.CodeMirror = CodeMirror;

      self.cm = new self.CodeMirror.fromTextArea(self.$refs.editor, {
        mode: self.mode,
        theme: self.theme,
        lineNumbers: self.lineNumbers,
        gutters: ["CodeMirror-lint-markers"],
        lint: {
          options: {esversion: 6},
          //getAnnotations: self.lint, async: true 
        },
        tabSize:2
      });
      self.cm.on("change",self.on_change);
     
      console.log("nabla.components.codemirror.create_editor("+self.mode+")", self.text)
      self.cm.setValue(self.text)
    //});
    },

    
    check_ui: function() { 
      var self=this;
      setTimeout(function() {
        var errors = self.$refs.wrap.querySelectorAll('.CodeMirror-lint-marker-error').length;
        self.enable.revert = !(self.code==self.text)
        if (self.code==self.text) {
          self.enable.save = false; 
        } else {
          self.enable.save = errors==0
        }
      }, 500)
      
    },

    refresh: function() { 
      //Call me on tab shown 
      this.$nextTick(this.cm_refresh); 
    },

    cm_refresh: function() { if (this.cm) { this.cm.refresh(); } },

    on_change: function() {
      this.check_ui()
    },

    on_revert: function() {
      this.code = this.text
    },
    
    on_save: function() {
      this.$emit("on_save", this.code)
    },
    

  },

  
}


  
  
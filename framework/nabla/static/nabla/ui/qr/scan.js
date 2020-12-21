/**
 * Nabla Active Framework 
 * (c) 2020 Txema Vicente
 * Released under the MIT License.
 */

import QrScanner from "/static/js/qr-scanner.min.js";
QrScanner.WORKER_PATH = '/static/js/qr-scanner-worker.min.js';

const error_msg = "No QR code found";

export default {   
  template: `
  <div id="cam-container">
    <div id="cam-size">
      <video id="cam"></video>
    </div>
    <div id="cam-overlay">
      <div id="cam-log">{{log}}</div>
    </div>
    <div id="cam-quad">
      <div id="cam-title">{{title}}</div>  
      <div id="cam-result">{{result}}</div>
      <div id="cam-status">{{status}}</div>
    </div>
  </div>
  `,    
  props: { 
    value: Boolean, 
    title: {type:String, default:"Capture device QR"}, 
    data: String 
  }, 
  scanner: null,
  data: function () {
    return {
      status:"Loading",
      result:"",
      log:"",
      div:null,
      video:null,
      quad:null,
      results:[]
    }
  },
  mounted: function() {
    this.div = document.getElementById('cam-container');
    window.addEventListener('resize', this.resize);
    var self = this;
    this.video = document.getElementById('cam');
    this.quad = document.getElementById('cam-quad');
    this.scanner = new QrScanner(this.video, this.on_result, this.on_error);
    this.scanner.start().then(() => { 
      document.getElementById('cam-container').style.opacity=1;    
      self.resize();
    });
  },
  beforeDestroy: function() {
    //document.getElementById('cam-container').style.opacity=0;
    window.removeEventListener("resize", this.resize);
    this.scanner.stop()
  },
  methods: {

    on_error: function(error) {
      this.color("yellow");
      this.result = ""
      this.status = (error==error_msg) ? this.results.length+" Found" : error;
    },


    on_result: function(result) {
      
      if (result.indexOf("nabla.link")<0) {
        this.color("red");
        this.status = "Invalid";
        return
      }
      this.result = result;
      if (this.results.indexOf(result)<0) {
        this.color("white");
        this.results.push(result)
        this.$bus.$emit("qr:scanned", result);
      } else {

        if (result==this.results[this.results.length - 1]) {
          this.color("lime");
          this.status = "Captured"
        } else {
          this.color("#f80")
          this.status = "Repeated"
        }
      }  
    },
    
    color: function(color) {
      this.quad.style.borderColor = color;
      document.getElementById('cam-title').style.background = color;
      document.getElementById('cam-status').style.background = color;
    },

    resize: function() {
      const video = this.video.srcObject;
      if (!video) {return};
      const div = this.div.getBoundingClientRect(),
      cam = video.getVideoTracks()[0].getSettings(),
      size = document.getElementById('cam-size'),
      over = document.getElementById('cam-overlay'),
      pw = cam.width/div.width, ph = cam.height/div.height;
      let cw=0,ch=0,pl=0,pt=0,q=0,ot=0,ol=0;
      if (pw>=ph) { cw = div.width; ch=div.width*(cam.height/cam.width); pt=((div.height-ch)/2) } 
      else { cw =(cam.width/cam.height)*div.height; ch=div.height; pl=((div.width-cw)/2) }
      if (cw>=ch) { q=ch; ol=(cw-ch)/2 } else { q=cw; ot=(ch-cw)/2 }
      let p = cw/5;
      size.style.paddingTop = pt+'px'
      size.style.paddingLeft = pl+'px'
      this.video.style.width =cw+'px';
      this.video.style.height = ch+'px';
      this.quad.style.width=(q-p)+'px';
      this.quad.style.height=44+(q-p)+'px';;
      this.quad.style.top=(-22)+ot+pt+(p/2)+'px';
      this.quad.style.left=ol+pl+(p/2)+'px';;
      over.style.left=this.quad.style.left
      over.style.width=this.quad.style.width;
      over.style.height=this.quad.style.top;
    },
    
  }, 
};

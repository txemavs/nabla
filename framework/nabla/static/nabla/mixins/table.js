/**
 * Nabla Active Framework 
 * (c) 2020 Txema Vicente
 * Released under the MIT License.
 */

 export default {
  template: `
    <v-card elevation="0">
      <v-card-title class="headline text-center">{{ title }}</v-card-title>
      
      <v-card-text>
        <v-data-table 
          item-key="id" 
          :loading="loading"
          :headers="headers" 
          :items="items" 
          :options.sync="options" 
          :server-items-length="count" 
          @click:row="on_click_row"
        >
        </v-data-table>
        
        <v-fade-transition mode="out-in">
            <component :is="detail" :item="selected" ></component>
        </v-fade-transition>   
      </v-card-text>
    </v-card>
  `,
  data: function () {
    return {
      search: '',
      api: null,
      loading: false,
      detail: null,
      selected: null,
      items: [],
      count:0,
      options: {    
        page: 1, itemsPerPage: 5,
        groupBy: [], groupDesc: [],
        sortBy: [], sortDesc: [],
        multiSort: false, mustSort: false,
      },
    }
  },
  watch: {
    options: {
      handler () {
        this.get_items()
      },
      deep: true,
    },
  },

  methods: {

    get_items() {
      this.loading=true;
      var self=this; 
      
      var params = {};
      
      if (this.options.itemsPerPage>0) {
        params["limit"]= this.options.itemsPerPage;
        params["offset"]= (this.options.page-1)*this.options.itemsPerPage;
      }
      
      if (this.options.sortBy.length) {
        var ordering=[];
        this.options.sortBy.forEach((o,i) => ordering.push( ( self.options.sortDesc[i] ? "-":"" )+o ) );
        params["ordering"]=ordering.join(); 
      }

      if (!this.api) {
        this.$bus.log("err: base/table api not set")
      }
      axios.get('/api/'+this.api+'/', { params })
      .then(function (response) {
        console.log(response)
        if (response.data) {
          if (response.data.hasOwnProperty('count')) {
            self.count = response.data.count;
            self.items = response.data.results;  
          } else {
            self.count = response.data.length;
            self.items = response.data;      
          }
        } else {
          self.count = 0;
          self.items = [];     
        }
        
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {
        self.loading=false;
      });

    },

    on_click_row(e) {
      console.log(e)
    }

  },


  mounted:function() {

    //this.$on("click:row", function() {console.log("click:row")})
    this.get_items()

  }
}
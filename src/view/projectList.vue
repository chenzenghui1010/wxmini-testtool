<template>
  <div class="main">
    
    <input-box :showX="valueInfo !=''"
               v-model="valueInfo"
               @selectInput="selectInput"
               @resetInput="resetInput"
               @cancel="cancel"
               :isShow='isShow'
    >
    
    </input-box>
    <div class="hd">
      <div class="showdata">
        <div v-if="!cancelData" v-for='item  in  lists ' @click="select(item.id)">
          <project :text="item.name"></project>
        </div>
      </div>
    
    </div>
    <div v-if="cancelData" class="cancelData">
      <div v-for="  item  in searedResult" @click="go(item.id)">{{ item.name }}</div>
    </div>
    <no-results v-if="showResults"></no-results>
  </div>
</template>

<script>
  import project from '../components/project'
  import MtCell from "mint-ui/packages/cell/src/cell";
  import inputBox from '../components/inputBoX'
  import noResults from '../components/noResults'
  import {Toasts, open, close} from '../mintUi'
  import {getRegionsOfUser, getQueryString} from '../api/locate'
  
  export default {
    components: {
      project,
      inputBox,
      noResults,
    },
    name: "project-list",
    data() {
      return {
        lists: [],
        valueInfo: '',
        cancelData: false,
        isShow: false,
        val: '',
        vals: 9,
        firstOrLast: 0
      }
    },
    watch: {
      
      valueInfo: function (val) {
        if (val.trim() == '') {
          this.cancelData = false
        } else {
          this.cancelData = true
          this.val = val.trim();
          console.log(this.searedResult);
        }
      },
    },
    
    mounted() {
  
      document.title = '项目列表'
      this.firstOrLast = getQueryString('firstOrLast') || this.$route.query.firstOrLast
     
      this.requestList()
      
    },
    
    
    computed: {},
    
    methods: {
      
      requestList() {
        
        open()
        
        getRegionsOfUser()
          
          .then(data => {
           
            close()
            for (let i = 0; i < data.length; i++) {
              
              let {name, id} = data[i]
              
              this.lists.push({name: name, id: id})
              
            }
          }).catch(msg => {
          close()
          Toasts(msg)
        })
      },
      select(id) {
        
        this.selectProject(id)
    
      },
      go(id) {
        
        this.selectProject(id)
        
      },
      resetInput() {
        this.valueInfo = ''
      },
      
      cancel() {
        this.valueInfo = ''
        this.isShow = false
      },
      
      selectInput() {
        this.isShow = true
      },
      
      selectProject(id) {
       
        if (this.firstOrLast == 0) {
          
          if (window.__wxjs_environment === 'miniprogram') {
            
            wx.miniProgram.navigateTo({url: '../map/map?mapId=' + id})
            
          } else {
            
            this.$router.push({path: '/map', query: {mapId: id}})
          }
          
          
        } else {
          
          if (window.__wxjs_environment === 'miniprogram') {
            
            wx.miniProgram.navigateTo({url: '../simulation/simulation?mapId=' + id})
            
          } else {
            
            this.$router.push({path: '/simulation', query: {mapId: id}})
          }
        }
      }
    },
    
    
    computed: {
      searedResult() {
        let arr = []
        var len = this.lists.length
        for (var i = 0; i < len; i++) {
          if ((this.lists[i].name).includes(this.val)) {
            arr.push({name: this.lists[i].name, id: this.lists[i].id});
          }
        }
        return arr
      },
      showResults() {
        
        return this.valueInfo.trim() != '' && this.searedResult.length == 0
      },
      
    }
  }
</script>

<style scoped>
  * {
    padding: 0;
    margin: 0;
  }
  
  .main {
  }
  
  .hd {
  }
  
  .showdata {
    box-sizing: border-box;
    width: 100%;
    max-height: 100%;
    position: absolute;
    overflow: hidden;
    overflow-y: scroll;
    overflow-scrolling: touch;
    -webkit-overflow-scrolling: touch;
  }
  
  .cancelData {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 0 5%;
  }
  
  .cancelData > div {
    height: 4.4rem;
    width: 100%;
    border-bottom: 1px solid #eee;
    line-height: 4.4rem;
    font-size: 1.4rem;
    color: #666;
    letter-spacing: 0.15rem;
    box-sizing: border-box;
    padding-left: 5%;
  }
</style>

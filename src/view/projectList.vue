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
    <div class="showdata">
      <div v-if="!cancelData" v-for='item  in  lists ' @click="select(item.id)">
        <project :text="item.name"></project>
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
  import {Toast} from 'mint-ui'
  import {getRegionsOfUser} from '../api/locate'
  
  document.title = '项目列表'
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
        vals:9
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
      getRegionsOfUser()
        .then(data => {
          for (let i = 0; i < data.length; i++) {
            let {name, id} = data[i]
            this.lists.push({name: name, id: id})
          }
          this.lists.push({name: '', id: ''})
        }).catch(msg => {
        // alert(msg)
      })
      
    },
    
    
    computed: {},
    
    methods: {
      go(id) {
        console.log(id);
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
      
      select(id) {
        this.$router.push({path: '/map', query: {mapId: id}})
        console.log(id);
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
  
  .showdata {
    width: 100%;
    max-height: 100%;
    position: absolute;
    overflow: hidden;
    overflow-y: scroll;
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

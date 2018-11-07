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
    <div v-if="!cancelData" v-for='item  in  lists '>
      <project :text="item.title"></project>
    </div>
    
    <div v-if="cancelData" class="cancelData">
        <div v-for="  item  in searedResult">{{ item.a }}</div>
    </div>
    
    <no-results v-if="showResults"></no-results>
  </div>
</template>

<script>
  import project from '../components/project'
  import MtCell from "mint-ui/packages/cell/src/cell";
  import inputBox from '../components/inputBoX'
  import noResults from '../components/noResults'
  
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
        lists: [{title: '项目名称一'}, {title: '项目名称二'}, {title: '项目名称三'}, {title: '项目名称三'}],
        valueInfo: '',
        cancelData: false,
        isShow: false,
        val: '',
      }
    },
    watch: {
      
      valueInfo: function (val) {
        if (val.trim() == '') {
          this.cancelData = false
        } else {
          this.cancelData = true
          this.val = val;
          this.searedResult
          console.log(this.searedResult);
        }
      },
    },
    
    computed: {},
    
    methods: {
      
      resetInput() {
        this.valueInfo = ''
      },
      
      cancel() {
        this.valueInfo = ''
        this.isShow = false
      },
      
      selectInput() {
        this.isShow = true
        this.valueInfo = ''
      },
    },
    
    
    computed: {
      searedResult() {
        let arr = []
        var len = this.lists.length
        for (var i = 0; i < len; i++) {
          if ((this.lists[i].title).includes(this.val) ) {
            arr.push({a:this.lists[i].title});
          }
        }
        return arr
      },
      showResults(){
        
        return this.valueInfo.trim() !='' && this.searedResult.length == 0
      }
    }
  }
</script>

<style scoped>
  * {
    padding: 0;
    margin: 0;
  }
  
  .main {
    min-height: 100%;
  }
  .cancelData{
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 0 5%;
  }
  .cancelData > div:first-child{
    height: 4.4rem;
    width: 100%;
    border-bottom: 1px  solid #eee;
    line-height: 4.4rem;
    ont-size: 1.4rem;
    color: #666;
    letter-spacing: 0.15rem;
    box-sizing: border-box;
    padding-left:5% ;
  }
</style>

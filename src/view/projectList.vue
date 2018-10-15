<template>
  <div class="main">
    <form action="" v-on:submit.prevent="" target="frameFile">
      <div class="page-search">
        <mt-search
          autofocus
          v-model="inputValue"
          :result="filterResult">
        </mt-search>
      </div>
    </form>
    <project v-for='item  in  lists ' :text="item.title"></project>
  </div>
</template>

<script>
  import project from '../components/project'
  import MtCell from "mint-ui/packages/cell/src/cell";
  
  document.title = '项目列表'
  export default {
    components: {
      MtCell,
      project
    },
    name: "project-list",
    data() {
      return {
        inputValue: '',
        lists: [{title: '项目名称一'}, {title: '项目名称二'}, {title: '项目名称三'}, {title: '项目名称三'}],
        defaultResult: [
          '项目名称一',
          '项目名称二',
          '项目名称三',
          'Peanut',
          'Other'
        ]
      }
    },
    watch: {},
    computed: {
      filterResult() {
        return this.defaultResult.filter(inputValue => new RegExp(this.inputValue, 'i').test(inputValue));
      }
    },
    methods: {
      selected1() {
        console.log('项目一');
      },
      selected2() {
        console.log('项目二');
      }
    },
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
  
  .page-search {
    height: 100%;
  }
  
  .search {
    
    width: 100%;
    height: 4.4rem;
    background: #EFEFF4;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .search p {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 90%;
    height: 2.8rem;
    background: #fff;
    border-radius: 0.5rem;
    color: #B2B2B2;
  }
  
  .search p:before {
    content: '';
    width: 1.5rem;
    height: 1.5rem;
    background: url("../assets/Home/搜索.png") no-repeat center /100% 100%;
    margin-right: 0.2rem;
  }
</style>

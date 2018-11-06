<template>
  <div class="guide">
  从 <span>{{fromFloor}} </span>  经楼梯道至  <span>{{toFloor}}</span>
  </div>
</template>

<script>
  export  default{
    name:'guide',
    data(){
      return{
        fromFloor:'B1',
        toFloor:'B2'
      }
    },
    mounted(){
    
    }
  }
</script>

<style scoped>
  .guide{
    position: absolute;
    width: 100%;
    height: 3rem;
    margin-top: 8.5rem;
    background: #26313E;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.2rem;
    color: #C8C8C8;
  }
  span{
    font-size: 1.2rem;
    color: #3984DD;
    margin: 0 0.2rem;
  }
</style>

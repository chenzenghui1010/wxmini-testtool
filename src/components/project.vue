<template>
  <div @click="select" class="main">
    <div class="content">
     {{ text }}
    </div>
  
  </div>
</template>

<script>
  export default {
    name: "project",
    
    props: ['text'],
    
    methods: {
      
      select() {
        
        this.$emit('select')
      }
    },
  }
</script>

<style scoped>
  * {
    margin: 0;
    padding: 0;
  }
  
  .main {
    box-sizing: border-box;
    padding-left: 5%;
    
  }
  .content {
    display: flex;
    display: -webkit-flex;
    justify-content: space-between;
    align-items: center;
    -webkit-align-items: center;
    border-bottom: 0.05rem solid #E5E5E5;
    height: 4.5rem;
    box-sizing: border-box;
    padding-right: 5%;
    background: url("../assets/xiangqian.png") no-repeat  95%/0.8rem 1.3rem;
    font-family: PingFangSC-Regular;
    font-size: 1.7rem;
    color: #000;
  }

</style>

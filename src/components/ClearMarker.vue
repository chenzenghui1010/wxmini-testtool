<template>
  <div class="main" @click="isClear">
  </div>
</template>

<script>
  import {MessageBox} from 'mint-ui';
  export default {
    data() {
      return {}
    },
    methods:{
      isClear(){
        MessageBox.confirm(
          '确定清除巡检结果',
          '',
        ).then(action => {
          
          this.$emit('isClear',1)
  
        }).catch(action => {
        })
      }
    }
  }
</script>

<style scoped>
  .main {
    position: absolute;
    z-index: 9;
    width: 3.5rem;
    height: 3.5rem;
    background: url("../assets/Home/close.png") no-repeat center/100% 100%;
    border-radius: 0.5rem;
    bottom: 45%;
    left: 1rem;
    
  }

</style>

<template>
  <div @click="onClick" :class="{select: isShow , noselset:!isShow  }"></div>
</template>

<script>
  export default {
    name: "device-paramers",
    data() {
      return {
        isShow: true,
      }
    },
    methods: {
      onClick() {
        this.isShow = !this.isShow
        this.$emit('isShow',this.isShow)
      }
    }
  }
</script>

<style scoped>
  
  .tooltip.top .tooltip-arrow {
    bottom: 0;
    /* left: 50%; */
    margin-left: 50%;
    border-width: 5px 5px 0;
    border-top-color: #000;
  }
  .tooltip-arrow {
    position: absolute;
    width: 0;
    height: 0;
    border-color: #ea161600;
    border-style: solid;
  }
  
  div {
    position: absolute;
    z-index: 9;
    bottom: 60%;
    left: 1rem;
    width: 3.5rem;
    height: 3.5rem;
  }
  
  .select {
    background: url("../assets/shebechangshu.png") no-repeat center/ 3.5rem 3.5rem;
  }
  
  .noselset {
    background: url("../assets/shebexuanzhong.png") no-repeat center/ 3.5rem 3.5rem;
  }
</style>

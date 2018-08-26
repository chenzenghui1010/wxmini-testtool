<template>
  <div class="main">
    <div class="tooltip">
      <div class="tooltip-arrow"></div>
      <div class="tooltip-inner">
        <p>Major: 10121</p>
        <p>Minor: 10121</p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "paramers"
  }
</script>

<style scoped>
  
  *{
   
    margin: 0;
    padding: 0;
  }
  .main {
    position: absolute;
    z-index: 9;
  }
  
  .tooltip .tooltip-arrow {
    bottom: -0.4rem;
    margin-left: 45%;
    border-width: 5px 5px 0;
    border-top-color: rgba(0, 0, 0, .3);
  }
  .tooltip-inner{
    box-sizing: border-box;
    padding :0.2rem ;
    font-size: 10px;
    border-radius: 0.3rem;
    text-align: center;
    width: 8rem;
    height: 3rem;
    color: #fff;
    background:rgba(0, 0, 0, .3) ;
  }
  .tooltip-arrow {
    position: absolute;
    width: 0;
    height: 0;
    border-color: #ea161600;
    border-style: solid;
  }
  p{
    font-weight: 200;
  }
</style>

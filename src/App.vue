<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>

  export default {
    name: 'App'
  }

</script>

<style>

  /** {*/
    /*-webkit-user-select: none;*/
    /*-webkit-touch-callout: none;*/
    /*-webkit-tap-highlight-color: transparent;*/
    /*user-select: none;*/
  /*}*/

  .mint-msgbox-message{
    color: #000;
  }
  
  /*退出登陆*/
  .mint-msgbox{
    border-radius: 10px;
  }
  .mint-msgbox-cancel{
    color: #007AFF;
    font-size: 1.6rem;
  }
  .mint-msgbox-confirm{
    color: #FF3B30;
    font-size: 1.6rem;
  }
  
  .mint-search{
    height: 100%;
  }
  .mint-searchbar{
    background: #F0EFF5;
  }
  
  .mint-searchbar-cancel{
    font-size: 1.4rem;
    color: #00C203;
  }

</style>

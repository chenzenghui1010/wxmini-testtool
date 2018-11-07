<template>
  <div class="main">
    <div class="img"></div>
    <div>暂无数据</div>
  </div>
</template>

<style scoped>
  .main {
    width: 100%;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 60%;
  }
  
  .img{
    width: 10rem;
    height: 10rem;
    background: url("../assets/Home/noresults.png") no-repeat center/ 100% 100% ;
  }
  .img+div{
    margin-top: 1.5rem;
    font-size:1.4rem;
    color: #7f7f7f;
  }
</style>

<template>
  <div class="main" @click="showMarker">
    <content>
      <header>设备参数</header>
      <div class="uuid">{{markerInfo.uuId}}</div>
      <div class="major">Major值：{{markerInfo.major}}</div>
      <div class="minor">Minor值：{{markerInfo.minor}}</div>
    </content>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        uuId: "AB8190D5-D11E-4941-ACC4-42F30510B408",
        major:11542,
        minor:11542
      }
    },
    props:['markerInfo'],
    methods:{
      showMarker(){
        this.$emit('showMarker')
      }
    }
  }
</script>


<style scoped>
  .main {
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .5);
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.7rem;
  }
  
  content {
    z-index: 11;
    width: 80%;
    height: 20rem;
    background: #fff;
    border-radius: 0.6rem;
  }
  
  header {
    font-family: PingFangSC-Regular ;
    height: 4.4rem;
    color: #000;
    letter-spacing: 0.1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
  }
  
  .uuid {
    height: 6.8rem;
    border-top: 0.1rem solid #ddd;
    border-bottom: 0.1rem solid #ddd;
    box-sizing: border-box;
    padding: 1rem;
    color: #636363;
    text-align: center;
    line-height: 2.4rem;
  }
  .major,
  .minor{
    line-height: 4.4rem;
    text-align: center;
    color: #636363;
  }
  .major {
    height: 4.4rem;
    border-bottom: 0.1rem solid #ddd;
  }
</style>

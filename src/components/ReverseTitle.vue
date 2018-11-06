<template>
  <div class="main">
    <header>
      <div class="left">
        <p class="xiangzuo" v-if="leftIsRight"></p>
        <p class="xiangyou" v-if=" !leftIsRight"></p>
      </div>
      <div class="right">
        <div class="shang">
          <p>前方路口</p>
          <p>全程剩余：<span>{{meter}}</span>米 <span>{{minute}}</span>分钟</p>
        </div>
        <div class="xia">
          <p> 15米 左转</p>
          <p @click="showVoice" :class="{closevoice:closeInOpenVoice,openvoice:!closeInOpenVoice}"></p>
        </div>
      </div>
    </header>
    <footer>
      <span></span>
        给我走
    </footer>
    <div v-if="isShowToast" class="toast">语音播报{{voice}}</div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        leftIsRight: true,
        meter: 99,
        minute: 30,
        voice: '开启',
        closeInOpenVoice: false,
        isShowToast: false,
      }
    },
    
    methods: {
      mounted() {
      
      },
      showVoice() {
        
        this.isShowToast = true
        
        this.voice == '开启' ? this.voice = '关闭' : this.voice = '开启'
        
        this.closeInOpenVoice = !this.closeInOpenVoice
        setTimeout(() => {
          this.isShowToast = false
        }, 3000)
      },
    }
    
  }
</script>

<style scoped>
  
  * {
    padding: 0;
    margin: 0;
    
  }
  
  @media screen and (min-width: 320px) {
    html {
      font-size: 10px;
    }
  }
  
  @media screen and (max-width: 360px) {
    html {
      font-size: 12px;
    }
  }
  
  .main {
    position: absolute;
    top: 0;
    z-index: 2;
    background: #18202A;
    width: 100%;
    height: 8.5rem;
    box-sizing: border-box;
    padding: 1.1rem 1.5rem;
    
  }
  
  header {
    display: flex;
    color: #C8C8C8;
  }
  
  header .left {
    width: 5.7rem;
    height: 5.7rem;
    margin-right: 2.5rem;
    
  }
  
  .right {
    flex: 1;
    align-content: flex-end;
    
  }
  
  .right .shang {
    display: flex;
    justify-content: space-between;
    align-content: flex-end;
    align-items: center;
    width: 100%;
    
  }
  
  .right > div:nth-child(1) > p {
    color: #C8C8C8;
  }
  
  .right > div:nth-child(1) > p:nth-child(1) {
    font-size: 1.5rem;
    
  }
  
  .right > div:nth-child(1) > p:nth-child(2) {
    font-size: 1.2rem;
  }
  
  .shang p span {
    color: #6495ED;
  }
  
  .xia {
    display: flex;
    justify-content: space-between;
    align-items: center;;
  }
  
  .xia p {
    font-size: 3.2rem;
    color: #6495ED;
    
  }
  
  .xia p:last-child {
    width: 2rem;
    height: 1.7rem;
    /*background: url("../assets/Home/Fillok.png") no-repeat center/100% 100%;*/
  }
  
  .xia .closevoice {
    background: url("../assets/Home/Fill.png") no-repeat center/100% 100%;
  }
  
  .xia .openvoice {
    background: url("../assets/Home/Fillok.png") no-repeat center/100% 100%;
  }
  
  .xiangzuo {
    width: 100%;
    height: 100%;
    background: url("../assets/Home/xiangzuo.png") no-repeat center/ 100% 100%;
  }
  
  .xiangyou {
    width: 100%;
    height: 100%;
    background: url("../assets/Home/xiangyou.png") no-repeat center/ 100% 100%;
  }
  
  .toast {
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    position: fixed;
    margin: auto;
    height: 5rem;
    width: 70%;
    background: rgba(45, 47, 59, 0.50);
    border-radius: 50px;
    font-size: 1.4rem;
    color: #FFFFFF;
    display: flex;
    justify-content: center;
    align-items: center;
    letter-spacing: 0.2rem;
  }
  footer{
    position: fixed;
    height: 5.6rem;
    width: 100%;
    bottom: 0;
    left: 0;
    background: #18202A;
    color: #3984DD;
    font-size: 1.5rem;
    letter-spacing: 0.2rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  footer span{
    display: inline-block;
    position: fixed;
    display: flex;
    align-items: center;
    left: 2rem;
    width: 4rem;
    border-right: 1px solid #C8C8C8;
    height: 2rem;
    background: url("../assets/Home/close.png") #18202A no-repeat left/40% 100%;
  }
</style>

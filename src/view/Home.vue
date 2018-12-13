<template>
  <div class="main">
    <div class="content">
      <p></p>
      <p></p>
      <div class="footer">
        <p class="first" @click="first"><span>设备巡查</span></p>
        <p class="last" @click="last"><span>模拟导航</span></p>
      </div>
    </div>
    <footer @click="out">
    
    </footer>
  </div>
</template>


<script>
  import {MessageBox} from 'mint-ui';
  
  export default {
    data() {
      return {}
    },
    
    mounted() {
      document.title = '首页'
    },
    methods: {
      first(){
        this.$router.push({path:'projectList',query:{firstOrLast:0}})
      
      },
      last(){
        this.$router.push({path:'projectList',query:{firstOrLast:1}})
      },
      out() {
        MessageBox.confirm(
          '是否确定退出登录',
          '退出登录',
        ).then(action => {
          this.$router.push({path:'/'})
          
        }).catch(action => {
        })
      }
    }
    
  }
</script>

<style scoped>
  
  * {
    padding: 0;
    margin: 0;
    font-size: 10px;
  }
  
  .main {
    width: 100%;
    height: 100%;
    position: fixed;
    bottom: 0;
    right: 0;
    background: #242931;
  }
  
  .content {
    width: 100%;
    height: 40rem;
    background: url("../assets/Home/网格.png") no-repeat center / 100%;
    padding-top: 4rem;
  }
  
  .content > P:first-child {
    box-sizing: border-box;
    margin: 2.5rem auto;
    width: 15rem;
    height: 15rem;
    background: url("../assets/Home/HomeIcon.png") no-repeat center/100% 100%;
  }
  
  .content > p:nth-child(2) {
    margin: 0 auto 4rem auto;
    width: 17rem;
    height: 2.6rem;
    background: url("../assets/Home/homelogo.png") no-repeat center/100% 100%;
  }
  .footer{
    position: absolute;
  }
  .content > .footer > P {
    width: 5rem;
    height: 7.4rem;
    font-size: 1.2rem;
    display: inline-block;
    text-align: center;
  }
  
  .content > .footer > .first {
    margin: 0 3rem 0 4.5rem;
    background: url("../assets/Home/jianche.png") no-repeat top /100% 5rem;
  }
  
  .content > .footer > .last {
    background: url("../assets/Home/moni.png") no-repeat top /100% 5rem;
  }
  
  .content > .footer > P > span {
    font-size: 1.2rem;
    margin-top: 6rem;
    color: #7F838B;
    display: inline-block;
  }
  
  footer {
    width: 2.5rem;
    height: 2.5rem;
    opacity: 0.44;
    background: url("../assets/Home/return.png") no-repeat center /100% 100%;
    margin-left: 5rem;
    position: absolute;
    bottom: 15%;
   
  }
</style>

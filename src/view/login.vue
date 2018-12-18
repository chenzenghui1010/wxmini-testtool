<template>
  <div class="login">
    <p class="back"></p>
    <div class="user">
      <input type="text" v-model="user" placeholder="请输入您的账号">
      <span></span>
    </div>
    <div class="pwd">
      <input type="password" v-model="pwd" maxlength="12" placeholder="请输入您的密码">
      <span></span>
    </div>
    <p class="select" @click="isSelect" :class="{'select' : select , 'noselect' : !select}"><span></span>
      <span>记住我</span></p>
    <button @click="login">登 录</button>
    
    <span v-if="showError" class="error">{{ errorInfo}}</span>
  </div>
</template>

<script>
  import list from '../components/project'
  import {login, initAppSession} from '../api/locate'
  import md5 from 'js-md5';
  import {timestampToTime} from '../Time'
  import {Toasts, open, close} from '../mintUi'
  import {idrWxManager} from '../../indoorunMap/map'
  
  export default {
    components: {list},
    name: "login",
    data() {
      return {
        user: localStorage.getItem('user'),
        pwd: localStorage.getItem('pwd'),
        select: false,
        showError: false,
        errorInfo: '',
      }
    },
    mounted() {
      
      // localStorage.removeItem('sessionKey')
      
      document.title = '登录'
      
      idrWxManager.init()
      
    },
    methods: {
      
      box(){
        let  num = undefined
        return {
          set:function(newval){ num = newval},
          get:function(){return num},
          type:function(){return typeof num}
        }
      },
      isSelect() {
        this.select = !this.select
      },
      
      login() {
        
        localStorage.setItem('sessionKey', null)
        if (!this.user) {
          this.errorInfo = '账号不能为空'
          this.showError = true
          return
        }
        
        if (!this.pwd) {
          this.errorInfo = '密码不能为空'
          this.showError = true
          return
        }
        
        let u = navigator.userAgent, app = navigator.appVersion;
        let isAndroid = u.includes('Android') || u.includes('Linux'); //g
        let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        
        if (isAndroid) {
          localStorage.setItem('OSType', 'Android')
        }
        if (isIOS) {
          localStorage.setItem('OSType', 'iOS')
        }
        
        localStorage.setItem('appId', 'yf1958599107')
        
        localStorage.setItem('phoneUUID', new Date().getTime())
        
        let uuId = localStorage.getItem('phoneUUID')
        
        
        initAppSession()
          
          .then(async sessionKey => {
            
            close()
            
            localStorage.setItem('sessionKey', sessionKey)

            localStorage.setItem('loginUrl', this.loginUrl)
            
            login()
              
              .then(sessionKey => {
                
                close()
                
                // localStorage.setItem('loginSessionKey', sessionKey)
                if (this.select) {
                  
                  localStorage.setItem('user', this.user)
                  
                  localStorage.setItem('pwd', this.pwd)
                }
                
                if (window.__wxjs_environment === 'miniprogram') {
                  
                  wx.miniProgram.navigateTo({url: '../home/home'})
                  
                } else {
                  
                  this.$router.push({path: 'Home'})
                }
                
              })
              .catch(msg => {
                close()
                Toasts(msg)
              })
          })
          .catch(msg => {
            
            close()
            
            Toasts(msg)
          })
        open()
        
      },
      
    },
    computed: {
      loginUrl() {
        let pwd = md5(this.pwd)
        let pwdSign = md5(`${localStorage.getItem('sessionKey')}${pwd}`)
        return `appId=${localStorage.getItem('appId')}&phoneUUID=${localStorage.getItem('phoneUUID')} &OSType=${localStorage.getItem('OSType')}&sessionKey=${localStorage.getItem('sessionKey')}&userAccount=${this.user}&pwdSign=${pwdSign}`
      }
    },
    
  }
</script>

<style scoped>
  * {
    margin: 0;
    padding: 0;
  }
  
  .login {
    font-family: PingFangSC-Regular;
    position: absolute;
    width: 100%;
    height: 100%;
    background: #242931;
    box-sizing: border-box;
    padding: 0 15%;
  }
  
  .user, .pwd {
    box-sizing: border-box;
    padding: 0 1.5rem;
    display: flex;
    display: -webkit-flex;
    justify-content: space-between;
    -webkit-justify-content: space-between;
    align-items: center;
    -webkit-align-items: center;
  }
  
  .user span,
  .pwd span {
    display: inline-block;
    width: 1.5rem;
    height: 1.5rem;
  }
  
  .user span {
    background: url("../assets/user.png") no-repeat center/1.5rem 1.5rem;
  }
  
  .pwd span {
    background: url("../assets/pwd.png") no-repeat center /1.5rem 1.5rem;
  }
  
  .back {
    margin: 3rem 0 3.5rem 0;
    height: 6.6rem;
    text-align: center;
    background: url("../assets/logo.png") no-repeat center/ 7rem 6.6rem;
    
  }
  
  .login div {
    height: 3.5rem;
    border: 0.05rem solid #7F838B;
  }
  
  .login .pwd {
    margin: 2rem 0 1rem 0;
  }
  
  .select {
    display: flex;
    display: -webkit-flex;
    align-items: center;
    -webkit-align-items: center;
  }
  
  .select span {
    display: inline-block;
    color: #A4A5A9;
    font-size: 1rem;
  }
  
  .select span:first-child {
    width: 2.5rem;
    height: 1.25rem;
    background: url("../assets/select2.png") no-repeat center/ 1.25rem 1.25rem;
  }
  
  .noselect span:first-child {
    width: 2.5rem;
    height: 1.25rem;
    background: url("../assets/select1.png") no-repeat center/ 1.25rem 1.25rem;
  }
  
  button {
    width: 100%;
    height: 3.5rem;
    background: #373B43;
    border: 0.05rem solid #7F838B;
    outline: none;
    font-size: 1.6rem;
    color: #FFFFFF;
    margin: 2.5rem 0 1.5rem;
  }
  
  .error {
    font-size: 1.4rem;
    color: #FA281E;
  }
  
  input {
    display: inline-block;
    height: 2rem;
    border: none;
    font-size: 1.6rem;
    color: #64696E;
    background: none;
    outline: none;
  }

</style>

<template>
  <div class="main">
    <div @click="selectInput" v-if="!isShow" class="div-input">
      <div>
        <span></span>搜索
      </div>
    </div>
    
    <content v-if="isShow">
      <div>
        <span></span>
        <input
          ref="input"
          :value="value"
          @input="$emit('input',$event.target.value)"
        >
        <span @click="resetInput" v-if="showX"></span>
      </div>
      <div @click="cancel" class="cancel">取消</div>
    </content>
  </div>
</template>
<script>
  export default {
    props: ['value', 'showX', 'isShow'],
    data() {
      return {}
    },
    methods: {
      selectInput() {
        this.$emit('selectInput')
      },
      resetInput() {
        this.$emit('resetInput')
      },
      cancel() {
        this.$emit('cancel')
      }
    }
  }
</script>
<style scoped>
  .main {
    background: #efeff4;
  }
  
  .div-input,
    content {
    width: 100%;
    height: 5rem;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    border-bottom: 0.1rem solid #ccc;
  }
  .div-input {
    justify-content: center;
  }
  content {
    padding: 0 2%;
  }
  .div-input > div {
    width: 96%;
    height: 3.2rem;
    background: #fff;
    border-radius: 0.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.5rem;
    color: #B2B2B2;
    letter-spacing: 0.13rem;
  }
  
  .div-input > div > span {
    margin-right: 0.2rem;
    display: inline-block;
    width: 1.5rem;
    height: 1.4rem;
    background: url("../assets/Home/搜索.png") no-repeat center/ 100% 100%;
  }
  

  
  content > div {
    height: 3.2rem;
    background: #fff;
    display: flex;
    align-items: center;
  }
  
  content > div:first-child {
    width: 100%;
    height: 3.2rem;
    border-radius: 0.5rem;
  }
  
  content > div:last-child {
    font-size: 1.6rem;
    color: #00C203;
    background: #efeff4;
    width: 12%;
    display: flex;
    justify-content: flex-end;
  }
  
  span, input {
    display: inline-block;
  }
  
  content > div > span {
    
    margin: 0 2%;
  }
  
  span:first-child {
    width: 1.5rem;
    height: 1.4rem;
    background: url("../assets/Home/搜索.png") no-repeat center/ 100% 100%;
  }
  
  span:last-child {
    background: url("../assets/Home/x.png") no-repeat center/ 100% 100%;
    width: 2rem;
    height: 1.7rem;
  }
  
  input {
    display: block;
    width: 100%;
    border: none;
    border-radius: 0.5rem;
    outline: none;
  }

</style>

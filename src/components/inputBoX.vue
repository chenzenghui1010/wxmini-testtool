<template>
  <div class="main">
    <div class="content">
      <div class="ss"><p></p></div>
      <input
        type="text"
        @click='selectInput'
        ref="input"
        :class="{'input-show':isShow}"
        :value="value"
        @input="$emit('input',$event.target.value)"
        placeholder="搜索"
      >
      <span v-if="value.trim() !=''" @click="resetInput" class="showX"></span>
    </div>
    <div @click='cancel' class="show-style" v-if="isShow">取消</div>
  </div>
</template>
<script>
  export default {
    props: ['value', 'showX', 'isShow'],
    data() {
      return {
      
      }
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
    width: 100%;
    background: #ccc;
    box-sizing: border-box;
    padding: 0 2%;
  }
  
  .main > div:first-child {
    width: 100%;
    height: 5rem;
    display: flex;
    align-items: center;
  }
  content{
    position: relative;
  }
 .ss {
   background: #fff !important;
    height: 3rem;
   border-radius: 0.5rem 0 0 0.5rem;
  }
  .ss p{
    margin-left: 0.5rem;
    margin-top: 0.7rem;
    width: 1.5rem;
    height: 1.5rem;
    background: url("../assets/Home/搜索.png") no-repeat center/100% 100%;;
  }
  input {
    display: block;
    width: 100%;
    height: 3rem;
    border-radius: 0  0.5rem  0.5rem  0;
    border: none;
    box-sizing: border-box;
    padding-left: 0.5rem;
    outline: none;
  
  }
  span {
    position: absolute;
    display: inline-block;
    width: 1.5rem;
    height: 1.5rem;
    top: 1.75rem;
    right: 15.5%;
    content: url("../assets/Home/x.png");
  }
  .input-show {
    width: 100% !important;
    position: relative;
  }
  
  .show-style {
    display: flex;
    justify-content: flex-end;
    width: 14%;
    color: #00C203;
    font-size: 1.6rem;
  }

</style>

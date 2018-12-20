<template>
  <div class="main" :class="{'prompButtom':prompButtom}">
    <div :class="{'prompButtom':prompButtom}"> 温馨提示：{{promptValue}}</div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        a: 'aaa'
      }
    },
    props: ['promptValue','prompButtom'],
  }
</script>

<style scoped>
  .main div {
    position: absolute;
    background: rgba(0, 0, 0, .5);
    height: 4rem;
    width: 100%;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #eee;
    font-size: 1.4rem;
  }
  .prompButtom{
    top: 8rem;
  }

</style>

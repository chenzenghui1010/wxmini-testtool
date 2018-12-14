<template>
  <div class="main">
    <div> 温馨提示：{{promptValue}}</div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        a: 'aaa'
      }
    },
    props: ['promptValue'],
  }
</script>

<style scoped>
  .main div {
    position: absolute;
    background: rgba(0, 0, 0, .5);
    height: 4rem;
    width: 100%;
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #eee;
    font-size: 1.4rem;
  }

</style>

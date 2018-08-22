<template>
  <div>
    <project @select="selected1" text="项目名称一"></project>
    <project  @select="selected2" text="项目名称二"></project>
    <project text="项目名称三"></project>
  </div>
</template>

<script>
  import project from '../components/project'
  
  export default {
    components: {project},
    name: "project-list",
    methods:{
      selected1(){
        console.log('项目一');
      },
      selected2(){
        console.log('项目二');
      }
    }
  }
</script>

<style scoped>

</style>

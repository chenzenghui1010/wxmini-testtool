<template>
        <div class="main">
        <div @click="close"  v-if="isShow" class="zhezhao"></div>
          <div  v-if="isShow" class="details">
            <ul>
              <li>设备参数</li>
              <li>UUID:DSFGDSKDFG-SDGFDW--DGDSGJ5SGGF0-SDFGDF</li>
              <li>Major值：DFGDG </li>
              <li>Minor值： DFGDFGDF</li>
            </ul>
          </div>
        </div>
</template>

<script>
		export default {
				name: "parameter-details",
      data(){
				  return{
				    isShow:false,
				    
          }
      },
      methods:{
				  close(){
				    this.isShow =false
          }
      }
		}
	
</script>

<style scoped>
  *{
    margin: 0;
    padding: 0;
  }
  ul li{
    list-style: none;
  }
  .main .zhezhao{
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 99;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, .5);
  }
  .details{
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    width: 80%;
    height: 18rem;
    z-index: 999;
    background: rgba(255,255,255,.8);
  border-radius: 0.6rem;
  }
  .details ul li{
    font-size:1.7rem;
    text-align: center;
    line-height: 4rem;
    height: 4rem;
    width: 100%;
    border-bottom: 0.1rem solid  rgba(0,0,0,.1);
    color: #636363;;
  }
  .details ul li:nth-child(1){
    color: #000;
  }
  .details ul li:nth-child(2){
    box-sizing: border-box;
    padding:  1rem;
    height: 6rem;
    line-height: 2rem;
  }
  .details ul li:last-child{
    border: none;
  }
</style>

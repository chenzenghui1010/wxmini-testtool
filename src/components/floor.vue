<template>
  <div class="main" :class="{floortype :showColor} ">
    <div @click="isShow" class="ceng">
      <p>{{floor}} <span v-show="isShowDian" class="lc_dot">●</span></p>
      <p :class="{xialabai :showColor}"></p>
    </div>
    <transition name="fade">
      <div v-if="showFloor" class="show">
        <ul>
          <li @click="select(item)" v-for="item in floorList">{{ item }}<span class="bai"
                                                                              :class="{ floor:locatingfloor == item}">●</span>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
  export default {
    
    data() {
      
      return {
        locatingfloor: 'F4',
        showColor: false,
        showFloor: false,
        floor: 'F2',
        floorList: ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'B7', 'B8', 'C9', 'F10'],
      }
    },
    
    methods: {
      
      select(val) {
        
        this.floor = val
        
        this.showColor = true
        
        this.showFloor = false
      },
      
      
      isShow() {
        
        this.showFloor = !this.showFloor
      }
    },
    computed: {
      
      isShowDian: function () {
        
        return this.locatingfloor === this.floor ? true : false
      }
    }
  }
</script>

<style scoped>
  * {
    tap-highlight-color: rgba(0, 0, 0, 0);
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    user-select: none;
    -webkit-user-select: none;
    padding: 0;
    margin: 0;
    list-style: none;
  }
  
  .main {
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 0.25rem;
    border: 1px solid #ccc;
    position: absolute;
    right: 1.5rem;
    top: 10rem;
  }
  
  .ceng p:nth-child(1) {
    display: flex;
    display: -webkit-flex;
    justify-content: center;
    -webkit-justify-content: center;
    width: 100%;
    position: absolute;
    bottom: 1.1rem;
    box-sizing: border-box;
    font-size: 1.4rem;
  }
  
  .ceng p:nth-child(2) {
    position: absolute;
    bottom: 0.1rem;
    width: 100%;
    height: 1rem;
    background: url("../assets/xialahei.png") no-repeat center/ 0.65rem 0.4rem;
  }
  
  .show {
    position: absolute;
    margin-top: 40px;
  }
  
  .show ul {
    max-height: 18rem;
    overflow: hidden;
    overflow-y: scroll;
  }
  
  .lc_dot {
    position: absolute;
    right: 0.4rem;
    bottom: 0.2rem;
    color: red;
  }
  
  .show ul li {
    width: 3.5rem;
    height: 3.5rem;
    margin-top: 1rem;
    text-align: center;
    line-height: 3.5rem;
    color: #fff;
    background: rgba(62, 62, 62, 0.8);
    border-radius: 0.25rem;
    font-size: 1.4rem;
  }
  
  .floortype {
    background: #0F8DFF !important;
    color: #FFF;
    font-size: 1.4rem;
  }
  
  .xialabai {
    position: absolute;
    bottom: 0.1rem;
    width: 100%;
    height: 1.2rem;
    background: url("../assets/xialabai.png") no-repeat center/ 0.65rem 0.4rem !important;
  }
  
  .bai {
    display: none;
  }
  
  .floor {
    display: inline-block;
    color: red !important;
    margin-right: -1rem;
  }
  
  li span {
    display: inline-block;
    margin-left: 0.1rem;
  }
/*过度*/

  .fade-enter-active {
    transition: all .3s ;
  }
  .fade-leave-active {
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .fade-enter, .fade-leave-to {
    transform: translateY(4.5rem);
    opacity: 0;
  }
  
</style>

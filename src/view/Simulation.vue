<template>
  <div>
    
    <simulation-prompt  :prompButtom ='prompButtom' v-if="isShowPrompt" :promptValue="promptValue"></simulation-prompt>
    
    
    <show-marker @showMarker="isShowMarker" v-if="showMarker" :markerInfo="markerInfo"></show-marker>
    
    <div id="map" class="page"></div>

    <zoom v-bind:map="map"></zoom>
    
    <find-car-with-plate-number v-if="mapState.searchCarWithPlate" v-on:navigatetocar="navigateToCar"
                                v-bind:initcarno="carno" :region-id="mapId"></find-car-with-plate-number>
    <find-car-with-unit @onfindunits="navigateToCar" v-bind:map="map"
                        v-if="mapState.searchCarWithUnit"></find-car-with-unit>
    
    <facility-panel v-if="showFacilityPanel" v-bind:map="map" @onnavigateto="onNavigateTo"
                    @onclose="showFacilityPanel = false"></facility-panel>
    
    <parameter-details></parameter-details>
    
    <navigation v-if='navigation.start' @toggleSpeak="toggleSpeak" v-on:stop="onStopNavigate" @birdlook="onBirdLook"
                @followme="onFollowMe"></navigation>
    
    
    <mark-in-map v-if="mapState.markInMap"></mark-in-map>
    
    <!--<floor-list-control :floorlist="floorList" :currentName="currentFloorName" :selectfloorid="currentFloorId"-->
    <!--:locatefloorid="locateFloorId" v-on:onselect="onSelect"></floor-list-control>-->
    <floor :floorlist="floorList" :currentName="currentFloorName" :selectfloorIndex="currentFloorIndex"
           :locatefloorIndex="locateFloorIndex" v-on:onselect="onSelect"></floor>
  
  
  </div>
</template>

<script>
  
  // import '@/yfmap.min'
  import {
    idrMapView,
    idrNetworkInstance,
    idrMarkers,
    idrMapEvent,
    idrWxManager,
    idrDebug,
    idrLocateServerInstance
  } from '../../indoorunMap/map'
  
  import MarkInMap from '@/components/MarkInMap'
  import FloorListControl from '@/components/FloorListControl.vue'
  import LocateStatusControl from '@/components/LocateStatusControl.vue'
  import navigation from '@/components/navigation.vue'
  import FindCarWithPlateNumber from '@/components/FindCarWithPlateNumber.vue'
  import FindCarWithUnit from '@/components/FindCarWithUnit.vue'
  import FindCarBtn from "@/components/findCarBtn";
  import PublicFacilityBtn from '@/components/PublicFacilityBtn'
  import FacilityPanel from '@/components/FacilityPanel'
  import {mapGetters} from 'vuex'
  import Zoom from "@/components/Zoom";
  import status from '../components/status'
  import deviceParameter from '../components/deviceParameter'
  import parameter from '../components/parameter'
  import parameterDetails from '../components/parameterDetails'
  import {getstatus, getDetectionStatus, getBeaconMarksOfRegion} from "../api/locate";
  import {idrMarker} from "../../indoorunMap/modules/idrMarkers";
  import showMarker from '../components/showMarker'
  
  import floor from '../components/floor'
  import simulationPrompt from '../components/simulationPrompt'
  
  export default {
    name: "Map",
    components: {
      MarkInMap,
      Zoom,
      FloorListControl,
      LocateStatusControl,
      navigation,
      FindCarWithPlateNumber,
      FindCarWithUnit,
      FindCarBtn,
      PublicFacilityBtn,
      FacilityPanel,
      status,
      deviceParameter,
      parameter,
      parameterDetails,
      floor,
      showMarker,
      simulationPrompt,
      
    },
    data() {
      return {
        showFacilityPanel: false,
        startLocate: false,
        floorList: [],
        currentFloorName: '',
        currentFloorIndex: null,
        locateFloorIndex: null,
        mapInfo: null,
        map: null,
        mapId: '15313792400143094',
        carno: null,
        endMarker: null,
        audioTime: 0,
        audio: null,
        errorCount: 0,
        obj: [],
        // showParameter: false,
        statusList: [],
        addedMarker: null,
        myMarker: {},
        paopao: null,
        deployList: [],
        showMarker: false,
        markerInfo: {},
        deviceParamers: true,
        marker: null,
        localMarker: {},
        
        isShowImg: true,
        deleteMarker: {},
        isShowHeaderTip: false,
        one: true,
        start: null,
        startOrEnd: true,
        promptValue: '温馨提示:',
        isShowPrompt: false,
        prompButtom:false
      }
    },
    computed: {
      ...mapGetters([
        'mapState',
        'navigation'
      ]),
    },
    watch: {
      currentFloorIndex() {
      
      }
    },
    mounted() {
      
      const maPId = this.$route.query.mapId || "14559560656150195" //项目地图
      
      this.mapId = maPId
      
      this.initMap(maPId)
    },
    
    methods: {
      
      initMap() {
        
        this.map = new idrMapView()
        
        this.map.initMap('yf1248331604', 'map', this.mapId)
        
        this.map.addEventListener(idrMapEvent.types.onFloorChangeSuccess, data => {
          
          this.onFloorChangeSuccess(data)
        })
        
        this.map.addEventListener(idrMapEvent.types.onInitMapSuccess, regionEx => {
          
          this.onInitMapSuccess(regionEx)
        })
        
        this.map.addEventListener(idrMapEvent.types.onNaviStatusUpdate, (data) => {
          
          this.onNaviStatusUpdate(data)
        })
        
        this.map.addEventListener(idrMapEvent.types.onMapClick, (pos) => {
          
          this.onMapClick(pos)
        })
        
        this.map.addEventListener(idrMapEvent.types.onUnitClick, (unit) => {
          
          this.onUnitClick(unit)
        })
      },
      addGreyMarker(pos) {
        
        var marker = new idrMarker({pos: pos, image: './static/markericon/greymarker.png'})
        
        return this.map.addMarker(marker)
      },
      
      
      onUnitClick(unit) {
        
        this.start = unit
        if (this.startOrEnd) return
        if (this.map._inNavi) return  // 是否在导航
        
        this.one = true
        
        console.log('终点');
        
        this.map.doRoute({start: null, end: unit})
          
          .then(res => {
            this.prompButtom = true
            this.showPrompt('点选地图空白处切换起点')
            // this.isShowPrompt = false
            this.reset()
            this.onRouterSuccess(res)
            
          })
        
        this.$store.dispatch('finishMarkInMap')
          
          .then(() => {
        
            return this.map.doRoute({start: null, end: unit})
          })
          .then((res) => {
            
            return this.onRouterSuccess(res)
          })
          .catch(res => {
  
            this.isShowPrompt(res)
          })
      },
      onRouterSuccess({start, end}, findcar = true) {
        
        return new Promise((resolve => {
          
          this.$store.dispatch('startNavigation', findcar)
            
            .then(() => {
              
              this.addEndMarker(end.position)
              
              this.map.changeFloor(start.floorIndex)
              
              this.map.birdLook()
              
              this.map.setStatus(YFM.Map.STATUS_NAVIGATE)
              
              resolve()
            })
        }))
        
      },
      onBirdLook() {
        
        this.map.birdLook()
        
        this.map.setStatus(YFM.Map.STATUS_TOUCH)
      },
      onFollowMe() {
        
        this.map.setStatus(YFM.Map.STATUS_NAVIGATE)
      },
      onStopNavigate() {
        
        if (!this.navigation.findCar) {
          
          this.stopRouteAndClean(true)
          
          return
        }
        
        // var unfind = {
        //
        //   name: '未找到爱车', callback: () => {
        //
        //     this.showPrompt()
        //
        //     Alertboxview.hide()
        //
        //     this.stopRouteAndClean(false)
        //
        //     this.map._inNavi = false
        //
        //     this.start = null
        //   }
        // }
        
        var found = {
          name: '确定', callback: () => {
           this.showPrompt()
            Alertboxview.hide()
            
            this.stopRouteAndClean(true)
            
            this.playAudio('确定')
            
            // this.onNaviToOuter()
            
            this.map._inNavi = false
            
            this.start = null
          }
        }
        
        var cancel = {
          name: '取消', callback: () => {
            
            Alertboxview.hide()
          }
        }
        
        this.prompButtom = false
        
        Alertboxview.show('是否终止导航', [ found, cancel])
      },
      onNaviToUnit(unit) {
        
        this.preparePlayAudio()
        
        this.map.doRoute({start: null, end: unit})
          .then(res => {
            
            return this.onRouterSuccess(res, false)
          })
          .catch(res => {
  
            this.isShowPrompt(res)
          })
      },
      onNaviToOuter() {
        
        let units = this.mapInfo.findUnitsWithType([5])
        
        console.log(units)
        
        if (!('5' in units)) {
          
          return
        }
        
        let btns = units[5].map(unit => {
          
          return {
            name: unit.name, callback: () => {
              
              Alertboxview.hide()
              
              this.onNaviToUnit(unit)
            }
          }
        })
        
        btns.push({
          name: '取消', callback: () => {
            
            Alertboxview.hide()
          }
        })
        
        Alertboxview.show('离场引导', btns)
      },
      onNavigateTo(unitType) {
        
        this.showFacilityPanel = false
        
        const units = this.map.findUnitsWithType([unitType])
        
        if (unitType in units) {
          
          const unit = this.mapInfo.findNearUnit(this.map.getUserPos(), units[unitType])
          
          if (unit) {
            
            this.map.doRoute({start: null, end: unit})
              .then(res => {
                
                return this.onRouterSuccess(res, false)
              })
              .catch(res => {
  
                this.isShowPrompt(res)
              })
          }
        }
      },
      onInitMapSuccess(mapInfo) {
        
        document.title = mapInfo.name
        
        this.mapInfo = mapInfo
        
        this.floorList = mapInfo.floorList
        
        this.map.changeFloor(mapInfo.floorList[0].floorIndex)
        
        if (this.carno) {
          
          this.$store.dispatch('startSearchCarByPlateNumber')
            
            .catch(e => {
              
              console.log(e)
            })
        }
       this.showPrompt()
   
      },
      onFloorChangeSuccess({floorIndex}) {
        
        this.currentFloorIndex = floorIndex
        
        if (!this.startLocate) {
          
          
          idrDebug.showDebugInfo(true)
          
          
          this.startLocate = true
        }
        
        this.currentFloorName = this.getCurrentName()
      },
      getCurrentName() {
        
        for (var i = 0; i < this.floorList.length; ++i) {
          
          if (this.floorList[i].floorIndex === this.currentFloorIndex) {
            
            return this.floorList[i].name
          }
        }
        
        return null
      },
      beginFindCar() {
        
        if (this.endMarker) {
        
          this.map.doRoute({start: null, end: this.endMarker})
            .then(res => {
              
              return this.onRouterSuccess(res)
            })
            .catch(res => {
  
              this.isShowPrompt(res)
            })
          
          return
        }
        
        this.$store.dispatch('startSearchCarByPlateNumber').catch(e => console.log(e))
        
        this.preparePlayAudio()
      },
      navigateToCar({id: unitId}) {
        
        var unit = this.map.findUnitWithId(unitId)
        
        this.addEndMarker(unit.position)
        
        this.map.centerPos(unit.position)
        
        this.map.doRoute({start: null, end: unit})
          .then(res => {
            return this.onRouterSuccess(res)
            
          })
          .catch(res => {
            
            this.isShowPrompt(res)
          })
      },
      
      onLocateSuccess(pos) {
        
        this.map.setUserPos(pos)
        
        this.locateFloorIndex = pos.floorIndex
      },
      onLocateFailed(msg) {
        
        this.errorCount += 1
        
        if (this.errorCount % 5 == 0) {
          
          HeaderTip.show(msg)
        }
      },
      onSelect(val) {
        
        if (this.currentFloorIndex != val) {
          // let o = this.obj
          for (let item of this.obj) {
            item.visible = false
            this.deviceParamers = true
          }
        }
        
        this.currentFloorIndex = val
        this.map.changeFloor(val)
        this.map.autoChangeFloor = false
      },
      onMapClick(pos) {
        
        if (this.map._inNavi) {
          
          this.map.setUserPos(pos)
      
        }
        
        if(!this.prompButtom){
          
          this.promptValue = "请点选车位选择终点"
        }
       
        
        this.startOrEnd = false
        
        console.log(this.map._inNavi);
        
        this.one = true
        
        this.isShowHeaderTip = true
        
        this.map.setUserPos(pos)
        
      },
      preparePlayAudio() {
        
        if (!this.audio) {
          
          this.audio = new Audio()
        }
      },
      playAudio(text) {
        
        return
        
        if (!text) {
          
          return
        }
        
        const date = new Date().getTime()
        
        if (date - this.audioTime < 5000) {
          
          return
        }
        
        this.audio.src = 'https://wx.indoorun.com/thxz/pc/speech?text=' + text
        
        this.audio.play()
        
        this.audioTime = date
      },
      onNaviStatusUpdate({validate, projDist, goalDist, serialDist, nextSug}) {
        
        if (!validate) {
          
          return
        }
        
        if (projDist >= 150) {
          
          this.map.reRoute()
          
          return
        }
        
        const totalDistance = Math.ceil(goalDist / 10.0)
        
        const nextDistance = Math.ceil(serialDist / 10.0)
        
        this.$store.dispatch('setNaviStatus', {
          
          nextLeft: YFM.Map.Navigate.NextSuggestion.LEFT == nextSug,
          
          totalDistance,
          nextDistance
        })
        
        if (totalDistance < 15) {
          
          if (this.one) {
            
            var confirm = {
              
              name: '知道了', callback: () => {
    
                this.showPrompt()
                
                this.prompButtom = false
                
                window.Alertboxview.hide()
                
                this.stopRouteAndClean()
              }
            }
           
            
            window.Alertboxview.show('您已到达目的地',  [confirm])
            
            this.one = false
          }
        }
        else {
          
          const leftrighttext = YFM.Map.Navigate.NextSuggestion.LEFT == nextSug ? '左转' : '右转'
          
          const text = '前方' + nextDistance + '米' + leftrighttext
          
          this.playAudio(text)
        }
        
      },
      stopRouteAndClean(removeEndMarker = true) {
        
        this.map.stopRoute()
        
        this.$store.dispatch('stopNavigation')
          .then(() => {
            
            if (removeEndMarker) {
              
              this.map.removeMarker(this.endMarker)
              
              this.endMarker = null
            }
            
            this.map.setStatus(YFM.Map.STATUS_TOUCH)
          })
      },
      addEndMarker(pos) {
        
        this.map.removeMarker(this.endMarker)
        
        var endMarker = new idrMarkers.IDREndMarker(pos, './static/markericon/end.png')
        
        this.endMarker = this.map.addMarker(endMarker)
      },
      toggleSpeak() {
        
        this.$store.dispatch('toggleSpeak')
      },
      
      isShowMarker() {
        
        this.showMarker = false
      },
      showPrompt(val = '请点选地图空白位置选择起点'){
        this.isShowPrompt = true
        this.promptValue = val
      },
      reset(){
        let data={
          totalDistance:0,
          nextLeft:false,
          nextDistance:0,
        }
        this.$store.dispatch('stopNavigation',false)
        
        this.$store.dispatch('setNaviStatus',data)
      }
    },
    destroyed(){
      this.reset()
     this.map.release()
    }
  }
</script>
<style scoped lang="scss">


</style>
             

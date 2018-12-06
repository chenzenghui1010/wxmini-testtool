<template>
  <div>
    <show-marker @showMarker="isShowMarker" v-if="showMarker" :markerInfo="markerInfo"></show-marker>
    
    <div id="map" class="page"></div>
    <!--<find-car-btn v-if="!mapState.markInMap && !navigation.start" @find-car="beginFindCar"></find-car-btn>-->
    <zoom v-bind:map="map"></zoom>
    <!--<public-facility-btn v-on:onclick='showFacilityPanel = true' v-if="!mapState.markInMap && !navigation.start"></public-facility-btn>-->
    <locate-status-control :dolocate="dolocate" @onclick="doLocating"></locate-status-control>
    <find-car-with-plate-number v-if="mapState.searchCarWithPlate" v-on:navigatetocar="navigateToCar"
                                v-bind:initcarno="carno" :region-id="mapId"></find-car-with-plate-number>
    <find-car-with-unit @onfindunits="navigateToCar" v-bind:map="map"
                        v-if="mapState.searchCarWithUnit"></find-car-with-unit>
    <facility-panel v-if="showFacilityPanel" v-bind:map="map" @onnavigateto="onNavigateTo"
                    @onclose="showFacilityPanel = false"></facility-panel>
    
    <status></status>
    <device-parameter :deviceParamers='deviceParamers' @isShow="isShowParameter"></device-parameter>
    <!--<parameter v-if="showParameter"></parameter>-->
    <parameter-details></parameter-details>
    
    <!--<navigation v-if='navigation.start' @toggleSpeak="toggleSpeak" v-on:stop="onStopNavigate" @birdlook="onBirdLook"-->
    <!--@followme="onFollowMe"></navigation>    提示-->
    
    
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
    },
    data() {
      return {
        showFacilityPanel: false,
        firstTime: true,
        floorList: [],
        currentFloorName: '',
        currentFloorIndex: null,
        locateFloorIndex: null,
        mapInfo: null,
        map: null,
        dolocate: false,
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
        deployList: [],//存储使用mac
        showMarker: false,
        markerInfo: {},
        deviceParamers: true,
        marker: null,
        localMarker: {},
        
        isShowImg: true,
        deleteMarker: {},
        arrMac: [],
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
      
      this.resetLocalStorageMarker()
      
      let localArrMac = JSON.parse(localStorage.getItem('localStorageMarker'))
      
      if (localArrMac) {
        
        this.arrMac = localArrMac
        
      } else {
        
        this.arrMac = []
      }
      
      
      const maPId = this.$route.query.mapId || "14559560656150195" //项目地图
      
      this.mapId = maPId
      
      this.initMap(maPId)
      
    },
    methods: {
      initMap() {
        
        this.requestData()
        
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
        
        // this.map.addEventListener(idrMapEvent.types.onMapClick, (pos) => {
        //
        //   this.onMapClick(pos)
        //
        // })
        //
        this.map.addEventListener(idrMapEvent.types.onUnitClick, (unit) => {
          
          this.onUnitClick(unit)
        })
      },
      
      addGreyMarker(pos) {
        
        var marker = new idrMarker({pos: pos, image: './static/markericon/greymarker.png'})
        
        return this.map.addMarker(marker)
      },
      onUnitClick(unit) {
        
        this.map.setUserPos(unit.position)
        
        if (!this.mapState.markInMap) {
          
          return
        }
        
        this.addEndMarker(unit.position)
        
        this.$store.dispatch('finishMarkInMap')
          .then(() => {
            
            if (!idrWxManager._beaconStart) {
              
              return Promise.reject('蓝牙未开启，请开启蓝牙')
            }
            
            return this.map.doRoute({start: null, end: unit})
          })
          .then((res) => {
            
            return this.onRouterSuccess(res)
          })
          .catch(res => {
            
            window.HeaderTip.show(res)
          })
      },
      onRouterSuccess({start, end}, findcar = true) {
        
        return new Promise((resolve => {
          
          this.$store.dispatch('startNavigation', findcar)
            .then(() => {
              
              this.addEndMarker(end)
              
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
        
        var unfind = {
          name: '未找到爱车', callback: () => {
            
            Alertboxview.hide()
            
            this.stopRouteAndClean(false)
          }
        }
        
        var found = {
          name: '已找到爱车', callback: () => {
            
            Alertboxview.hide()
            
            this.stopRouteAndClean(true)
            
            this.playAudio('已找到爱车')
            
            this.onNaviToOuter()
          }
        }
        
        var cancel = {
          name: '取消', callback: () => {
            
            Alertboxview.hide()
          }
        }
        
        Alertboxview.show('在中断导航前', '是否已找到您的爱车', [unfind, found, cancel])
      },
      onNaviToUnit(unit) {
        
        this.preparePlayAudio()
        
        this.map.doRoute({start: null, end: unit})
          .then(res => {
            
            return this.onRouterSuccess(res, false)
          })
          .catch(res => {
            
            window.HeaderTip.show(res)
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
        
        Alertboxview.show('离场引导', null, btns)
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
                
                window.HeaderTip.show(res)
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
      },
      onFloorChangeSuccess({floorIndex}) {
        
        this.currentFloorIndex = floorIndex
        
        
        if (this.firstTime) {
          
          this.initialiZationMac()
          
          this.doLocating()
          
          idrDebug.showDebugInfo(true)
          
          // idrLocateServerInstance.setReceiveBeaconListener((beacons) => { })
          
          this.firstTime = false
        }
        const totalcount = this.obj[floorIndex].length
        
        setInterval(() => {
            
            const start = Math.floor(Math.random() * totalcount)
            
            const end = Math.min(totalcount, start + Math.floor(Math.random() * 40))
            
            this.foundMac(this.obj[floorIndex].slice(start, end))
          }
          , 1000);
        
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
          
          if (!idrWxManager._beaconStart) {
            
            window.HeaderTip.show('蓝牙未开启，请开启蓝牙')
            
            return
          }
          
          this.map.doRoute({start: null, end: this.endMarker})
            .then(res => {
              
              return this.onRouterSuccess(res)
            })
            .catch(res => {
              
              window.HeaderTip.show(res)
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
            
            window.HeaderTip.show(res)
          })
      },
      doLocating() {
        
        if (this.map.getUserPos()) {
          
          this.dolocate = true
          
          this.map.centerPos(this.map.getUserPos(), false)
          
          this.map.autoChangeFloor = true
        }
        else {
          
          this.map.doLocation(pos => this.onLocateSuccess(pos), ({msg}) => {
            
            this.onLocateFailed(msg)
          })
            .catch(msg => {
              
              if (msg == 'Bluetooth_poweroff') {
                
                HeaderTip.show('蓝牙未开启，请打开蓝牙')
              }
              else {
                
                HeaderTip.show(msg)
              }
            })
        }
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
      
      preparePlayAudio() {
        
        if (!this.audio) {
          
          this.audio = new Audio()
        }
      },
      playAudio(text) {
        
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
          
          this.playAudio('您已到达目的地')
          
          var confirm = {
            name: '知道了', callback: () => {
              
              window.Alertboxview.hide()
              
              this.stopRouteAndClean()
            }
          }
          
          window.Alertboxview.show('您已到达目的地', null, [confirm])
        }
        else {
          
          const leftrighttext = YFM.Map.Navigate.NextSuggestion.LEFT == nextSug ? '左转' : '右转'
          
          const text = '前方' + nextDistance + '米' + leftrighttext
          
          this.playAudio(text)
        }
      },
      stopRouteAndClean(removeEndMarker = true) {
        
        this.map.stopRoute()
          .then(() => {
            
            return this.$store.dispatch('stopNavigation')
          })
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
      isShowParameter() {
        console.log('气泡');
        for (let i = 0; i < this.obj[this.currentFloorIndex].length; i++) {
          
          let item = this.obj[this.currentFloorIndex][i]
          
          this.map.insertPaopao(item, this.currentFloorIndex, item.x, (item.y) - 20, -0, 0)
          
          item.visible = !item.visible
        }
        
        this.deviceParamers = !this.deviceParamers
      },
      
      isShowMarker() {
        
        this.showMarker = false
      },
      
      
      requestData() {
        
        getBeaconMarksOfRegion()
          
          .then(data => {
            
            console.log(data.floorList);
            this.deployList = data.floorList
            
          })
          .catch(msg => {
            
            alert(msg)
          })
      },
      
      
      initialiZationMac() {
        
        for (let item = 0; item < this.deployList.length; item++) {
          
          let deploy = this.deployList[item]
          
          this.obj[item] = deploy.deployList.map((arr) => {
            
            return {
              
              x: arr.boundLeft,
              
              y: arr.boundTop,
              
              floorIndex: item,
              
              major: arr.major,
              
              minor: arr.minor,
              
              floorName: arr.floorName,
              
              visible: false,
              
              color: '0xFFC0CB',
              
              text: 'major:' + arr.major + ', minor:' + arr.minor,
              
              uuId: arr.beaconUUID
            };
          })
          
          let localmac = JSON.parse(localStorage.getItem('localStorageMarker'))
          
          if (localmac) {
            
            for (let i = 0; i < this.obj[item].length; i++) {
              
              // if (this.obj[i].floorIndex != this.currentFloorIndex) continue
              
              const mac = this.obj[item][i].major + '' + this.obj[item][i].minor
              
              if (localmac.includes(mac)) {
                
                let markers = new idrMarker({
                  
                  pos: this.obj[item][i], image: './static/markericon/zhengchang.png', callback: (marker) => {
                    
                    this.showMarker = true
                    
                    const {major, minor, uuid} = this.obj[item][i]
                    
                    this.markerInfo.major = major
                    
                    this.markerInfo.minor = minor
                    
                    this.markerInfo.uuId = uuid
                  }
                })
                this.map.removeMarker(this.myMarker[mac]);
                
                this.map.addMarker(markers)
                
              } else {
                
                let marker = new idrMarker({
                  
                  pos: this.obj[item][i], image: './static/markericon/greymarker.png', callback: (marker) => {
                    
                    this.showMarker = true
                    
                    const {major, minor, uuId} = this.obj[item][i]
                    
                    this.markerInfo.major = major
                    
                    this.markerInfo.minor = minor
                    
                    this.markerInfo.uuId = uuId
                  }
                })
                
                this.myMarker[mac] = this.map.addMarker(marker)
                
              }
            }
          }
        }
      },
      
      foundMac(beacons) {
        
        if (beacons.length > 0) {
          
          // idrDebug.debugInfo(JSON.stringify(beacons[0]))
          
          for (let i = 0; i < beacons.length; ++i) {
            
            const mac = beacons[i].major + '' + beacons[i].minor
            
            if (this.myMarker[mac] != null) {
              
              beacons[i].x = this.myMarker[mac].position.x
              
              beacons[i].y = this.myMarker[mac].position.y
              
              beacons[i].floorIndex = this.myMarker[mac].position.floorIndex
              
              let marker = new idrMarker({
                
                pos: beacons[i], image: './static/markericon/zhengchang.png', callback: (marker) => {
                  
                  this.showMarker = true
                  
                  const {major, minor, uuId} = beacons[i]
                  
                  this.markerInfo.major = major
                  
                  this.markerInfo.minor = minor
                  
                  this.markerInfo.uuId = uuId
                }
              })
              
              this.map.removeMarker(this.myMarker[mac]);
              
              this.myMarker[mac] = null
              
              this.map.addMarker(marker)
              
              this.arrMac.includes(mac) ? '' : this.arrMac.push(mac)
              
            }
          }
          localStorage.setItem('localStorageMarker', JSON.stringify(this.arrMac))
        }
      },
      
      myFoundMac(beacons) {
        if (beacons.length > 0) {
          
          // idrDebug.debugInfo(JSON.stringify(beacons[0]))
          for (let i = 0; i < beacons.length; ++i) {
            
            const mac = beacons[i].major + '' + beacons[i].minor
            
            if (mac in this.myMarker) {
              
              beacons[i].x = this.myMarker[mac].position.x
              
              beacons[i].y = this.myMarker[mac].position.y
              
              beacons[i].floorIndex = this.myMarker[mac].position.floorIndex
              
              let marker = new idrMarker({
                
                pos: beacons[i], image: './static/markericon/zhengchang.png', callback: (marker) => {
                  
                  this.showMarker = true
                  
                  const {major, minor, uuid} = beacons[i]
                  
                  this.markerInfo.major = major
                  
                  this.markerInfo.minor = minor
                  
                  this.markerInfo.uuId = uuid
                }
              })
              
              this.map.removeMarker(this.myMarker[mac])
              
              this.map.addMarker(marker)
              
              this.localMarker[mac] = beacons[i]
              
              localStorage.setItem('localStorageMarker', JSON.stringify(this.localMarker))
              
            }
          }
        }
      },
      
      resetLocalStorageMarker() { //每过一段时间清空 localStorage
        
        let resetMarker = []
        
        if (localStorage.getItem('closeDate') == null) {
          
          let startDate = new Date().getTime() / 1000
          
          let startTime = Math.floor(startDate)
          
          localStorage.setItem('closeDate', startTime);
          
        } else {
          
          let newStartDate = localStorage.getItem('closeDate')
          
          let endDate = new Date().getTime() / 1000
          
          let enfTime = Math.floor(endDate)
          
          let num = (Number(enfTime) - Number(newStartDate))
          
          if (num > 10) {
            
            localStorage.setItem('localStorageMarker', JSON.stringify(resetMarker))
            
            localStorage.removeItem('closeDate')
          }
        }
      },
    }
  }
</script>
<style scoped lang="scss">


</style>

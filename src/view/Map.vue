<template>
  <div>
    <simulation-prompt v-if="isShowPrompt" :promptValue="promptValue"></simulation-prompt>
    <show-marker @showMarker="isShowMarker" v-if="showMarker" :markerInfo="markerInfo"></show-marker>
    
    <div id="map" class="page"></div>
    
    <zoom v-bind:map="map"></zoom>
    
    <locate-status-control :dolocate="dolocate" @onclick="doLocating"></locate-status-control>
    <find-car-with-plate-number v-if="mapState.searchCarWithPlate" v-on:navigatetocar="navigateToCar"
                                v-bind:initcarno="carno" :region-id="mapId"></find-car-with-plate-number>
    <find-car-with-unit @onfindunits="navigateToCar" v-bind:map="map"
                        v-if="mapState.searchCarWithUnit"></find-car-with-unit>
    <facility-panel v-if="showFacilityPanel" v-bind:map="map" @onnavigateto="onNavigateTo"
                    @onclose="showFacilityPanel = false"></facility-panel>
    
    <status></status>
    <device-parameter :deviceParamers='deviceParamers' @isShow="isShowParameter"></device-parameter>
    <clear-marker @isClear="isClear"></clear-marker>
    
    <parameter-details></parameter-details>
    
    <mark-in-map v-if="mapState.markInMap"></mark-in-map>
    
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
  import clearMarker from '../components/ClearMarker'
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
      clearMarker
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
        arrMac: {},
        isShowPrompt: false,
        promptValue: '',
        clearMarker:0,
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
      
      },
      clearMarker(val){
       
       if(val === 1){
         
         localStorage.removeItem('localStorageMarker')
         
         this.initialiZationMac()
         
       }
      }
    },
    mounted() {
      
      this.requestData()
      
      this.resetLocalStorageMarker()
      
      let localArrMac = JSON.parse(localStorage.getItem('localStorageMarker'))
      
      if (localArrMac) {
        
        this.arrMac = localArrMac
        
      } else {
        
        this.arrMac = {}
      }
      
      
      const maPId = this.$route.query.mapId || "14559560656150195" //项目地图
      
      this.mapId = maPId
      
      this.initMap(maPId)
      
    },
    methods: {
      isClear( val){
       
       this.clearMarker = val
       
      },
      initMap() {
        this.map = new idrMapView()
        
        this.map.initMap('yf1248331604', 'map', this.mapId)
        
        
        this.map.addEventListener(idrMapEvent.types.onFloorChangeSuccess, data => {
          
          this.onFloorChangeSuccess(data)
        })
        
        this.map.addEventListener(idrMapEvent.types.onInitMapSuccess, regionEx => {
          
          this.onInitMapSuccess(regionEx)
        })
        
        // this.map.addEventListener(idrMapEvent.types.onNaviStatusUpdate, (data) => {
        //
        //   this.onNaviStatusUpdate(data)
        // })
        
        // this.map.addEventListener(idrMapEvent.types.onUnitClick, (unit) => {
        //
        //   this.onUnitClick(unit)
        // })
      },
      
      addGreyMarker(pos) {
        
        var marker = new idrMarker({pos: pos, image: './static/markericon/greymarker.png'})
        
        return this.map.addMarker(marker)
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
      
      onNaviToUnit(unit) {
        
        this.preparePlayAudio()
        
        this.map.doRoute({start: null, end: unit})
          .then(res => {
            
            return this.onRouterSuccess(res, false)
          })
          .catch(res => {
  
            this.isShowPrompt = true ,
    
              this.promptValue = res
  
            setTimeout(() => {
    
              this.isShowPrompt = false
    
            }, 3000)
          })
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
  
                this.isShowPrompt = true ,
    
                  this.promptValue = res
  
                setTimeout(() => {
    
                  this.isShowPrompt = false
    
                }, 3000)
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
          
          
          idrLocateServerInstance.setReceiveBeaconListener((beacons) => {
           
            this.foundMac(beacons)
            
           
          })
  
        
          
          this.firstTime = false
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
          
          if (!idrWxManager._beaconStart) {
            
            this.isShowPrompt = true ,
              
              this.promptValue = '蓝牙未开启，请开启蓝牙'
            
            setTimeout(() => {
              
              this.isShowPrompt = false
              
            }, 3000)
            
            
            return
          }
          
          this.map.doRoute({start: null, end: this.endMarker})
            .then(res => {
              
              return this.onRouterSuccess(res)
            })
            .catch(res => {
              
              
              this.isShowPrompt = true
              
              this.promptValue = res
              
              setTimeout(() => {
                this.isShowPrompt = false
              }, 3000)
              
              
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
  
            this.isShowPrompt = true ,
    
              this.promptValue = res
  
            setTimeout(() => {
    
              this.isShowPrompt = false
    
            }, 3000)
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
                
                
                this.isShowPrompt = true ,
                  
                  this.promptValue = '蓝牙未开启，请开启蓝牙'
                
                setTimeout(() => {
                  this.isShowPrompt = false
                }, 3000)
              }
              else {
                this.isShowPrompt = true ,
                  this.promptValue = msg
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
          setTimeout(() => {
            this.isShowPrompt = true ,
              this.promptValue = msg
          }, 3000)
          
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
          if (localmac == null) {
            
            for (let i = 0; i < this.obj[item].length; i++) {
              
              // if (this.obj[i].floorIndex != this.currentFloorIndex) continue
              
              const mac = this.obj[item][i].major + '' + this.obj[item][i].minor
              
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
            
          } else {
            
            for (let i = 0; i < this.obj[item].length; i++) {
              
              // if (this.obj[i].floorIndex != this.currentFloorIndex) continue
              
              const mac = this.obj[item][i].major + '' + this.obj[item][i].minor
            
              if (localmac[mac] != null) {
                
                let marker = new idrMarker({
                  
                  pos: this.obj[item][i], image: './static/markericon/zhengchang.png', callback: (marker) => {
                    
                    this.showMarker = true
                    
                    const {major, minor, uuId} = this.obj[item][i]
                    
                    this.markerInfo.major = major
                    
                    this.markerInfo.minor = minor
                    
                    this.markerInfo.uuId = uuId
                  }
                })
                this.map.removeMarker(this.myMarker[mac]);
                
                this.map.addMarker(marker)
                
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
  
          this.clearMarker = 0
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
                  
                  const {major, minor, uuid} = beacons[i]
                  
                  this.markerInfo.major = major
                  
                  this.markerInfo.minor = minor
                  
                  this.markerInfo.uuId = uuid
                }
              })
              
              this.map.removeMarker(this.myMarker[mac]);
              
              this.myMarker[mac] = null
              
              this.map.addMarker(marker)
              
              this.arrMac[mac] = mac
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
        
        if (localStorage.getItem('closeDate') == null) {
          
          let startDate = new Date().getTime() / 1000
          
          let startTime = Math.floor(startDate)
          
          localStorage.setItem('closeDate', startTime);
          
        } else {
          
          let newStartDate = localStorage.getItem('closeDate')
          
          let endDate = new Date().getTime() / 1000
          
          let enfTime = Math.floor(endDate)
          
          let num = (Number(enfTime) - Number(newStartDate))
          
          if (num > 43200   ) {
            
            localStorage.removeItem('localStorageMarker')
            
            localStorage.removeItem('closeDate')
          }
        }
      },
    }
  }
</script>
<style scoped lang="scss">


</style>

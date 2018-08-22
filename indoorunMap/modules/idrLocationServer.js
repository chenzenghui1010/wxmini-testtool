/**
 * Created by yan on 23/02/2017.
 */


import idrWxManagerInstance from './idrWxManager.js'
import idrDebug from './idrDebug'
import { networkInstance } from "./idrNetworkManager";

class idrLocateServer {
  
  constructor() {
    
    this.initFloorId = ''
    
    this.initRegionId = ''
    
    this._started = false
    
    this._onLocateSuccess = null
    
    this._onLocateFailed = null
    
    this._locateTimerId = null
    
    this.result = null
  }
  
  onServerLocate() {
    
    let beacons = idrWxManagerInstance.getBeacons()
    
    let data = Object.assign({}, beacons, {regionId:this.initRegionId, floorId:this.initFloorId})
    
    networkInstance.locatingBin(data, res => {
  
      this.result = {x:res.x, y:res.y, floorId:res.floorId, regionId:this.initRegionId}
      
      if (typeof this._onLocateSuccess === 'function') {
        
        this._onLocateSuccess(this.result)
      }
    }, res => {
  
      this.result = null
      
      if (typeof this._onLocateFailed === 'function') {
        
        this._onLocateFailed(res)
      }
    })
  }
  
  setLocateDelegate(success, failed) {
    
    this._onLocateSuccess = success
    
    this._onLocateFailed = failed
  }
  
  start(regionId, floorId) {
    
    this.initRegionId = regionId
    
    this.initFloorId = floorId
    
    return new Promise((resolve, reject)=>{
      
      idrWxManagerInstance.init()
        .then(()=>{
          
          clearInterval(this._locateTimerId)
          
          this._locateTimerId = setInterval(() => this.onServerLocate(), 1000)
          
          resolve()
        })
        .catch(res=>{
          
          reject(res)
        })
    })
  }
  
  stop() {
    
    clearInterval(this._locateTimerId)
    
    this._started = false
  }
}

export const idrLocateServerInstance = new idrLocateServer()

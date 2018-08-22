/**
 * Created by yan on 20/02/2017.
 */
/**
 * Created by Sorrow.X on 2016/9/20.
 * beacons.js  蓝牙功能模块
 */

import idrDebug from './idrDebug'

idrDebug.showDebugInfo(false)

export const Bluetooth_poweroff = 'Bluetooth_poweroff'

class idrWxMiniManager {
  
  constructor() {
    
    this._beaconStart = false
    
    this._beacons = null
    
    this._count = null
  }
  
  getBeacons() {
    
    return {
      count:this._count,
      beacons:this._beacons
    }
  }
  
  init() {
    
    return new Promise((resolve, reject)=>{
  
      this.startBeacon()
        .then(res=>{
          
          this._beaconStart = true
          
          this.onSearchBeacons()
          
          resolve()
        })
        .catch(res=>{
          
          reject(res)
        })
    })
  }
  
  startBeacon() {
    
    return new Promise((resolve, reject)=>{
      
      this.stopBeacon()
        .then(res=>{
          
          wx.startSearchBeacons({
            
            ticket:"",
            
            complete:argv => {
              
              if (argv.errMsg == 'startSearchBeacons:bluetooth power off') {
                
                reject(Bluetooth_poweroff)
              }
              else {
                
                resolve()
              }
            }
          });
        })
    })
  }
  
  stopBeacon() {
    
    return new Promise((resolve, reject)=>{
      
      wx.stopSearchBeacons({
        
        complete:argv => {
          
          resolve()
        }
      });
    })
  }
  
  onSearchBeacons() {
    
    wx.onSearchBeacons({
      
      complete: argv => {
        
        this.onBeaconReceive(argv.beacons)
      }
    })
  }
  
  _getValidBeacons(beacons) {
    
    var temp = []
    
    for (var i = 0; i < beacons.length; ++i) {
      
      if (parseInt(beacons[i].rssi) !== 0) {
        
        temp.push(beacons[i])
      }
    }
    
    return temp
  }
  
  filterbeacons(inBeacons) {
    
    var beacons = this._getValidBeacons(inBeacons)
    
    var newBeacons = ''
    
    for (var i = 0; i < beacons.length; ++i) {
      
      const beacon = beacons[i];
      
      const { major, minor, rssi } = beacon
      
      var accuracy = parseInt(beacon.accuracy * 100)
      
      var v0 = String.fromCharCode(accuracy & 0x00ff)
      
      var v1 = String.fromCharCode((accuracy & 0xff00) >> 8)
      
      var v2 = String.fromCharCode(parseInt(rssi) + 256)
      
      var v3 = String.fromCharCode(parseInt(minor) & 0x00ff)
      
      var v4 = String.fromCharCode((parseInt(minor) & 0xff00) >> 8)
      
      var v5 = String.fromCharCode(parseInt(major) & 0x00ff)
      
      var v6 = String.fromCharCode((parseInt(major) & 0xff00) >> 8)
      
      var value = v6 + v5 + v4 + v3 + v2 + v1 + v0
      
      newBeacons = newBeacons + value
    }
    
    return {beacons:newBeacons, count:beacons.length};
  }
  
  onBeaconReceive(beacons) {
    
    var tempBeacons = Array.from(beacons)
    
    var newBeacons = this.filterbeacons(tempBeacons)
    
    this._beacons = window.btoa(newBeacons.beacons)
    
    this._count = newBeacons.count
  }
}

var instance = new idrWxMiniManager()

export { instance as default }

import request from './request'
import {timestampToTime} from '../Time'
import md5 from 'js-md5';


 function getQueryString(name) {
  
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  
  var r = window.location.search.substr(1).match(reg);
  
  if (r != null) {
    
    return decodeURI(r[2]);
  }
  
  return null;
}


export function getstatus(data) {
  
  return request({
    url: '/getstatus',
    method: 'post',
    params: data
  })
}

export function getDetectionStatus(data) {
  
  return request({
    
    url: '/getDetectionStatus',
    method: 'post',
    params: data
    
  })
}

//登录
export function login(data) {
  
  return request({
    url: 'login.html?' + sessionStorage.getItem('loginUrl'),
    method: 'get',
    params: data
    
  })
}

//获取sessionKey
let reInfo = {
  appId: localStorage.getItem('appId'),
  phoneUUID: localStorage.getItem('phoneUUID'),
  OSType: localStorage.getItem('OSType'),
  appPkgName: 'com.yellfun.YFTCS',
  time: timestampToTime(new Date().getTime()),
  appKey: 'aU3S8mc878kLh2otge16oeq755nsBD86'
}
let sign = md5(`appId=${reInfo.appId}&OSType=${reInfo.OSType}&appPkgName=${reInfo.appPkgName}&phoneUUID=${reInfo.phoneUUID}&time=${reInfo.time}&appKey=${reInfo.appKey}`)
let reData = `appId=${reInfo.appId}&phoneUUID=${reInfo.phoneUUID}&OSType=${reInfo.OSType}&appPkgName=${reInfo.appPkgName}&time=${reInfo.time}&sign=${sign}`

export function initAppSession(data) {
  
  return request({
    url: 'initAppSession.html?' + reData,
    method: 'get',
    params: data
    
  })
}

// 获取当前用户关联的项目列表
let OfUserUrl = `sessionKey=${sessionStorage.getItem('sessionKey')}&phoneUUID=${localStorage.getItem('phoneUUID')}&appId=${localStorage.getItem('appId')}`
console.log('你'+sessionStorage.getItem('sessionKey'))

export function getRegionsOfUser(data) {
  
  return request({
    url: 'getRegionsOfUser.html?' + OfUserUrl,
    method: 'get',
    params: data
    
  })
}

// getBeaconMarksOfRegion	获取某个region的蓝牙标签或嗅探器部署位置数据。
export function getBeaconMarksOfRegion(data) {
  return request({
    url: 'getBeaconMarksOfRegion.html?' + `${OfUserUrl}&regionId=${getQueryString('mapId')}&deviceType=${'Y'}`,
    method: 'get',
    params: data
    
  })
}












export function getAlarmList(data) {
  
  return request({
    url: '/getAlarmList',
    method: 'get',
    params: data
  })
}

export function getPersonTrailData(data) {
  return request({
    url: '/zm/getPersonTrailData',
    method: 'get',
    params: data
    // params:data
  })
}


import request from './request'

export function getstatus(data) {
	
	return request({
		url:'/getstatus',
		method: 'post',
    params:data
	})
}

export function getDetectionStatus(data) {
  
  return request({
    
    url:'/getDetectionStatus',
    method:'post',
    params:data
    
  })
}







export function getAlarmList(data) {
  
  return request({
    url:'/getAlarmList',
    method:'post',
    params:data
  })
}

export function getPersonTrailData(data) {
  return request({
    url:'/zm/getPersonTrailData',
    method: 'get',
    params:data
    // params:data
  })
}


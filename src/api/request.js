import axios from 'axios'

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 60000 // request timeout
})

service.interceptors.request.use(config => {
  
  // console.log('请求', config)
  
  return config
  
}, error => {
  
  // console.log(error)
  
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  
  response => {
    
    // console.log('返回', response)
    
    const { code, msg, data,sessionKey } = response.data
  
    if (JSON.stringify(response.data).includes('sessionKey')) {
    
      return sessionKey
    }

    if (code =='success') {
      
      return data
    }
  
    
    return Promise.reject(msg)
  },
  error => {
    console.log('err' + error)// for debug
    return Promise.reject(error)
  })

export default service

import Mock from 'mockjs'
import myData from './myData'

Mock.setup({
  timeout: '350-600'
})

Mock.mock(/\/getstatus/,'post', myData.statusData)
Mock.mock(/\/getDetectionStatus/,'post',myData.getDetectionStatus)

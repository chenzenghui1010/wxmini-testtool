import Mock from 'mockjs'


const items = []
const itemList = []
const count = 10

function genarate() {
  
  for (let i = 0; i < count; i++) {
    
    let item = Mock.mock({
      'pos': {
        
        'x|1': ['200', '300', '250', '300', '400', '251', '260', '420', '347'],
        'y|1': ['100', '140', '240', '308', '306', '205', '195', '245', '300', '254'],
        
        'floorIndex|1': ['0'],
      }, 'mac': Math.floor(Math.random() * 2 + 1)
    })
    
    items.push(item)
  }
  
  return items
}

function getDetectionStatus  () {
  for (let i = 0; i < count; i++) {
    let item = Mock.mock({
      'mac': Math.floor(Math.random() * 2+ 1)
    })
     itemList.push(item)
  }
 
  return itemList
  
}

genarate()
getDetectionStatus()
// const items = [{'pos': {'x': '800', 'y': '995', 'floorId': '15323290763798360'}, 'mac': '1'},]

export default {
  
  statusData: config => {
   
    return {
      code: 'success',
      msg: 'ok',
      data: items
    }
  },
  getDetectionStatus: config => {
    return {
      code: 'success',
      msg: 'ok',
      data: itemList
    }
  }
  
}









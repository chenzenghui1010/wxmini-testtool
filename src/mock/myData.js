import Mock from 'mockjs'


const items = []

function genarate() {

  const count = 10

  for (let i = 0; i < count; i++) {

    let item = Mock.mock({'pos': {

        'x|1': ['800', '1200', '1050', '1200', '1250', '1051','1120', '1620','1547'],
        'y|1': ['500', '440', '940', '1208', '1406', '875', '995','845','1200','1154'],

        'floorId|1': ['15323290763798360'],
      },'mac':'1'})

    items.push(item)
  }

  return items
}

genarate()
// const items = [{'pos': {'x': '800', 'y': '995', 'floorId': '15323290763798360'}, 'mac': '1'},]

export default {
  statusData: config => {
    return {
      code: 'success',
      msg: 'ok',
      data: items
    }
  }
  
}

export function timestampToTime(timestamp) {
  var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  let Y = date.getFullYear();
  let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  let D = date.getDate()< 10 ? '0' + (date.getDate()) : date.getDate();
  let h = date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours();
  let m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes());
  let s = date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds();
  // let num = h <= 24 && h >= 18 ? '晚上' : h < 18 && h >= 12 ? '下午' : '上午';
  // return Y + M + D + (num + h) + ' ' + m + s;
  return Y + '' + M + '' + D + '' + h + '' + m + '' + s;
}


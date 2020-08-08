function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}


/** 
 * 时间戳转化为年 月 日 时 分 秒 
 * number: 传入时间戳 
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致 
*/
function formatDate(date, format) {
  var dateStr = date+"";
  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];

  returnArr.push(dateStr.substring(0,4));
  returnArr.push(dateStr.substring(5,7 ));
 
  returnArr.push(dateStr.substring(8, 10));

  returnArr.push(dateStr.substring(11, 13));
  returnArr.push(dateStr.substring(14, 16));
  returnArr.push(dateStr.substring(17, 19));
  
  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}  

//随机字符串
function random_string(len) {
  len = len || 32;
  var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  var maxPos = chars.length;
  var pwd = '';
  for (var i = 0; i < len; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}
//文件后缀
function get_suffix(filename) {
  var pos = filename.lastIndexOf('.')
  var suffix = ''
  if (pos != -1) {
    suffix = filename.substring(pos)
  }
  return suffix;
}

function getViewInfo(id){

  return new Promise((resolve, reject) => {

    try {
      wx.createSelectorQuery().select(id).boundingClientRect(res => { resolve(res) }).exec()

    } catch (err) {

      reject(err)

    }

  })
}


module.exports = {
  getViewInfo: getViewInfo,
  formatTime: formatTime,
  formatDate: formatDate,
  random_string: random_string,
  get_suffix: get_suffix,
}
//将秒转换时间文本
module.exports.timeToText = timeToText;
function timeToText(value) {
  var min = parseInt(value / 60);
  var sec = parseInt(value % 60);
  var text = "";
  if (min < 10) {
    if (sec < 10) {
      text = "0" + min + ":" + "0" + sec;
    } else {
      text = "0" + min + ":" + sec;
    }
  } else {
    if (sec < 10) {
      text = "" + min + ":" + "0" + sec;
    } else {
      text = "" + min + ":" + sec;
    }
  }
  return text;
}

var MD5 = require('./md5.js');
var app = getApp();

function post(url, data, rest) {
  var promise = new Promise((resolve, reject) => {
    data = hexMD5(data)
    var rest = null;
    wx.request({
      url: url,
      data: data,
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        if (res.data.message == 'timeOut') {
          app.globalData.userId = ''
          wx.clearStorageSync('userId')
        
        }
        if (res.data.success) {
          resolve(res);
        } else { //返回错误提示信息
          if (res.data.message == 'timeOut') {
            reject('登录超时，请重新登录');
          } else {
            reject(res.data.message);
          }
        }

      }
    })

  });
  return promise;
}


function hexMD5(data) {
  var nonce_str = Math.random().toString(36).substr(2, 15);
  var timestamp = Date.parse(new Date());
  var secret = MD5.hexMD5("productId=" + app.globalData.productId + "&token=" + app.globalData.token + "&nonce_str=" + nonce_str + "&timestamp=" + timestamp);
  data.nonce_str = nonce_str;
  data.timestamp = timestamp;
  data.secret = secret;
  return data;
}

module.exports = {
  post: post,
}

var Common = require('./common.js');
function saveFormId(e,app){
  var userId = wx.getStorageSync('userId');
  var openId = wx.getStorageSync('openId');
  if (userId=='') {
    return
  }
  var formId = e.detail.formId;
  var content = e.detail.target.dataset.name//记录用户的操作
  // var openId = app.globalData.openId
  console.log('form发生了submit事件，推送码为：', formId)
  console.log('button点击事件来自：', content)
  console.log('openId：', openId)
 
  // var userId = app.globalData.userId
  // var openId = app.globalData.openId
  wx.request({
    url: app.globalData.userPath + '/app/push/gradeInform',
    data: {
      formId: formId,
      userId: userId,
      openId: openId
    },

    success: function (response) {
      
    }
  })
}

module.exports = {
  saveFormId: saveFormId,
}
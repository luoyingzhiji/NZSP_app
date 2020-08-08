function dialog(that,text) {
  that.setData({
    promptStatus: false,
    dialogContent: text
  })
  setTimeout(() => {
    hidden(that);
  }, 100)
  setTimeout(() => {
    that.setData({
      promptStatus: true,
      dialogContent: ''
    })
    show(that);
  }, 2000)
}
// 提示框消失动画
function hidden(that) {
  var animation = wx.createAnimation({
    duration: 900,
    timingFunction: 'linear',
    delay: 1000
  });
  animation.opacity(0).step()
  that.setData({
    animationData: animation.export()
  })
}
function show(that) {
  var animation = wx.createAnimation({
    duration: 1000,
    timingFunction: 'linear',
    delay: 1000
  });
  animation.opacity(1).step()
  that.setData({
    animationData: animation.export()
  })
}

// 专家升级提示框
function expertsUpgrade(that, type, text, winHeight){
  that.setData({
    text:text,
    type:type,
    upgradeStatus:false,
    winHeight: winHeight
  })
}
function returnBtn(that){
  that.setData({
    upgradeStatus:true
  })
}
function detailsBtn(that){
  that.setData({
    upgradeStatus: true
  })
  wx.switchTab({
    url: '../my/my',
  })
  // wx.redirectTo({
  //   url: '/pages/expertsLevel/expertsLevel',
  // })
}

// 专家登陆、获取专家资格弹窗
function bottomPrompt(that, title, type, text, btnText, bottomBtnType){
  that.setData({
    bottomPromptStatus:false,
    bottomPromptTitle: title,
    bottomPromptType: type,
    bottomPromptText: text,
    btnText: btnText,
    bottomBtnType: bottomBtnType
  })
  
}

// 操作提示弹窗
function operationPrompt(that, text, type, btnStatus, widHeights){
  that.setData({
    operationPromptStatus:false,
    operationPromptType:type,
    operationPromptText:text,
    btnStatus: btnStatus,
    widHeights: widHeights,
  })
}

// 考试弹窗
function examPrompt(that, text, type, title, height, btnStatus){
  that.setData({
    examPromtStatus: false,
    examPromtType: type,
    examPromtText: text,
    examPromtTitle: title,
    promptWindowHeight: height,
    btnStatus:btnStatus
  })
}

//验证登录
function checkLogin(app) {
  var userId = app.globalData.userId;
  if (userId == '') {
    wx.navigateTo({
      url: '/pages/user/login',
    })
    return false;
  }
  return true;
}

module.exports = {
  dialog: dialog,
  checkLogin: checkLogin,
  expertsUpgrade: expertsUpgrade,
  returnBtn: returnBtn,
  detailsBtn: detailsBtn,
  operationPrompt: operationPrompt,
  bottomPrompt: bottomPrompt,
  examPrompt: examPrompt
}

var app = getApp()
Page({

  data: {
    url: ''
  },
  onLoad: function (options) {
    if(options.url){
      var url = options.url;
      url = url.replace(/%%/g, '=');;
      if (url.indexOf('phone/coupon') > -1) {
        url += "?userId=" + app.globalData.userId + "&isIphoneX=" + app.globalData.isIphoneX;
      }
      if (url.indexOf('notice/content') > -1) {
        url += "?isIphoneX=" + app.globalData.isIphoneX
      }
      this.setData({ url: url });
    }else{
       wx.navigateBack({ delta: 2 });
    }

  }
  
})
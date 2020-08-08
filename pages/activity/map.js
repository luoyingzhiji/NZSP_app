//获取应用实例
var HttpUtil = require('../../utils/httpUtil.js');
var Common = require('../../utils/common.js');
var app = getApp();
Page({
  data: {
    shopPath: app.globalData.shopPath,
    imagePath: app.globalData.imagePath,
    isIphoneX: app.globalData.isIphoneX,
    statusBarHeight: app.globalData.statusBarHeight,
    detailedAddress:"",
    address:"",
    longitude:"",
    latitude: "", 
    markers: [{
      id: 1,
      longitude: "",
      latitude: "",  
    }],
  
  },
  onReady: function (e) {
    this.mapCtx = wx.createMapContext('myMap')
  },
  onLoad: function (options) {
    let that = this;
    var longitudeone = "markers["+0+"].longitude";
    var latitudeone = "markers[" + 0 + "].latitude";
   
    that.setData({
      latitude: options.longitude,
      longitude: options.latitude, 
      [longitudeone]: options.latitude,
      [latitudeone]: options.longitude,
      address: options.address,
      detailedAddress: options.detailedAddress,
    });

  },
  moveToLocation: function () {
    this.mapCtx.moveToLocation()
  },
  translateMarker: function () {
    this.mapCtx.translateMarker({
      markerId: 1,
      autoRotate: true,
      duration: 1000,
     
      animationEnd() {
        console.log('animation end')
      }
    })
  },
  includePoints: function () {
    
  }
})

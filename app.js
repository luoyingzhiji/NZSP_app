//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
      wx.getSystemInfo({
        success: res => {
          //导航高度
          this.globalData.statusBarHeight = res.statusBarHeight;
        }, fail(err) {
          console.log(err);
        }
      })
  },
  onShow: function (options) {
    var that = this;
    console.log("[onShow] 场景值:", options.scene);
    //判断是否是 iPhone X 手机
    wx.getSystemInfo({
      success: function(res) {
        if (res.model.indexOf('iPhone X') > -1) {
          that.globalData.isIphoneX=true;
          console.log("是iPhone手机:",that.globalData.isIphoneX);
          console.log("类型:", res.model);
        }
      },
    })
  },
  globalData:{
    src:"",
    productId : 'product_xc',
    token : 'fxQipHk3pZa0q5i9MxBlwO1bhM+6lqQW',
    userName: "点击登录",
    userAvatar: "/image/user_center/user_icon.png",
    userMobile: "",
    userType:"",
    openId:"",
    unionId: "",
    education: "",
    statusBarHeight: 0,
    currentTab:0,
    isIphoneX:false,//是否是 phoneX

    // mainPath: "http://192.168.1.105:8080",
    // shopPath: "http://192.168.1.105:8081",
    // examPath: "http://192.168.1.105:8085",
    // userPath: "http://192.168.1.105:8082",


    mainPath: "https://nzspmain.eduhiker.com",
    shopPath: "https://nzspshop.eduhiker.com",
    userPath: "https://nzspuser.eduhiker.com",
    examPath: "https://nzspexam.eduhiker.com",

    imagePath: "https://nzsplvs--img.oss-cn-shanghai.aliyuncs.com",
    audioPath: "https://nzsplvs--audio.oss-cn-shanghai.aliyuncs.com",
  
   

  }
})

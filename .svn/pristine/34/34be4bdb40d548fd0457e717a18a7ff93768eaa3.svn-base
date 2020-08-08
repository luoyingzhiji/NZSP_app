// pages/my/my.js
var HttpUtil = require('../../utils/httpUtil.js');
var Util = require('../../utils/util.js');
var formIdUtil = require('../../utils/formId.js');
var Common = require('../../utils/common.js');
var app = getApp()
let y=0;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    userInfoEntity:{},
    pullDownBotttomTop: '',
    startY: '',
    finishY: '',
    overbrim: 'hidden',
    glideTop: '',
    // 登录状态
    loginStatus:false,
    imagePath: app.globalData.imagePath,
    userId: 0,
    medelImg:[],
    lightenNum:[],
    imageDownload:'',
    chooseStatus:'',
    mobile:'',
    certificateStatus: false,
    grade:0,
    bgList:[],
    bgImgIndex:0,
    bgImg:'',
    activity:[],
    endTime:'',
    startTime:'',
    infoTop: 0,
    winHeights:0,
    proportion:0,
    bottomPromptS: false,
    basicsCount:0,
    minTop:0
    // bottomPromptStatus:true,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  //分享触发的事件
  onShareAppMessage: function (e) {
    var that = this;
    if(that.data.grade==1){
      var title = '成功获得新西兰旅游铜牌专家证书';
    }
    if (that.data.grade ==2) { 
      var title = '成功获得新西兰旅游银牌专家证书';
    }
    if (that.data.grade == 3) { 
      var title = '成功获得新西兰旅游金牌专家证书';
    }

    if (e.from === 'button') {
      // 来自页面内转发按钮
      // console.log(ops.target)
    }
    return {
      title: title,
      // path: 'pages/activity/activity?id=that.data.id&userId=that.data.userId',  // 路径，传递参数到指定页面 shareImg。
      imageUrl: 'https://nzsplvs--img.oss-cn-shanghai.aliyuncs.com/20190905/course/MP_Share_Pic.jpg',// 分享的封面图
      path: '/pages/first_index/first_index',
      success: function (res) {

      },
      fail: function (res) {

      }
    }
  },
  //推送消息
  formSubmit: function (e) {
    formIdUtil.saveFormId(e, app);
  },
  onLoad: function (options) {

    let that = this;
   
    let winHeights = wx.getSystemInfoSync().windowHeight;
    var proportion = 667 / wx.getSystemInfoSync().windowHeight;
   
    let infoTop = 241;
    that.setData({
     
      infoTop: infoTop,
      winHeights: winHeights,
      proportion: proportion
    })
    
  },
  showCertificate(){
    let that=this;
    if (that.data.certificateStatus && that.data.infoTop < 280) {
      that.setData({
        infoTop: that.data.winHeights - 101,
      })
    }
  },
  
  viewTouchMove:function(e){
    
    var that = this;
    var height = e.touches[0].clientY;
    
    var minTop=that.data.minTop;
      console.log('minTop=====' + minTop);

      let _y = 0;
      if (y == 0) {
        y = height;
        return;
      } else {
        _y = y - height;
        y = height;
      }

      let infoTop = that.data.infoTop;
      infoTop = infoTop - _y;
      console.log('infoTop=====' + infoTop);
      if (infoTop <= minTop) {//整体上移
        return
      } if ((!that.data.certificateStatus && infoTop > 241) || infoTop > (that.data.winHeights-100) ) {//整体下移
        return;
      }else{
        that.setData({
          infoTop: infoTop,
        })
      }
      console.log('y=====' + y);
      console.log('_y=====' + _y);
      console.log('_infoTop=====' + infoTop);
      console.log("------------");
 

  },
  viewTouchEnd:function(e){
    y=0
  },
  queryUserInfo:function(){
    let that = this;
    var medelImg=[];
    var bgImgIndex = that.data.bgImgIndex;
    var lightenNum=[]
    var data = {
      'userId':that.data.userId
    }
    var url = app.globalData.shopPath + '/app/user/list';
    HttpUtil.post(url,data).then((res) => {
      if(res.data.entity != null){
        console.log(res.data.entity)
        for(var i = 0;i<res.data.entity.medal.length;i++){
          medelImg.push(res.data.entity.medal[i].split('#')[0]);
          var lighten = res.data.entity.medal[i].split('#')[2]
          if (lighten == 1){
            lightenNum.push(res.data.entity.medal[i].split('#')[2])
          }
        }

        that.setData({
          userInfoEntity:res.data.entity,
          medelImg: medelImg,
          lightenNum: lightenNum,
          bgList: res.data.entity.minicertificateList,
          basicsCount: res.data.entity.basicsCount,
          bgImg: res.data.entity.minicertificateList[bgImgIndex].link,
          activity: res.data.entity.activity,
          endTime: Util.formatDate(res.data.entity.activity.startTime, 'M.D'),
          startTime: Util.formatDate(res.data.entity.activity.endTime, 'M.D')
        })
      }
    })
  },
  // 未登录状态，跳转注册
  skipRegistered:function(e){
    var that = this;
    if (that.data.chooseStatus == '') {
      wx.redirectTo({
        url: '../first_index/first_index',
      })
      return
    }
    if (e.detail.iv == undefined) {//没有授权
      var url = '../my/my';
      var type = 'tabber';
      wx.navigateTo({
        url: '../authorization/authorization?url=' + url + '&type=' + type,
      })
    }
    return
  },


  //视角
  skipCourseView:function(e){
    var that = this;
    var type = e.currentTarget.dataset.type
    if (type == 'basics') {
      getApp().globalData.currentTab = 0
    } else {
      getApp().globalData.currentTab = 1
    }
    wx.switchTab({
      url: '../NZSP_course/NZSP_course'
    })
  },

  skipCourse1:function(e){
    var that  = this;
   
    console.log(e)
   
    that.setData({
      bottomPromptS:true
    })
   
  },
  skipCourseone:function(e){
    var that = this;
    that.setData({
      bottomPromptS: false,
    })
    getApp().globalData.currentTab = 0
    wx.switchTab({
      url: '../NZSP_course/NZSP_course'
    })
  },
  // 跳转专家等级页面
  skipExpertsLevel:function(){
    var that = this;
    var avatar = that.data.userInfo.avatar
    console.log(avatar)
    wx.navigateTo({
      url: '../expertsLevel/expertsLevel?userId=' + that.data.userId,
    })
  },
  // 跳转勋章攻略页面
  skipMedalStrategy:function(){
    var that = this;
    wx.navigateTo({
      url: '../medalStrategy/medalStrategy?userId=' + that.data.userId,
    })
  },
  // 跳转我的收藏
  skipCollect:function(){
    var that = this;
    wx.navigateTo({
      url: '../collect/collect?userId=' + that.data.userId,
    })
  },
  // 跳转专家计划
  skipInstroduce: function () {
    var that = this;
    wx.navigateTo({
      url: '../instroduce/instroduce',
    })
  },
  // 跳转编辑个人中心
  skipMyData:function(){
    var that = this;
    wx.navigateTo({
      url: '../personaldata/personaldata?userId=' + that.data.userId,
    })
  },

  // 下载证书
  download: function(){
    var that = this;
    wx.showLoading({
      title: '下载中',
    })
    var data = {
      'userId':that.data.userId,
      'index': that.data.bgImgIndex
    }
    var url = app.globalData.shopPath + '/app/down/image/path';
    HttpUtil.post(url,data).then((res) => {
      if (res.data.success){
        wx.hideLoading()
        console.log(res.data.entity)
        that.setData({
          imageDownload: res.data.entity
        })
      
        var imageUrl = that.data.imagePath+that.data.imageDownload;
         wx.showLoading({
      title: '保存中...'
    })
    wx.downloadFile({
      url: imageUrl,
      success: function (res) {
        //图片保存到本地
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (data) {
            wx.hideLoading()
            wx.showModal({
              title: '提示',
              content: '您的个人证书已存入手机相册，赶快分享给好友吧',
              showCancel:false,
            })
          },
          fail: function (err) {
            if (err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              // 这边微信做过调整，必须要在按钮中触发，因此需要在弹框回调中进行调用
              wx.showModal({
                title: '提示',
                content: '需要您授权保存相册',
                showCancel: false,
                success:modalSuccess=>{
                  wx.openSetting({
                    success(settingdata) {
                      console.log("settingdata", settingdata)
                      if (settingdata.authSetting['scope.writePhotosAlbum']) {
                        wx.showModal({
                          title: '提示',
                          content: '获取权限成功,再次点击图片即可保存',
                          showCancel: false,
                        })
                      } else {
                        wx.showModal({
                          title: '提示',
                          content: '获取权限失败，将无法保存到相册哦~',
                          showCancel: false,
                        })
                      }
                    },
                    fail(failData) {
                      console.log("failData",failData)
                    },
                    complete(finishData) {
                      console.log("finishData", finishData)
                    }
                  })
                }
              })
            }
          },
          complete(res) {
            wx.hideLoading()
          }
        })
      }
    })
      }
      console.log(that.data.imageDownload)
    })
  },
  // 刷新证书
  refresh:function(){
    var that = this;
    var bgImgIndex = that.data.bgImgIndex;
    var bgList = that.data.bgList;
    if (bgImgIndex < bgList.length) {
      if (bgImgIndex + 1 == bgList.length) {
        that.setData({
          bgImgIndex : 0
        })
      } else {
        that.setData({
          bgImgIndex: bgImgIndex+1
        })
      }

    }
    console.log(that.data.bgImgIndex)
    that.queryUserInfo();
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 跳转活动详情
  skipActivity:function(){
    var that = this;
    wx.navigateTo({
      url: '../activity/activity?id=' + that.data.activity.id,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    setTimeout(()=>{
      Util.getViewInfo('#the-id').then(res => {

        //获取元素的高度
        let resHeight = res.height
        console.log('winHeights=====' + that.data.winHeights);
        console.log('resHeight=====' + resHeight);

        var minTop = that.data.winHeights - resHeight;
        that.setData({
          minTop: minTop
        })
      })
    },1000)
   


    var chooseStatus = wx.getStorageSync('chooseStatus');
    var userId = wx.getStorageSync('userId');
    
    var mobile = wx.getStorageSync('mobile');
    var grade = wx.getStorageSync('grade');
    // debugger
    var userInfo = wx.getStorageSync('userInfo');
    that.setData({
      chooseStatus: chooseStatus,
      userId: userId,
      mobile: mobile,
      grade: grade,
      userInfo: userInfo
    })
    console.log(grade)
    if (mobile != undefined && mobile != '') {
      that.setData({
        loginStatus: true,
      })
    }
    if (that.data.loginStatus && grade > 0) {
      that.setData({
        certificateStatus: true,
      })
    }

    that.queryUserInfo();
  },
  onPageScroll: function (e) {
    var that = this;
    that.setData({
      glideTop: e.scrollTop
    });
    //这个就是滚动到的位置,可以用这个位置来写判断
  },
  // 开始拖动
  startMove: function (e) {
    var that = this;
    that.setData({
      startY: e.changedTouches[0].pageY,
    });
  },
  // 拖动结束
  finishMove: function (e) {
    var that = this;
    var finishY = that.data.finishY;
    var startY = that.data.startY;
    var glideTop = that.data.glideTop;
    that.setData({
      finishY: e.changedTouches[0].pageY,
    })
    if (that.data.certificateStatus){
      var query = wx.createSelectorQuery().in(this);
      // 如果拖动结束的Y轴坐标大于开始拖动的Y轴坐标就是下滑
      if (finishY > startY) {
        that.finishAni();
        that.setData({
          overbrim: 'hidden',
        })
      };
      // 如果拖动结束的Y轴坐标小于开始拖动的Y轴坐标就是上滑
      if (finishY < startY) {
            that.startAni();
            that.setData({
              overbrim: 'scroll',
            })
      }
    }

  },
  // 上滑执行的动画
  startAni: function () {
    var that = this;
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'linear',
      delay: 0
    });
    animation.top(221).step()
    that.setData({
      animationData: animation.export()
    })
  },
  // 下滑执行的动画
  finishAni: function () {
    var that = this;
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'linear',
      delay: 0
    });
    animation.top(582).step()
    that.setData({
      animationData: animation.export()
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

 
})

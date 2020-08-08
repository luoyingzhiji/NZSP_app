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
    promptStatus: true,
    userId: '',
    collectList:[],
    collectS:true,
    courseId:"",
    sectionId:'',
    sectionTitle:'',
    ts:1,
    winHeight:'',
  },
  onshow:function(){
    that.collectInfo();
  },
  onLoad: function (options) {
    let that = this;
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        let clientHeight = res.windowHeight;
        that.setData({
          winHeight: clientHeight
        });
      }
    });
    that.collectInfo();
  }, 
 
  //收藏列表
  collectInfo() {
    var that = this
    var value = wx.getStorageSync('userId');
    that.setData({
      noData: true,
      searchLoading: false,
      searchLoadingComplete: true
    });
    var data = {
      userId: value,
    }

    var url = app.globalData.userPath + '/app/favorite/list';
    HttpUtil.post(url, data).then((res) => {
      var that = this;
      that.setData({
        searchLoading: true
      });
      if (!res.data.success) {
        that.setData({
          loadingFail: false
        });
        return;
      }
       
      var collectL = res.data.entity;
      if (collectL == 0){
        that.setData({
          collectS: false,
        })
      }else{
        that.setData({
          collectS: true,
        })
        
      }
      that.setData({
        collectList: res.data.entity,
      });
    }).catch((errMsg) => {
      var that = this;
      Common.dialog(that, errMsg);
    });
  },
  //进入课程小节
  btnbar: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var sectionTitle= that.data.collectList[index].courseName;
    var sectionId = that.data.collectList[index].sectionId;
      wx.navigateTo({
        url: "../bar/bar" + '?favoriteSectionId=' + sectionId+ '&courseId=' + that.data.collectList[index].courseId,
      })
  },
  btnCollect:function(){
    getApp().globalData.currentTab = 0;
    wx.switchTab({
      url: '../NZSP_course/NZSP_course'
    })
  }
})
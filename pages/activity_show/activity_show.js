//获取应用实例
var HttpUtil = require('../../utils/httpUtil.js');
var Common = require('../../utils/common.js');
var formIdUtil = require('../../utils/formId.js');
var app = getApp();
Page({
      data: {
        shopPath: app.globalData.shopPath,
        imagePath: app.globalData.imagePath,
        isIphoneX: app.globalData.isIphoneX,
        statusBarHeight: app.globalData.statusBarHeight,
        winHeight: "",//窗口高度
        currentType: 0,
        activityList: [],
        immediatelyDtartList:[],
        historyActivityList:[],
        promptStatus: true,
        chooseS:0,
        scrollViewHeight:0
      },
    onLoad: function (options) {
    console.log(options)
        var that = this;
        var chooseS = wx.getStorageSync('chooseStatus');
        var id = wx.getStorageSync('id');
        var sign = wx.getStorageSync('sign');
        //清除缓存
        wx.setStorageSync('sign', '');
        wx.setStorageSync('id', '');
        if (sign != undefined && sign != null && sign != ''){
          // wx.setStorageSync('sign', '');
          // wx.setStorageSync('id', '');
            wx.navigateTo({
              url: '../activity/activity?id=' + id + '&sign=' + sign,
            })
          }
        
          //身份类型
          if (chooseS == "hobby") {
            that.setData({
              chooseS: 1
            })
          } else {
            that.setData({
              chooseS: 2
            })
            that.queryActivity();
            that.immediatelyDtart();
            that.historyActivity();
            that.setData({
              imagePath: app.globalData.imagePath,
            });
          }
    //  高度自适应
          wx.getSystemInfo( {  
              success: function( res ) {  
                let clientHeight = (res.windowHeight - app.globalData.statusBarHeight)*2;
                  that.setData( {  
                    winHeight: clientHeight  
                  });  
              }  
          });
          var viewWidth = wx.getSystemInfoSync().windowWidth;
          var viewHeight = wx.getSystemInfoSync().windowHeight;
          let systemInfo = wx.getSystemInfoSync()
          // scroll-View的高度
          let scrollViewHeight = viewHeight - app.globalData.statusBarHeight - 45
          console.log(scrollViewHeight)


          that.setData({
            scrollViewHeight: scrollViewHeight
          })
      },
      // 即将开始活动列表
  immediatelyDtart:function(){
    var that = this;
    var isPsat = 0
    var data = {
      'activity.isPast': 1
    }
    var url = app.globalData.shopPath + '/app/activity/list';
    HttpUtil.post(url,data).then((res) => {
      if(res.data.entity != null){
        let activityListThress = res.data.entity;
        let nowTime2 = Date.parse(new Date());
        for (let activity of activityListThress) {
          //活动状态判断
          let startTime2 = Date.parse(new Date(activity.startTime.replace(/-/g, "/")));
          let endTime2 = Date.parse(new Date(activity.endTime.replace(/-/g, "/")));
          if (nowTime2 < startTime2) {
            activity.time = 0;
          }
          if (startTime2 <= nowTime2 && nowTime2 <= endTime2) {
            activity.time = 1;
          }
          if (nowTime2 > endTime2) {
            activity.time = 2;
          }
          // // 城市处理
          // var address2 = activity.address.substring(0, activity.address.indexOf("市"));
          // activity.address = address2;
        }
        that.setData({
          immediatelyDtartList: activityListThress
        })
      }
    }).catch((errMsg) => {
      var that = this;
      Common.dialog(that, errMsg); //错误提示信息
    });
  },
   // 历史活动列表
  historyActivity: function () {
    var that = this;
    var isPsat = 0
    var data = {
      'activity.isPast': 2
    }
    var url = app.globalData.shopPath + '/app/activity/list';
    HttpUtil.post(url, data).then((res) => {
      if (res.data.entity != null) {
        let activityListTwo = res.data.entity;
        let nowTime1 = Date.parse(new Date());
        for (let activity of activityListTwo) {
          //活动状态判断
          let startTime1 = Date.parse(new Date(activity.startTime.replace(/-/g, "/")));
          let endTime1 = Date.parse(new Date(activity.endTime.replace(/-/g, "/")));
          if (nowTime1 < startTime1) {
            activity.time = 0;
          }
          if (startTime1 <= nowTime1 && nowTime1 <= endTime1) {
            activity.time = 1;
          }
          if (nowTime1 > endTime1) {
            activity.time = 2;
          }
          // // 城市处理
          // var address1 = activity.address.substring(0, activity.address.indexOf("市"));
          // activity.address = address1;
        }
        that.setData({
          historyActivityList: activityListTwo
        })
     
      }
    })
  },
      //活动列表
      queryActivity: function() {
        var that = this;
        that.setData({
          noData: true, 
          searchLoading: false, 
          searchLoadingComplete: true, 
        });
        var data = {
        }
        var url = app.globalData.shopPath + '/app/activity/list' //活动列表
        HttpUtil.post(url, data).then((res) => {
          console.log(res.data.entity)
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
            //活动分类数据
            if (res.data.entity != null) {
              let activityListOne = res.data.entity;
              let nowTime = Date.parse(new Date());
              for (let activity of activityListOne){
                //活动状态判断
                let startTime = Date.parse(new Date(activity.startTime.replace(/-/g, "/")));
                let endTime = Date.parse(new Date(activity.endTime.replace(/-/g, "/")));
                if (nowTime < startTime) {
                  activity.time = 0;
                }
                if (startTime <= nowTime && nowTime <= endTime) {
                  activity.time = 1;
                }
                if (nowTime > endTime) {
                  activity.time = 2;
                }
                //自定义属性
                  activity.type=1;
              //  // 城市处理
              //   var address = activity.address.substring(0, activity.address.indexOf("市"));
              //   activity.address = address;
              }
              let defaultObj={
             
                type:2,
              }
              if (activityListOne.length==0){
                activityListOne.push(defaultObj);
              }else{
                activityListOne.splice(1, 0, defaultObj);
              }
              that.setData({
                activityList: activityListOne,
              })
        };
        }).catch((errMsg) => {
          var that = this;
          Common.dialog(that, errMsg); //错误提示信息
        });
      },
     
      chooseType: function (e) {
        let that = this;
        if (that.data.currentType === e.target.dataset.lang) {
          return false;
        } else {
          that.setData({
            currentType: e.target.dataset.lang
          })
        }
      },
 
  switchTab: function (e) {
    let that = this;
    that.setData({
      currentType: e.detail.current,
    })
    console.log(that.data.currentType)
  },
  //推送消息
  formSubmit: function (e) {
    formIdUtil.saveFormId(e, app);
  },
})
      
// pages/introduce/introduce.js


var WxParse = require('../../wxParse/wxParse.js');
var util = require('../../utils/util.js');
var MD5 = require('../../utils/md5.js');
var Common = require('../../utils/common.js');
var HttpUtil = require('../../utils/httpUtil.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

    mainPath: app.globalData.mainPath,
    userPath: app.globalData.userPath,
    imagePath: app.globalData.imagePath,
    isIphoneX: app.globalData.isIphoneX,
    statusBarHeight: app.globalData.statusBarHeight,
    // true 代表未选中
    hobbyChooseStatus: false,
    expertsChooseStatus: false,
    promptStatus: true,
    promptHeight: 0,
    pageStatus: false,
    id:0,
    sign:'',
    signActivityId:0,
    ty:2,
    expertsPitck:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    let height = wx.getSystemInfoSync().windowHeight;
    that.setData({
      promptHeight: height,
      // sign: options.sign,
      // id: options.id,
    })
    if (options.id != undefined && options.id != null && options.id != ''){
      that.setData({
        id: options.id,
      })
    }
    if (options.sign != undefined && options.sign != null && options.sign != '') {
      that.setData({
        sign: options.sign,
      })
    }
    
    wx.login({
      success: function (_res) {
        if (_res.code) {
          var code = _res.code;
          console.log("CODE:" + code);
          let url = app.globalData.userPath + '/mobile/wx/user/info';
          
          let data = {
            "code": code,
          };
          HttpUtil.post(url, data).then((res) => {
            console.log(res.data.entity)
            console.log("userId:" + res.data.entity.userId);
            wx.setStorageSync('userId', res.data.entity.userId);
            // wx.setStorageSync('userId', '1203161757569253376');
            console.log("grade:" + res.data.entity.grade);
            wx.setStorageSync('grade', res.data.entity.grade);
            wx.setStorageSync('isShot', res.data.entity.isShot);
            if (options.sign == 'sign') {
              that.setData({
                expertsPitck: false
              })
            }
            //未选择身份
            console.log("res.data.entity.type====" + res.data.entity.type);
            if (res.data.entity.type == undefined || res.data.entity.type == 0) {
              that.setData({
                pageStatus: true
              })
              
              return;
            }
            
            let chooseStatus = res.data.entity.type == 1 ? 'hobby' : 'experts';
            wx.setStorageSync('chooseStatus', chooseStatus);
    
            //未注册
            if (res.data.entity.mobile == undefined|| res.data.entity.mobile == 'null' || res.data.entity.mobile == '') {
              if (chooseStatus == 'experts') {//从业者进入活动
                //扫码或分享
                if (options.id != undefined) {
                  wx.redirectTo({
                    url: '../authorization/authorization?id=' + options.id + '&sign='+options.sign,
                  })
                  return;
                }
              }
               
            }
          
            if (res.data.entity.mobile != undefined && res.data.entity.mobile != 'null' && res.data.entity.mobile != '') {
              
              let userInfo = {
                'avatar': res.data.entity.avatar,
                'nickname': res.data.entity.nickname,
                'realName': res.data.entity.realName
              }
              wx.setStorageSync('userInfo', userInfo);
              wx.setStorageSync('mobile', res.data.entity.mobile);
              //已经注册
              if (chooseStatus == 'experts'&&options.id != undefined){
                //存入缓存(扫码或分享参数)
                wx.setStorageSync('id', options.id);
                wx.setStorageSync('sign', options.sign);
                wx.switchTab({
                  url: '../activity_show/activity_show',
                })
                return;
              }
            }else{
              wx.setStorageSync('mobile', '');
            }
            wx.switchTab({
              url: '../NZSP_index/NZSP_index'
            })
            
          }).catch((errMsg) => {

            console.log(errMsg); //错误提示信息
          });


        }
      }
    });
      
  },
  // 选择身份
  choose: function (e) {
    var that = this;
    var type = e.currentTarget.dataset.type;
    console.log(type)
    if (type == 'hobby') {
       app.globalData.userType = 'hobby'
      that.setData({
        hobbyChooseStatus: true,
        expertsChooseStatus: false,
        ty:1
      })
    } else {
       app.globalData.userType = 'experts'
      that.setData({
        hobbyChooseStatus: false,
        expertsChooseStatus: true,
        ty: 2
      })
    }
  },
  // 开始按钮
  start: function (e) {
    console.log(e)
    console.log(e.detail.userInfo);
    var that = this;
    var userId = wx.getStorageSync('userId');
    console.log(userId)
    var url = app.globalData.userPath + '/mobile/update/wx/user/chooseStatus';
    //分为两种（扫码进来，默认中从业者（expertsPitck）；普通可以进行身份的选择）
    if (that.data.expertsPitck == false){
      var hobbyChooseStatus = false;
    }else{
      var hobbyChooseStatus = that.data.hobbyChooseStatus;
      var expertsChooseStatus = that.data.expertsChooseStatus;
    }
      let chooseStatus = hobbyChooseStatus ? 'hobby' : 'experts';
      wx.setStorageSync('chooseStatus', chooseStatus);
    if (hobbyChooseStatus || expertsChooseStatus || that.data.expertsPitck == false) {
        let url = app.globalData.userPath + '/mobile/update/wx/user/chooseStatus';
      let type = chooseStatus == 'hobby'?1 : 2;
        let data = {
          "id": userId,
          "type": type,
        };
      HttpUtil.post(url, data).then((res) => {
        if (chooseStatus == 'experts'&&that.data.sign != undefined && that.data.sign != '' && that.data.sign != null){
           wx.redirectTo({
             url: '../authorization/authorization?sign=' + that.data.sign + '&id=' + that.data.id,
           })
           return
         }
        wx.switchTab({
          url: '../NZSP_index/NZSP_index'
        });
        //扫码和分享流程；其他跳到首页
        // if (that.data.sign == 'sign'){//扫码
        //   if (chooseStatus == 'hobby'){
        //     // wx.switchTab({
        //     //   url: '../activity_show/activity_show',
        //     // })
        //     wx.switchTab({
        //       url: '../NZSP_index/NZSP_index'
        //     })
        //   }else{
        //     wx.redirectTo({
        //       url: '../activity/activity?id='+that.data.id+'&sign='+that.data.sign,
        //     })
        //   } 
        // }else if(that.data.sign == 'shareSign'){//分享
        //   if (chooseStatus == 'hobby') {
        //     wx.switchTab({
        //       url: '../NZSP_index/NZSP_index'
        //     })
        //   }else{
        //     wx.redirectTo({
        //       url: '../activity/activity?id=' + that.data.id + '&sign=' + that.data.sign,
        //     })
        //   } 
        // }else{//普通
          // wx.switchTab({
          //   url: '../NZSP_index/NZSP_index'
          // })
        // }
        
      }).catch((errMsg) => {
        console.log(errMsg); //错误提示信息
      });
    } else {
      Common.dialog(that, '请选择您的身份')
    }
  },
  
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

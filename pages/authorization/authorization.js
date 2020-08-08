//获取应用实例
var HttpUtil = require('../../utils/httpUtil.js');
var MD5 = require('../../utils/md5.js');
var Common = require('../../utils/common.js');
var Util = require('../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopPath: app.globalData.shopPath,
    imagePath: app.globalData.imagePath,
    isIphoneX: app.globalData.isIphoneX,
    statusBarHeight: app.globalData.statusBarHeight,

    pageStatus: false,
    hobbyChooseStatus: false,
    expertsChooseStatus: false,
    type:'',
    url:'',
    id:0,
    sign:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // url: '../authorization/authorization?url=' + url + '&type=' + type,
   
    that.setData({
      url: options.url,
      type: options.type,
      id: options.id,
      sign: options.sign,
    })
  },
  //同意授权
  consent: function (e) {
    // 查看是否授权
    
    var that = this;
    if (e.detail.iv == undefined) {//没有授权
      return;
    } 
      //扫码分享
      if (that.data.sign != undefined && that.data.sign != '' && that.data.sign!=null){
        wx.navigateTo({
          url: '../register/register?id=' + that.data.id + '&sign=' + that.data.sign,
        })
        return
      }
      if (that.data.type =='ordinary'){
        wx.navigateTo({
          url: '../register/register?url=' + that.data.url + '&type=' + that.data.type + '&id=' + that.data.id,
        })
        return
      }
      if (that.data.type == 'tabber'){ 
        wx.navigateTo({
          url: '../register/register?url=' + that.data.url + '&type=' + that.data.type,
        })
        return
      }
    
    wx.navigateTo({
      url: '../register/register',
    })

  },
  refuse: function () {
    //返回上一级
    wx.navigateBack({

    })
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
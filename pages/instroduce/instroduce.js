// pages/introduce/introduce.js


var WxParse = require('../../wxParse/wxParse.js');
var util = require('../../utils/util.js');
var MD5 = require('../../utils/md5.js');
var Common = require('../../utils/common.js');
var Favorite = require('../../utils/favorite.js');
var Comment = require('../../utils/comment.js');
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
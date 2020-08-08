var HttpUtil = require('../../utils/httpUtil.js');
import WeCropper from '../../we-cropper/we-cropper.js'
var MD5 = require('../../utils/md5.js');
var Common = require('../../utils/common.js');
var Util = require('../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imagePath: app.globalData.imagePath,
    isIphoneX: app.globalData.isIphoneX,
    statusBarHeight: app.globalData.statusBarHeight,
    imageUrl:'',
    promptStatus: true,
    tempFilePaths:'',
    flag:'',
    isNull:'',
    // 怎么进来的（）
    type:'',
    imageId:'',
    saveBtnStatus:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this;
    // var userId = wx.getStorageSync('userId');
    that.setData({
      userId: options.userId,
      tempFilePaths: options.imageUrl,
      type: options.type,
      isNull:options.isNull,
    })
    if (that.data.isNull == 'no') {
      that.setData({
        saveBtnStatus: false,
      })
    }
  },
  
  querycredentials:function(){
    var that = this;
    var data = {
      'userId':that.data.userId,
    };
    var url = app.globalData.shopPath + '/app/userAudit/info';
    HttpUtil.post(url,data).then((res) => {
      console.log(res.data.entity)
      if(res.data.entity != null){
        console.log(res.data.entity)
        that.setData({
          imageUrl: res.data.entity.imgUrls,
          imageId:res.data.entity.id
        })
      }
    })
    
  },
  // 更改凭证
  change: function () {
    var that = this;
    if (that.data.isNull == 'yes'){
      that.setData({
        flag: 'change'
      })
    }
    console.log(that.data.flag)
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {

        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          tempFilePaths: tempFilePaths[0],
          saveBtnStatus:false
        })
        
        //  that.uploadPhotoInfo(tempFilePaths)
      }
    })
  },
  // 上传头像获取密钥
  uploadPhotoInfo: function () {
    var that = this;
      var filePaths = that.data.tempFilePaths;
    wx.showToast({
      icon: "loading",
      title: "正在上传",
      // duration: 2000
    })
    wx.request({
      url: app.globalData.mainPath + '/upload/policy',
      data: { "ossFile": "image" },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
          that.uploadPhoto(that, res.data, filePaths);
      }
    })
  },
  //上传
  uploadPhoto: function (that, info, filePaths) {
    var that = this;
    var fileName = info.dir + "/image/" + Util.random_string(20) + Util.get_suffix(filePaths)
    console.log(info.host)
    wx.uploadFile({
      url: app.globalData.imagePath,
      filePath: filePaths,
      name: 'file',
      header: { "Content-Type": "multipart/form-data" },
      formData: {
        'key': fileName,
        'policy': info.policy,
        'OSSAccessKeyId': info.accessid,
        'success_action_status': '200', //让服务端返回200,不然，默认会返回204
        'signature': info.signature,
      },
      success: function (res) {
        // app.globalData.imagePath + "/" + 
        // var imageUrl = [];
        // imageUrl.push(fileName)
        console.log(fileName)
        
        that.uploading(fileName);
      },
      fail: function (e) {
        console.log(e);
        Common.dialog(that, '上传失败失败，请稍后再试');
      }
    })
  },
  uploading: function (imageUrl) {
    var that = this;
    // wx.showToast({
    //   icon: "loading",
    //   title: "正在上传",
    //   duration: 2000
    // })
    // var imageUrl = JSON.stringify(imageUrl)
    console.log(imageUrl)
    
    if (that.data.isNull == 'no') {
      var url = app.globalData.shopPath + '/app/user/uploading';
      console.log('111');
    }else{
      var url = app.globalData.shopPath + '/app/userAudit/update';
      console.log('222')
    }
    var data = {
      'imgUrl': imageUrl,
      'userId': that.data.userId,
      'id': that.data.imageId,
    }
    HttpUtil.post(url, data).then((res) => {
      console.log(res.data.success)
      if (res.data.success) {
        wx.navigateBack({
          delta: 1
          // url: '../expertsLevel/expertsLevel',
        })
      }
    }).catch((errMsg) => {
      var that = this;
      Common.dialog(that, errMsg); //错误提示信息
    });
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
    var that = this;
    if (that.data.isNull == 'yes') {
      if (that.data.flag != 'change'){
        that.setData({
          flag: 'examine'
        })
      }
      
      that.querycredentials();
    } else {
      that.setData({
        flag: 'firstExamine'
      })
    }
    console.log(that.data.flag)
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
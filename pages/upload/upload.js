import WeCropper from '../../we-cropper/we-cropper.js'
var MD5 = require('../../utils/md5.js');
var Common = require('../../utils/common.js');
var Util = require('../../utils/util.js');
var app = getApp()
const device = wx.getSystemInfoSync()
const width = device.windowWidth
const height = device.windowHeight - 50
Page({
  data: {
    cropperOpt: {
      id: 'cropper',
      width,
      height,
      scale: 2.5,
      zoom: 8,
      cut: {
        x: (width - 300) / 2,
        y: (height - 300) / 2,
        width: 300,
        height: 300
      }
    },
    dialogShow: true,
    dialogContent: "",
  },
  touchStart(e) {
    this.wecropper.touchStart(e)
  },
  touchMove(e) {
    this.wecropper.touchMove(e)
  },
  touchEnd(e) {
    this.wecropper.touchEnd(e)
  },
  getCropperImage() {
    this.wecropper.getCropperImage((avatar) => {
      if (avatar) {
        //  获取到裁剪后的图片
        this.uploadPhotoInfo(avatar)
      } else {
        console.log('获取图片失败，请稍后重试')
      }
    })
  },
  uploadTap() {
    const self = this

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        const src = res.tempFilePaths[0]
        //  获取裁剪图片资源后，给data添加src属性及其值

        self.wecropper.pushOrign(src)
      }
    })
  },
  onLoad(option) {
    const { cropperOpt } = this.data

    if (option.src) {
      cropperOpt.src = option.src
      new WeCropper(cropperOpt)
        .on('ready', (ctx) => {
          console.log(`wecropper is ready for work!`)
        })
        .on('beforeImageLoad', (ctx) => {

        })
        .on('imageLoad', (ctx) => {

        })
        .on('beforeDraw', (ctx, instance) => {
        })
        .updateCanvas()
    }
  },
  //上传头像获取密钥
  uploadPhotoInfo: function (filePath) {
    var that = this;
    wx.showToast({
      icon: "loading",
      title: "正在上传",
      duration: 200000
    })
    wx.request({
      url: app.globalData.mainPath + '/upload/policy',
      data: { "ossFile": "image" },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.uploadPhoto(that, res.data, filePath)
      }
    })

  },
  //上传头像
  uploadPhoto: function (that, info, filePath) {
    debugger
    var fileName = info.dir + "/image/" + Util.random_string(20) + Util.get_suffix(filePath)
    console.log(info.host)
    wx.uploadFile({
      // url: 'https://ss2.eduhiker.com',
      url:app.globalData.uploadPath,
      filePath: filePath,
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
        
        var avatar = app.globalData.imagePath + "/" + fileName

        //上传成功修改显示头像
        that.setData({
          userAvatar: avatar
        })
        app.globalData.userAvatar = avatar
        that.modifyUserAvatar(that, "/" + fileName)
      },
      fail: function (e) {
        console.log(e);
        Common.dialog(that, '上传失败失败，请稍后再试');
      }
    })
  },
  modifyUserAvatar: function (that, avatar) {
    var nonce_str = Math.random().toString(36).substr(2, 15);
    var timestamp = Date.parse(new Date());
    var secret = MD5.hexMD5("productId=" + app.globalData.productId + "&token=" + app.globalData.token + "&nonce_str=" + nonce_str + "&timestamp=" + timestamp);
    wx.request({
      url: app.globalData.userPath + '/app/user/update/info',
      data: { "userId": app.globalData.userId, "type": "avatar", "content": avatar, "secret": secret, "nonce_str": nonce_str, "timestamp": timestamp },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (!res.data.success) {
          Common.dialog(that, res.data.message);
          return;
        }
        wx.navigateBack({})
      },
      complete: function () {
        wx.hideToast();  //隐藏Toast
      }
    })
  }
})

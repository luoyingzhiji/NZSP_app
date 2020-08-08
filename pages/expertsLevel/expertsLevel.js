var HttpUtil = require('../../utils/httpUtil.js');
import WeCropper from '../../we-cropper/we-cropper.js'
var MD5 = require('../../utils/md5.js');
var Common = require('../../utils/common.js');
var Util = require('../../utils/util.js');
var app = getApp();
app.globalData.imageUrl = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imagePath: app.globalData.imagePath,
    isIphoneX: app.globalData.isIphoneX,
    statusBarHeight: app.globalData.statusBarHeight,
    userId: '',
    expertsLevelEntity:[],
    infoBg:'',
    medal:'',
    paddingBottom:0,
    tempFilePathsList:[],
    avatar:"",
    userInfo:[],
    grade:'',
    bottomPromptStatus:true,
    bottomPromptTitle: '',
    bottomPromptText: '',
    btnText: '',
    bottomBtnType:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var userId = wx.getStorageSync('userId');
    var userInfo = wx.getStorageSync('userInfo');
    var grade = wx.getStorageSync('grade');
    that.setData({
      userId: userId,
      userInfo: userInfo,
      grade: grade
    })
    
    console.log(options)
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
    var userInfo = wx.getStorageSync('userInfo');
    that.setData({
      userInfo: userInfo
    })
    that.queryExpertsLevelEntity();
  },
  queryExpertsLevelEntity:function(){
    var that = this;
    var data = {
      'userId':that.data.userId
    }
    var url = app.globalData.shopPath + '/app/user/level';
    HttpUtil.post(url,data).then((res) => {
      if(res.data.entity != null){
        console.log(res.data.entity)
        var infoBg = res.data.entity.imgUrl.split('#')[1];
        var medal = res.data.entity.imgUrl.split('#')[0];
        that.setData({
          expertsLevelEntity:res.data.entity,
          infoBg: infoBg,
          medal: medal
        })
      }
    })
  },
  openPrompt:function(){
    var that = this;
    var grade= that.data.grade;
    var title='';
    var type='';
    if (grade == '1'){
      title='铜牌专家';
      type ='copper'
    }
    if (grade == '2') {
      title = '银牌专家';
      type = 'silver'
    }
    if (grade == '3') {
      title = '金牌专家';
      type = 'gold'
    }
    Common.bottomPrompt(that, title, type, '在名片上彰显你的新西兰旅游专家身份，帮助你更专业的服务客户', '保存到我的相册', 'download')
  },
  // 提示框消失动画
  hidden: function() {
    var that = this;
    var animation = wx.createAnimation({
      duration: 900,
      timingFunction: 'linear',
      delay: 1000
    });
    animation.opacity(0).step()
  that.setData({
      animationData: animation.export()
    })
  },
 show: function() {
   var that = this;
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear',
      delay: 1000
    });
    animation.opacity(1).step()
    that.setData({
      animationData: animation.export()
    })
  },
  // 下载徽章
  downloadBadge: function () {
    var that = this;
    var grade = that.data.grade;
    var title = '';
    var type = '';
    if (grade == '1') {
      title = '铜牌专家';
      type = 'copper'
    }
    if (grade == '2') {
      title = '银牌专家';
      type = 'silver'
    }
    if (grade == '3') {
      title = '金牌专家';
      type = 'gold'
    }
    if (that.data.bottomBtnType == 'course') {
      setTimeout(() => {
        that.setData({
          bottomPromptStatus: true,
          bottomPromptText: '',
          btnText: '',
        })
        that.show();
      }, 2000)
    }

    // if (that.data.bottomBtnType == 'download') {
    //that.hidden();
    //   setTimeout(() => {
    //     that.hidden();

    //     that.setData({
    //       bottomPromptStatus: true,
    //       bottomPromptText: '',
    //       btnText: '',
    //     })
    //     that.show();
    //   }, 2000)
    // }
    if (that.data.bottomBtnType == 'download') {
    console.log(111)
    var imageUrl = that.data.imagePath + that.data.medal;
    wx.downloadFile({
      url: imageUrl,
      success: function (res) {
        //图片保存到本地
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (data) {
            
            wx.hideLoading()
            // wx.showModal({
            //   title: '提示',
            //   content: '您的个人证书已存入手机相册，赶快分享给好友吧',
            //   showCancel: false,
            // })
            Common.bottomPrompt(that, title, type, '在名片上彰显你的新西兰旅游专家身份，帮助你更专业的服务客户', '保存成功!', 'download');

            setTimeout(() => {
              that.hidden();

              that.setData({
                bottomPromptStatus: true,
                bottomPromptText: '',
                btnText: '',
              })
              that.show();
            }, 2000)
          },
          fail: function (err) {
            if (err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              // 这边微信做过调整，必须要在按钮中触发，因此需要在弹框回调中进行调用
              wx.showModal({
                title: '提示',
                content: '需要您授权保存相册',
                showCancel: false,
                success: modalSuccess => {
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
                      console.log("failData", failData)
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
  },
  // 跳转基础课程页面
  skipCourse:function(){
    getApp().globalData.currentTab = 0
    wx.switchTab({
      url:'../NZSP_course/NZSP_course'
    })
  },
  // 跳转活动页面
  skipActivity:function(){
    wx.switchTab({
      url: '../activity_show/activity_show'
    })
  },
  // 上传凭证
  uploadDocuments:function(e){
    console.log(e)
    var that = this;
    var isNull = e.currentTarget.dataset.isnull;
    console.log(isNull)
    if (isNull == 'no'){
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {

          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var tempFilePaths = res.tempFilePaths;
          that.setData({
            tempFilePathsList: tempFilePaths
          })
          wx.navigateTo({
            url: '../credentials/credentials?userId=' + that.data.userId + '&imageUrl=' + tempFilePaths + '&type=' + 'skip'
              + '&isNull=' + isNull,
          })
          // that.uploadPhotoInfo(tempFilePaths)
        }
      })
    }else{
      wx.navigateTo({
        url: '../credentials/credentials?userId=' + that.data.userId + '&type=' + 'skip' + '&isNull=' + isNull,
      })
    }
      
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
  //分享触发的事件
  onShareAppMessage: function (e) {
    if (e.from === 'button') {
      // 来自页面内转发按钮
      // console.log(ops.target)
    }
    return {
      title: '开启新西兰旅游专家之旅吧',
      // path: 'pages/activity/activity?id=that.data.id&userId=that.data.userId',  // 路径，传递参数到指定页面 shareImg。
      imageUrl: 'https://nzsplvs--img.oss-cn-shanghai.aliyuncs.com/20190905/course/MP_Share_Pic.jpg',// 分享的封面图
      path: '/pages/first_index/first_index',
      success: function (res) {

      },
      fail: function (res) {

      }
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

 
})
var HttpUtil = require('../../utils/httpUtil.js');
var Common = require('../../utils/common.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    userInfoEntity:[],
    medelImg:[],
    lightenNum:[],
    medelName:[],
    medelStatus:[],
    courseIds:[],
    courseId:'',
    imagePath: app.globalData.imagePath,
    userId: '',
    promptHeight:0,
    promptImg:'',
    skipFlag:'basics',
    grade:'',
    bottomPromptStatus: true,
    bottomPromptTitle: '',
    bottomPromptText: '',
    btnText: '',
    bottomBtnType: '',
    bottomPromptType:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      userId:options.userId
    })
    that.queryUserInfo();
    let height = wx.getSystemInfoSync().windowHeight;
    that.setData({
      promptHeight: height
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
    let that = this;
    that.queryUserInfo();
    var grade = parseInt(wx.getStorageSync('grade'));
    that.setData({
      grade:grade
    })
  },
  disappear:function(){
    let that = this;
    that.setData({
      bottomPromptStatus:true
    })
  },
  queryUserInfo: function () {
    let that = this;
    var medelImg = [];
    // 勋章攻略
    var medelName = [];
    var lightenNum = [];
    var medelStatus = [];
    var courseIds = [];
    var lightFalg = [];
    var data = {
      'userId': that.data.userId
    }
    var url = app.globalData.shopPath + '/app/user/list';
    HttpUtil.post(url, data).then((res) => {
      if (res.data.entity != null) {
        console.log(res.data.entity)
        for (var i = 0; i < res.data.entity.medal.length; i++) {
          var item = res.data.entity.medal[i].split('#');
          medelImg.push(item[0]);
          // 勋章攻略
          medelName.push(item[1]);
          var lighten = item[2];
          courseIds.push(item[3])
          medelStatus.push(lighten)
          if (lighten == 1) {
            lightenNum.push(lighten)
          }
        }
        that.setData({
          userInfoEntity: res.data.entity,
          medelImg: medelImg,
          medelName: medelName,
          lightenNum: lightenNum,
          medelStatus: medelStatus,
          courseIds: courseIds,
        })
      }
    })
  },

  remind: function (e){
    var that = this;
    var grade = that.data.grade;
    var index = parseInt(e.currentTarget.dataset.index);
    var status = e.currentTarget.dataset.status;
    var image = that.data.medelImg[index];
    var courseId = that.data.courseIds[index];
    var medelName = that.data.medelName[index];
    var unitIndex = index+1;
    var userId = that.data.userId;
    console.log(grade)
    console.log(status)
    that.setData({
      promptImg: image,
      courseId: courseId
    })
    if (grade == 0 && status == '0'){
      that.setData({
        skipFlag:'basics'
      })
      Common.bottomPrompt(that, '解锁资格', 'qualification', '需完成11单元的基础课程，才能解锁进阶单元和勋章',
      '进入基础课程','course')
    }
    if (grade > 0 && status == '0'){
      that.setData({
        skipFlag: 'advance'
      })
      Common.bottomPrompt(that, '你还未获得该勋章', 'custom', '需要完成进阶-第' + unitIndex + '单元的课程，才能开始解锁“' + medelName +'”勋章。',
        '进入进阶课程', 'course')
    }
    if (grade > 0 && status == '1'){
      wx.navigateTo({
        url: '../section/section?id=' + courseId + '&userId=' + userId,
      })
    }
  },

  skipCourse: function () {
    var that = this;
    var userId = that.data.userId;
    var courseId = that.data.courseId;
    var skipFlag = that.data.skipFlag;
    console.log(skipFlag)
    that.setData({
      bottomPromptStatus:true
    })
    if (skipFlag == 'advance'){
      wx.navigateTo({
        url: '../section/section?id=' + courseId + '&userId=' + userId,
      })
    }
    if (skipFlag == 'basics'){
      getApp().globalData.currentTab = 0
      wx.switchTab({
        url: '../NZSP_course/NZSP_course'
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },


})
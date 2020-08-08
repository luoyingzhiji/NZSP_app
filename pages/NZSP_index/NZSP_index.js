
var HttpUtil = require('../../utils/httpUtil.js');
var Common = require('../../utils/common.js');
var app = getApp();
var util = require('../../utils/util.js');
var formIdUtil = require('../../utils/formId.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imagePath: app.globalData.imagePath,
    statusBarHeight: app.globalData.statusBarHeight,
    // 是否已经开始学习
    startStudy:false,
    // 是否已经登录
    userLogin:true,
    // 是否是专家
    expert:true,
    // 前边距
    frontMargin:0,
    // 后边距
    behindMargin:0,
    // 首页轮播
    miniHomeBanner:[],
    // 当季推荐
    miniRecommendedBanner:[],
    activity:[],
    activityStatus:false,
    timeS: false,
    miniCourseImg:[],
    endTime:'',
    startTime:'',
    nowTime:'',
    startTime2:'',
    advanceNum:0,
    basicsNum:0,
    reviewaBasicsNum:0,
    reviewaDvanceNum:0,
    userId: '',
    chooseStatus:'',
    loginStatus:false,
    userInfo:'',
    grade:'',
    isShot:'',
    bottomPromptStatus: true,
    bottomPromptTitle: '',
    bottomPromptText: '',
    btnText: '',
    bottomBtnType: '',
    bottomPromptType: '',

    upgradeStatus:true,
    text: '',
    type: '',
    winHeight: 0,
    miniBanner:[],
    //通过学习小节
    barShow:'',
     barShowOne:'',
    url:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.queryIndex();
    let winHeight = wx.getSystemInfoSync().windowHeight;
    var chooseStatus = wx.getStorageSync('chooseStatus');
    var userId = wx.getStorageSync('userId');
    var userInfo = wx.getStorageSync('userInfo');
    var grade = parseInt(wx.getStorageSync('grade'));
    var isShot = wx.getStorageSync('isShot');
    console.log(isShot)
    var txs='';
    if (grade==1){

      txs="铜牌"
    }
    if (grade == 2) {
      txs = "银牌"
    }
    if (grade == 3) {
      txs = "金牌"
    }
    var mobile = wx.getStorageSync('mobile');

    let dateStr = util.formatTime(new Date());
    var currentTime = util.formatDate(dateStr, 'YMD');
    var loginTime = wx.getStorageSync(currentTime);
    console.log(userInfo)
    that.setData({
      chooseStatus: chooseStatus,
      userId: userId,
      userInfo: userInfo,
      grade: grade,
      isShot: isShot,
    })
    var userName = userInfo.realName;

    var text = '你已经是新西兰旅游' + txs + '专家，快来探索更多培训课程和活动';
    var text1 = '快来探索更多培训课程';
    if (mobile != undefined && chooseStatus == 'experts' && isShot == 'true'){
      console.log('金牌弹窗')
      Common.expertsUpgrade(that, grade, '恭喜你上传凭证已通过验证，升级为金牌专家！', winHeight);
    }
    // if (loginTime == '' && grade != 3){
    if (loginTime == '') {
      
      wx.setStorageSync(currentTime, currentTime);
      if (grade > 0 && mobile != undefined && mobile != '' && chooseStatus == 'experts' && isShot == 'false') {
        console.log('专家弹窗')
        Common.bottomPrompt(that, userName + '，欢迎回来!', 'userLogin', text, '好的', 'course')
      }
    }
    if (loginTime == '' && mobile != undefined && mobile != '' && chooseStatus == 'hobby') {
      wx.setStorageSync(currentTime, currentTime);
      Common.bottomPrompt(that, userName + '，欢迎回来!', 'userLogin', text1, '好的', 'course')
    }
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          countries: res.language
        })
      }
    })
    console.log(that.data.countries)
    wx.setStorageSync('countries', that.data.countries);
  },
  queryIndex:function(){
    var that = this;
    var data = {
      userId: that.data.userId
    };

    var url = app.globalData.shopPath + '/app/index';

    HttpUtil.post(url, data).then((res) => {
      if(res.data.entity != null){
        console.log(res.data.entity)
        var that = this;
        if (res.data.entity.basics < 9) {
         var basicsNum='0' + res.data.entity.basics;
        }else{
          var basicsNum = res.data.entity.basics;
        }
        if (res.data.entity.advance < 9) {
          var advanceNum = '0' + res.data.entity.advance;
        } else {
          var advanceNum = res.data.entity.advance;
        }

        if (res.data.entity.activity.startTimeStr!=undefined){
          var startTime2= Date.parse(new Date(res.data.entity.activity.startTimeStr.replace(/-/g, "/")));
        }
        // 爱好者banned
        var miniHomeBanner = res.data.entity.miniHomeBanner;
        var miniBanner=[];
        for ( let miniBanner1 of miniHomeBanner){
          if (miniBanner1.isLook=='yes'){
            miniBanner.push(miniBanner1);
          }
         }
        that.setData({
          //从页
          miniHomeBanner: miniHomeBanner,
          //爱好
          miniBanner: miniBanner,
          isLook: res.data.entity.isLook,
          miniRecommendedBanner: res.data.entity.miniRecommendedBanner,
          activity: res.data.entity.activity,
          advanceNum: advanceNum,
          basicsNum: basicsNum,
          reviewaDvanceNum: res.data.entity.reviewaDvanceNum,
          reviewaBasicsNum: res.data.entity.reviewaBasicsNum,
          //判断是否正在学习（通过小节）
          barShow: res.data.entity.basicsShow,
          barShowOne: res.data.entity.advanceShow,
          //判断结束
          reviewaDvanceNum: res.data.entity.reviewaDvanceNum,
          miniCourseImg: res.data.entity.miniCourseImg,
          startTime: util.formatDate(res.data.entity.activity.startTimeStr, 'M.D'),
          endTime: util.formatDate(res.data.entity.activity.endTimeStr, 'M.D'),
          startTime2: startTime2,
          nowTime: Date.parse(new Date()),
        })
      }
      if (that.data.nowTime < that.data.startTime2){
        that.setData({
          timeS: true
        })

      }
      if (that.data.activity.id == -1 || that.data.chooseStatus == 'hobby') {
        that.setData({
          activityStatus: true
        })
      }
    })
  },
  skipRegistered:function(e){
    var that = this;
    if (that.data.chooseStatus==''){
      wx.redirectTo({
        url: '../first_index/first_index',
      })
      return
    }
    if (e.detail.iv == undefined) {//没有授权
      var url = '../NZSP_index/NZSP_index';
      var type = 'tabber';
      wx.navigateTo({
        url: '../authorization/authorization?url=' + url + '&type=' + type,
      })
    }
    return

  },
  // 弹窗返回
  returnBtn: function (that) {
    var that = this;
    wx.removeStorage({
      key: 'isShot',
      success(res) {
        Common.returnBtn(that)
      }
    })
    
  },
  // 弹窗查看详情
  detailsBtn: function () {
    var that = this;
    wx.removeStorage({
      key: 'isShot',
      success(res) {
        Common.detailsBtn(that)
      }
    })
    
  },
  // 活动查看全部
  skipActivity:function(){
    wx.switchTab({
      url:'../activity_show/activity_show'
    })
  },
  skipActivityInfo:function(){
    var that = this;
    wx.navigateTo({
      url: '../activity/activity?id=' + that.data.activity.id,
    })
  },
  // banner跳转外链
  bannerSkip:function(e){
    var moreurl = e.currentTarget.dataset.moreurl;
    // var moreurl = "e.currentTarget.dataset.moreurl";
    var skiptype = e.currentTarget.dataset.skiptype;
    if (skiptype == '2'){
      wx.navigateTo({
        url: '../view/view?url=' + moreurl,
      })
    }
    if (skiptype == '5') {
       moreurl = moreurl.replace(/=/g, '%%');
      wx.navigateTo({
        url: '../view/view?url=' + moreurl,
      })
    }
    if (skiptype == '3'){
      wx.navigateTo({
        url: '../activity/activity?id=' + moreurl,
      })
    }
    if (skiptype == '4') {
      if (moreurl == '../NZSP_index/NZSP_index' || moreurl == '../NZSP_course/NZSP_course' || moreurl == '../activity_show/activity_show' || moreurl == '../my/my'){
        wx.switchTab({
          url: moreurl,
        })
      }else{
        wx.navigateTo({
          url: moreurl,
        })
      }
    }
  },
  // 当季推荐跳转外链
  recommendedSkip:function(e){
    var moreurl = e.currentTarget.dataset.moreurl;
        moreurl = moreurl.replace(/=/g, '%%');
        wx.navigateTo({
          url: '../view/view?url=' + moreurl,
        })
  },
  // 基础课程开始学习
  basicsStartStudy:function(){
    getApp().globalData.currentTab = 0
    wx.switchTab({
      url:'../NZSP_course/NZSP_course'
    })
  },

  disappear:function(){
    var that = this;
    that.setData({
      bottomPromptStatus: true,
    })
  },

  skipCourse:function(){
    var that = this;
    if (that.data.chooseStatus =="experts"){
      that.advanceStartStudy();
    }else{
      getApp().globalData.currentTab = 0;
      wx.switchTab({
        url: '../NZSP_course/NZSP_course'
      })
    }
  },
  // 进阶课程开始学习
  advanceStartStudy: function () {
    var that = this;
    // if (that.data.reviewaBasicsNum == that.data.basicsNum){
      getApp().globalData.currentTab = 1
      wx.switchTab({
        url: '../NZSP_course/NZSP_course'
      })
    // }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //推送消息
  formSubmit: function (e) {
    formIdUtil.saveFormId(e, app);
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
    var mobile = wx.getStorageSync('mobile');
    if (mobile != undefined && mobile != '') {
      that.setData({
        loginStatus: true,
      })
    }
    that.queryIndex();
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

  /**
   * 生命周期函数--监听页面加载
   */
  //分享触发的事件
  onShareAppMessage: function (e) {

    return {
      title: "开启新西兰旅游专家之旅吧",
      imageUrl: 'https://nzsplvs--img.oss-cn-shanghai.aliyuncs.com/20190905/course/MP_Share_Pic.jpg',// 分享的封面图
      success: function (res) {

      },
      fail: function (res) {

      }
    }

  },
  //分享触发的事件
  onShareAppMessage: function (e) {
    var that = this;
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
})

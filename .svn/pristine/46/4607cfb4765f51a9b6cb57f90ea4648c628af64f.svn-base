var HttpUtil = require('../../utils/httpUtil.js');
var util = require('../../utils/util.js');
var Common = require('../../utils/common.js');
var app = getApp();
const innerAudioContext = wx.createInnerAudioContext();
innerAudioContext.obeyMuteSwitch = false;
var src = "";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    courseId: 0,
    type:'advance',
    resultList:[],
    graspList:[],
    //自定义音频地址
    
    isplay: false,
    nowTime: "00:00",
    totalTime: "",
    title: '',
    sliderValue: 0,
    playIndex: -1,
    total: 0,
    audiosrc:'',
    musicName:'',
    // total:'',

    //结束
    imagePath: app.globalData.imagePath,
    type:'',
    courseName:'',
    widths:0,
    studyProgress:0,
    upgradeStatus:true,
    winHeight:0,
    grade:0,
    userId:'',
    btnStatus:true,
    winHeight:0,
    chooseStatus: '',
    resultCourseId:0,
    level:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    let winWidths = wx.getSystemInfoSync().windowWidth;
    let winHeight = wx.getSystemInfoSync().windowHeight;
    var grade = parseInt(wx.getStorageSync('grade'));
    var userId = wx.getStorageSync('userId');
    var chooseStatus = wx.getStorageSync('chooseStatus');
    that.setData({
      userId: userId,
      courseId: options.courseId,
      widths: winWidths-38,
      grade: grade,
      winHeight: winHeight,
      chooseStatus: chooseStatus
    })
    that.queryConclusion();  
  },
//总结详情
  queryConclusion:function(){
    var that = this;
    var data = {
      'userId': that.data.userId,
      'courseId': that.data.courseId,
    }
    var url = app.globalData.shopPath + '/app/course/conclusion';
    HttpUtil.post(url, data).then((res) => {
      if(res.data.entity != null){
        console.log(res.data.entity)
        that.setData({
          courseName: res.data.entity.courseName,
          medalName: res.data.entity.medalName,
          medalUrl: res.data.entity.medalUrl,
          resultCourseId: res.data.entity.resultCourseId,
          audiosrc: app.globalData.audioPath + res.data.entity.musicUrl,
          musicName: res.data.entity.musicName,
          graspList: res.data.entity.courseDtoList,
          level: res.data.entity.level,
          type: res.data.entity.type,
        })
        that.onLIst();
        if (that.data.type == 'basics' && that.data.level == 'level'&&that.data.grade==0){
          var grade = that.data.grade+1;
          wx.setStorageSync('grade', grade);  
          if (that.data.chooseStatus == 'experts'){
            Common.expertsUpgrade(that, grade, '恭喜你完成基础课程的学习，升级为铜牌专家！', that.data.winHeight);
           }        
        }  
      }
    })
  },
  //监听音频
 onLIst(){
   var that = this;
   //通过获取音频路径
   let srcS = that.data.audiosrc;
   //音频路径（先监听在点击）
   innerAudioContext.src = srcS;
   innerAudioContext.title = that.data.musicName;
  //首先准备就绪后才能获取总时长（监听音频进入可以播放状态的事件）
   innerAudioContext.onCanplay(() => {
       innerAudioContext.play();
     innerAudioContext.duration;
      setTimeout(function () {
        //总时长
          var total = parseInt(innerAudioContext.duration);
        that.setData({
          total: total,
          "totalTime": util.timeToText(total),
        })
          innerAudioContext.pause();
      }, 1000);
   })
 },
 //音频播放
  //播放
  playaudio: function (e) {
    var that = this;
    innerAudioContext.play();
    setTimeout(function () {
      //总时长
      var total = parseInt(innerAudioContext.duration);
      that.setData({
        total: total,
        "totalTime": util.timeToText(total),
      })
    }, 1000);
   
    if (that.data.isplay) {
      that.setData({
        isplay: false,
      }, function () {
        innerAudioContext.pause();

      })
    }else{
      that.setData({
        isplay: true,
      }, function () {
        innerAudioContext.play();
      })
    }
    //更新进度
    innerAudioContext.onTimeUpdate(() => {
      //进度时长
      var per = parseInt(innerAudioContext.currentTime);
      //进度条
      // var slider = (per / that.data.total) * 100;
      // innerAudioContext.onEnded
      that.setData({
        sliderValue: per,
        nowTime: util.timeToText(per),
      })
    })
    innerAudioContext.onEnded(() => {
      that.setData({
        isplay: false,
        sliderValue: 0,
        nowTime:'00:00'
      });
      innerAudioContext.offEnded();
      innerAudioContext.offTimeUpdate();
    })
  },
  //音频拖动
  //拖动过程中
  sliderChangeIng:function(e){
    var that = this;
    innerAudioContext.pause();
    if (that.data.isplay == true) {
    innerAudioContext.seek(e.detail.value);
    }
  },
  sliderChange: function (e){
    var that = this;
    if(that.data.isplay==true){
      innerAudioContext.seek(e.detail.value);
      innerAudioContext.play();
    }else{
      that.setData({
        sliderValue: 0,
      })
    }
  },
  
  onReady: function () {
  },
  // 继续学习下一章
  skipNextChapter:function(){
    var that = this;
    if (that.data.type == 'basics' && that.data.level != 'level'){
      wx.redirectTo({
        url: '../section/section?userId=' + that.data.userId + '&id=' + that.data.resultCourseId
        })
    }
    if (that.data.type == 'basics' && that.data.level == 'level') {
      getApp().globalData.currentTab = 0
      wx.switchTab({
        url: '../NZSP_course/NZSP_course',
      })
    }
    if (that.data.type != 'basics') {
        getApp().globalData.currentTab = 1
        wx.switchTab({
          url: '../NZSP_course/NZSP_course',
        })
    }
  },
  // 返回课程中心
  skipIndex:function(){
    var that = this;
    if (that.data.type == 'basics') {
      getApp().globalData.currentTab = 0
    } else {
      getApp().globalData.currentTab = 1
    }
    wx.switchTab({
      url: '../NZSP_course/NZSP_course'
    })
  },
  // 弹窗返回
  returnBtn:function(that){
    var that = this;
    Common.returnBtn(that)
  },
  // 弹窗查看详情
  detailsBtn:function(){
    var that = this;
    Common.detailsBtn(that)
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
    innerAudioContext.stop();
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
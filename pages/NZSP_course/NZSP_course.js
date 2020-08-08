var HttpUtil = require('../../utils/httpUtil.js');
var formIdUtil = require('../../utils/formId.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imagePath:app.globalData.imagePath,
    isIphoneX: app.globalData.isIphoneX,
    percentage:0,
    currentTab: app.globalData.currentTab,
    statusBarHeight: app.globalData.statusBarHeight,
    bannerHidden:false,
    // 基础课程
    basicsCourseList: [],
    // 进阶课程
    advanceCourseList:[],
    userId: '',
    basicsStudyUnlock:0,
    advanceStudyUnlock:0,
    winHeight: "",//窗口高度
    borderBottomLeft:0,
    basicsLeft:122,
    advanceLeft:498,
    chooseStatus:'',
    mobile:'',
    grade:'',
    viewHeight:0,
    loginStatus:true,
    scrollViewHeight:0,
    progressUp:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
 
    var that = this;
    var query = wx.createSelectorQuery().in(this);
    var borderBottomLeft;
    that.queryBasicsCourse();
    that.queryAdvanceCourse();
    var chooseStatus = wx.getStorageSync('chooseStatus');
    var userId = wx.getStorageSync('userId');
    
    var viewWidth = wx.getSystemInfoSync().windowWidth;
    var viewHeight = wx.getSystemInfoSync().windowHeight;

    let systemInfo = wx.getSystemInfoSync();
    // scroll-View的高度
    let scrollViewHeight = viewHeight - app.globalData.statusBarHeight - 45;


    that.setData({
      scrollViewHeight: scrollViewHeight
    });

    borderBottomLeft = (viewWidth / 2 - 66) / 2;
    
    that.setData({
      chooseStatus: chooseStatus,
      userId: userId,
      borderBottomLeft: borderBottomLeft,
      viewHeight: viewHeight
    });

    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        let clientHeight = (res.windowHeight - app.globalData.statusBarHeight) * 2;
        that.setData({
          winHeight: clientHeight
        });
      }
    });
  },
  queryBasicsCourse:function(){
    var that = this;
    var data = {
      'type':'basics',
      'userId': that.data.userId
    };
    var url = app.globalData.shopPath + '/app/course/list';
    HttpUtil.post(url,data).then((res) => {
      if(res.data.entity != null){
        that.setData({
          basicsCourseList: res.data.entity.courseList,
        });
        var basicsCourse = that.data.basicsCourseList;
        for (var i = 0; i < basicsCourse.length;i++){
          var basics = basicsCourse[i]
         
          if (basics.percentage<100){
            var progressUp1 = (i/ basicsCourse.length)*100;
            that.setData({
              basicsStudyUnlock:i,
              progressUp: progressUp1,
            })
            break
          }
          if (i + 1 == basicsCourse.length){
           
          
            that.setData({
              basicsStudyUnlock: basicsCourse.length,
              progressUp:100,
            })
            break
          }
       }
      }
    })
  },
  queryAdvanceCourse: function () {
    var that = this;
    var data = {
      'type': 'advance',
      'userId': that.data.userId
    };
    var url = app.globalData.shopPath + '/app/course/list';
    HttpUtil.post(url, data).then((res) => {
      if (res.data.entity != null) {
        that.setData({
          advanceCourseList: res.data.entity.courseList,
        })
        var advanceProgress = [];
        var advanceCourse = that.data.advanceCourseList
      }
    })

  },
  // 顶部导航点击切换
  clickTab: function (e) {
    console.log(e)
    var basicsLeft = e.currentTarget.offsetLeft;
    var that = this;
    var currentTab = this.data.currentTab
    if (currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
      })
    }
      var animation = wx.createAnimation({
        duration: 300,
        timingFunction: 'linear',
        delay: 0
      });
      animation.left(basicsLeft).step()
      that.setData({
        animationData: animation.export()
      })
  },

  courseSkip:function(e){
    var that = this;
    var id = e.currentTarget.dataset.id;
    var sectionNum = e.currentTarget.dataset.sectionNum;
    var index = e.currentTarget.dataset.index + 1;
    var userId = that.data.userId;
    var mobile = that.data.mobile;
    var basicsStudyUnlock = that.data.basicsStudyUnlock;
    if (basicsStudyUnlock >= sectionNum - 1) {
        wx.navigateTo({
          url: '../section/section?id=' + id + '&sectionNum=' +
            sectionNum + '&userId=' + userId + '&basicsLength=' + that.data.basicsCourseList.length + '&chapterIndex=' 
            + index,
        })
    }
  },
  
  // 跳转登录
  skipRegister:function(e){
    if (e.detail.iv == undefined) {//没有授权
      var url = '../NZSP_course/NZSP_course';
      var type = 'tabber';
        wx.navigateTo({
          url: '../authorization/authorization?url=' + url + '&type=' + type,
        })
    }
  },

  // 前往基础课程
  skipBasicsCourse:function(){
    var that = this;
    that.setData({
      currentTab:0
    })
  },
  skipAdvance:function(e){
    var that = this;
    var mobile = that.data.mobile;
    var userId = that.data.userId;
    var id = e.currentTarget.dataset.id;
    var sectionNum = e.currentTarget.dataset.sectionNum;
    console.log(sectionNum)
    
    wx.navigateTo({
        url: '../section/section?id=' + id + '&sectionNum=' +
          sectionNum + '&userId=' + userId,
      })
  },
  switchTab: function (e) {
    var systemInfo = wx.getSystemInfoSync();
    let that = this;
    var basicsLeft = that.data.basicsLeft;
    var advanceLeft = that.data.advanceLeft;
    var currentTab = e.detail.current;
    getApp().globalData.currentTab = e.detail.current
    that.setData({
      currentTab: e.detail.current,
    })
    if (currentTab == 0){
      var animation = wx.createAnimation({
        duration: 300,
        timingFunction: 'linear',
        delay: 0
      });
      animation.left(basicsLeft / 750 * systemInfo.windowWidth).step()
      that.setData({
        animationData: animation.export()
      })
    }
    if (currentTab == 1){
      var animation = wx.createAnimation({
        duration: 300,
        timingFunction: 'linear',
        delay: 0
      });
      animation.left(advanceLeft / 750 * systemInfo.windowWidth).step()
      that.setData({
        animationData: animation.export()
      })
    }
    
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
    that.setData({
      currentTab: getApp().globalData.currentTab,
    })
    var grade = wx.getStorageSync('grade');
    var mobile = wx.getStorageSync('mobile');
    if (mobile != '' && mobile != undefined){
      that.setData({
        loginStatus: true,
      })
    }else{
      that.setData({
        loginStatus: false,
      })
    }
    that.setData({
      mobile: mobile,
      grade: grade,
    })
    that.queryBasicsCourse()
    that.queryAdvanceCourse()
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
  // onPullDownRefresh: function () {
    
  // },

  /**
   * 页面上拉触底事件的处理函数
   */
  // onReachBottom: function () {
    
  // },


})
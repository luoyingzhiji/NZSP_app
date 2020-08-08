var WxParse = require('../../wxParse/wxParse.js');
var util = require('../../utils/util.js');
var MD5 = require('../../utils/md5.js');
var Common = require('../../utils/common.js');
var Favorite = require('../../utils/favorite.js');
var Comment = require('../../utils/comment.js');
var HttpUtil = require('../../utils/httpUtil.js');
var formIdUtil = require('../../utils/formId.js');
var app = getApp();
Page({
  
  data: {
    mainPath: app.globalData.mainPath,
    userPath: app.globalData.userPath,
    imagePath: app.globalData.imagePath,
    shopPath: app.globalData.shopPath,
    isIphoneX: app.globalData.isIphoneX,
    statusBarHeight: app.globalData.statusBarHeight,
    promptStatus: true,
    activityInfo:"",
    banner:"",
    name:"",
    address:"",
    isShow:'',
    countNum:0,
    surplusNum:0,
    startTimeStr:"",
    endTimeStr:"",
    startTimeStrHm:"",
    endTimeStrHm:"",
    detailedAddress:"",
    id: 0,
    time:0,
    longitude:"",
    latitude:"",
    userId:'',
    immediately:0,
    count:0,
    mobile:"",
    immediately1:0,
    //是否显示报名按钮（后台手动）
    isApply:'',
    //等级
    grade:0,
    //判断取消取消报名弹窗
    cancelName:0,
    specialist:0,
    operationPromptStatus:true,
    operationPromptType:'',
    operationPromptText:'',
    btnStatus:'',
    // 获取专家资格弹窗
    bottomPromptStatus: true,
    bottomPromptType: '',
    bottomPromptText: '',
    bottomPromptTitle:'',
    //签到
    sign:'',
    chooseStatus:'',
    winHeight:0,
    upgradeStatus:true,
    examPromtStatus: true,
    promptWindowHeight:0,
    bottomPromptTitle:'',
    openId:'',
    formId:'',
    // 报名成功弹窗
    examPromtStatus: true,
    examPromtType: '',
    examPromtText: '',
    examPromtTitle: '',
    promptWindowHeight: 0,
    btnStatus: '',
    sts:0,
    addressShow:true,
    // atyShow:false,
  },
  onLoad: function (options) {
    // debugger
    let that =this;
    let winHeight = wx.getSystemInfoSync().windowHeight;
    var chooseStatus = wx.getStorageSync('chooseStatus');
    var value = wx.getStorageSync('userId');
    var value1 = wx.getStorageSync('mobile');
    var value2 = wx.getStorageSync('grade');
    var openId = wx.getStorageSync('openId');
    let Height = wx.getSystemInfoSync().windowHeight;
   
    that.setData({
      userId:value,
      id: options.id,
      mobile: value1,
      grade: value2,
      sign: options.sign,
      promptWindowHeight: winHeight,
      winHeight: winHeight,
      chooseStatus: chooseStatus,
      openId: openId,
    });
    if (options.sign == 'sign') {
      that.sign();
    }else{
      that.queryActivityInfo();
    }
  },
  
  queryActivityInfo() {
    var that = this
    that.setData({
      noData: true, 
      searchLoading: false,
      searchLoadingComplete: true 
    });

    var data = {
       id:that.data.id,
       userId:that.data.userId,
    }
   
    var url = app.globalData.shopPath + '/app/activity/info';
    HttpUtil.post(url, data).then((res) => {
      var that = this;
      that.setData({
        searchLoading: true 
      });
      if (!res.data.success) {
        that.setData({
          loadingFail: false 
        });
        return;
      }
      //已报名人数
      var activityT = res.data.entity.activity;
      var countN = activityT.countNum - activityT.surplusNum;
      var nowTime = Date.parse(new Date());
      var startTime = Date.parse(new Date(activityT.startTime.replace(/-/g, "/")));
      var endTime = Date.parse(new Date(activityT.endTime.replace(/-/g, "/")));
      if (nowTime < startTime) {
        that.setData({
          time:0
        })
      }
      if (startTime <= nowTime && nowTime <= endTime) {
        that.setData({
          time: 1
        })
      }
      if (nowTime > endTime) {
        that.setData({
          time: 2
        })
      }
      
      if (activityT.detailedAddress == '' || activityT.detailedAddress == null || activityT.detailedAddress==undefined){
        that.setData({
          addressShow: false,
        })
      }
      that.setData({
        banner: activityT.banner,
        name: activityT.name,
        countNum: countN,
        address: activityT.address,
        isShow:activityT.isShow,
        detailedAddress: activityT.detailedAddress,
        surplusNum: activityT.surplusNum,
        startTimeStr: activityT.startTimeStr,
        endTimeStr: activityT.endTimeStr,
        startTimeStrHm: activityT.startTimeStrHm,
        endTimeStrHm: activityT.endTimeStrHm,
        count: res.data.entity.count,
        longitude: activityT.longitude,
        latitude: activityT.latitude,
        isApply: activityT.isApply,
        // atyShow:true,
      });
       //不能报名的状态
      if (that.data.count!=0){
        that.setData({
          immediately: 1,
        });
      };
      var content1 = res.data.entity.activity.bright;
      if (content1 != null && content1 != '') {
        var content = content1.replace(/#imagePath#/g, that.data.imagePath);
        WxParse.wxParse('activityContent', 'html', content, that, 20);
      }
      var content = res.data.entity.activity.content;
      if (content != null && content != '') {
        var content = content.replace(/#imagePath#/g, that.data.imagePath);
        WxParse.wxParse('activityContentTwo', 'html', content, that, 20);
      }
    }).catch((errMsg) => {
      var that = this;
      Common.dialog(that, errMsg); //错误提示信息
    });
  },
  //推送消息
  formSubmit: function (e) {
    var that = this;
    formIdUtil.saveFormId(e, app);
    console.log(e.detail.formId)
    if (that.data.immediately!=1){
      var data = {
        'userId': that.data.userId,
        'activityId': that.data.id,
        'formId': e.detail.formId,
      }
      var url = app.globalData.shopPath + '/app/userActivity/send';
      HttpUtil.post(url, data).then((res) => {
      }).catch((errMsg) => {
        var that = this;
        // Common.dialog(that, errMsg); //错误提示信息
      });
    }else{
      that.setData({
        formId: e.detail.formId,
      });
    }
    
  },
  //签到
  sign:function(e){
    //判断是否跳到签到（sign用于区别是否执行签到）
    var that = this;
    that.queryActivityInfo();
    var mobile = that.data.mobile;
   
    //注册过（签到）
    if (that.data.sign == "sign" &&(mobile != ''&&mobile != undefined)){
      if (that.data.grade==1&& that.data.chooseStatus == 'experts') {
            var  data={
              userId: that.data.userId,
              activityId: that.data.id,
              // activityId:45,
            }   
        var url = app.globalData.shopPath + '/app/userAudit/userUpgradeGold';
          HttpUtil.post(url, data).then((res) => {
            Common.expertsUpgrade(that, 2, '恭喜你签到成功并且升级为银牌', that.data.winHeight);
            wx.setStorageSync('grade', 2);
            that.setData({
              sts: 1
            })
          }).catch((errMsg) => {
            var that = this;
            that.setData({
              sts: 1
            })
            Common.examPrompt(that, '', 'signIn', errMsg, that.data.promptWindowHeight, 'signIn')    
          });
      }
      if ((that.data.grade ==0||that.data.grade ==2||that.data.grade==3)&&that.data.chooseStatus == 'experts'){
        wx.setStorageSync('grade', that.data.grade);
        var data = {
          userId: that.data.userId,
          activityId: that.data.id, 
        }
        var url = app.globalData.shopPath + '/app/userAudit/userUpgradeGold';
        HttpUtil.post(url, data).then((res) => {
            Common.examPrompt(that, '', 'signIn', '恭喜你签到成功', that.data.promptWindowHeight, 'signIn')
            that.setData({
              sts: 1
            })
        }).catch((errMsg) => {
          var that = this;
          that.setData({
            sts: 1
          })
          Common.examPrompt(that, '', 'signIn', errMsg, that.data.promptWindowHeight, 'signIn')
        });
      
      }
    }
  },
  //未报名活动(签到-好的）
  examineErrors:function(){
    var that = this;
    that.setData({
      examPromtStatus: true,
    })
  },
  // 弹窗返回
  returnBtn: function (that) {
    var that = this;
    Common.returnBtn(that)

  },
  // 弹窗查看详情
  detailsBtn: function () {
    var that = this;
    wx.navigateTo({
      url: '../expertsLevel/expertsLevel'
    })
  },
  //签到成功（好的）
  signInBtn:function(){
    var that = this;
    that.setData({
      examPromtStatus:true,
    });
   
  },
  //立即报名
  tabName:function(e){
    var that = this;
    //判断用户是否注册
    var mobile = that.data.mobile;
    if (mobile == '' || mobile == undefined){
      var url = '../activity/activity';
      var type = 'ordinary';
      var id = that.data.id
      if (e.detail.iv == undefined) {//没有授权
        wx.navigateTo({
          url: '../authorization/authorization?url=' + url + '&type=' + type + '&id=' + id,
        })
      }
      return;
    
    };
  
  
    var data = {
      'userActivity.userId': that.data.userId,
      'userActivity.activityId':that.data.id,
      // 'mobile': that.data.mobile,
      // 'openId': that.data.openId,
      // 'formId': that.data.formId,
    }
    var url = app.globalData.shopPath + '/app/userActivity/add';
    HttpUtil.post(url, data).then((res) => {
      var that = this;
      that.setData({
        immediately1:1,
        immediately:1,
        // count:1
        surplusNum:that.data.surplusNum-1,
        countNum: that.data.countNum+1,
      });
      Common.examPrompt(that, '记得准时参加活动哦～', 'apply', '报名成功！', that.data.promptWindowHeight,'apply')
    }).catch((errMsg) => {
      var that = this;
      // Common.dialog(that, errMsg); //错误提示信息
    });
  },
  //进入进阶课程
  skipCourse:function(){
    var that = this;
    that.setData({
      specialist: 1,
    });
    getApp().globalData.currentTab = 0;
    wx.switchTab({
      url: '../NZSP_course/NZSP_course'
    })

  },
  //确定报名
  signInBtn1:function(){
    let that = this;
    that.setData({
      examPromtStatus: true,
    })
    //判断是否为专家
    if (that.data.grade == 0) {
      //弹出专家提示框
      Common.bottomPrompt(that, '升级资格', 'qualification', '需要完成11个单元的基础课程，成为铜牌专家后，参加一次活动就能升级为银牌哦！', '知道了', 'course')
    };
  },
  //取消报名
  cancelName: function () {
    var that = this;
    Common.operationPrompt(that, '此活动名额有限，确定取消吗？', 'resImg','determine1')
   
  },
  //取消（取消报名）
  cancelNameS1: function () {
    var that = this;
    that.setData({
      operationPromptStatus: true
    });
    

  },
  //确定（取消报名）
  tabNameOne:function(){
    var that = this;
    var data = {
      'userActivity.userId': that.data.userId,
      'userActivity.activityId': that.data.id,
      // 'mobile': that.data.mobile,
      'formId': that.data.formId,
    }
    var url = app.globalData.shopPath + '/app/userActivity/del';
    HttpUtil.post(url, data).then((res) => {
      var that = this;
      that.setData({
        immediately: 0,
        cancelName: 0,
        // count:1
        operationPromptStatus: true,
        surplusNum: that.data.surplusNum + 1,
        countNum: that.data.countNum - 1,
      });
   
    }).catch((errMsg) => {
      var that = this;
      Common.dialog(that, errMsg); //错误提示信息
    });
  },
  //分享触发的事件
  onShareAppMessage:function(e){
    var that = this;
    if (e.from === 'button') {
      // 来自页面内转发按钮
      // console.log(ops.target)
    }
    return {
      title: '开启新西兰旅游专家之旅吧',
      // path: 'pages/activity/activity?id=that.data.id&userId=that.data.userId',  // 路径，传递参数到指定页面 shareImg。
      imageUrl: 'https://nzsplvs--img.oss-cn-shanghai.aliyuncs.com/20190905/course/MP_Share_Pic.jpg' ,// 分享的封面图
      path: '/pages/activity_show/activity_show?sign=shareSign'+'&id='+that.data.id,
      success: function (res) { 
      },
      fail: function (res) {
      }
    }
  },
  backList:function(){
    wx.switchTab({
      url: '../activity_show/activity_show',
    })
  },
 onReady: function () {
    this.animation = wx.createAnimation()
  },
  onshow: function (options){
    var that=this;

    // that.setData({
    //   sign: options.sign,
    //   signActivityId: options.signActivityId,
    // })
    
    that.sign();
  }
})
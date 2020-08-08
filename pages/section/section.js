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
    sectionInfo:{},
    problems:[], 
    sectionList:[],
    studyProgress:0,
    userId:"",
    courseId:0,
    sectionNum:0,
    nextcourseSection:0,
    coursetype:"",
    promptStatus:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      userId: options.userId,
      courseId: options.id,
      //用不到
      sectionNum: options.sectionNum,
    })
    that.querySectionInfo();
  },
  //章节详情
  querySectionInfo() {
    var that = this
    var courseId = that.data.courseId;
    that.setData({
      noData: true, //把"无数据"的变量设为true，隐藏  
      searchLoading: false, //把"数据加载中"的变量设为false，显示  
      searchLoadingComplete: true //把"没有更多数据"的变量设为true，隐藏  
    });
    var data = {
      userId: that.data.userId,
    }
   var url = app.globalData.shopPath + '/app/course/info/' + courseId;
    HttpUtil.post(url, data).then((res) => {
      var that = this;
      that.setData({
        searchLoading: true //把"数据加载中"的变量设为true，隐藏  
      });
      if (!res.data.success) {
        that.setData({
          loadingFail: false //把"数据加载失败"的变量设为false，显示  
        });
        return;
      }
      
      let sectionList = res.data.entity.sectionList;
    
      that.setData({
        sectionInfo: res.data.entity.courseInfo,
        sectionList: sectionList,
        problems: res.data.entity.courseInfo.proList
      });
      var content1 = res.data.entity.courseInfo.takeAway;
      if (content1 != null && content1 != '') {
        var content = content1.replace(/#imagePath#/g, that.data.imagePath);
        WxParse.wxParse('sectionContent', 'html', content, that, 20);
      }
      
      var content = res.data.entity.courseInfo.content;
      if (res.data.entity.isPay =="false"){
        let ipos = content.indexOf("<video");
        let str1 = content.substring(0, ipos); //取前部分
        let str2 = content.substring(ipos, content.length);//取后部分
        let ipos3 = str2.indexOf("</video>");
        let str3 = str2.substring(ipos3, str2.length);//取后部分
        content = str1 + str3;
      }else{
        content = content;
      }
      
      console.log(content)
      if (content != null && content != '') {
        var content = content.replace(/#imagePath#/g, that.data.imagePath);
        WxParse.wxParse('sectionContentTwo', 'html', content, that, 20);
      }
    }).catch((errMsg) => {
      var that = this;
      Common.dialog(that, errMsg); //错误提示信息
    });
  },
  // backS:function(){
  //   wx.reLaunch({
     
  //  })
  // },
 //进入课程
  coursetap: function(){
    var that = this;

        wx.redirectTo({
          url: "../bar/bar" + '?courseId=' + that.data.courseId,
        })
   
    
  }

})
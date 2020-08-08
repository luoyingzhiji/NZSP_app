var WxParse = require('../../wxParse/wxParse.js');
var util = require('../../utils/util.js');
var MD5 = require('../../utils/md5.js');
var Common = require('../../utils/common.js');
var Favorite = require('../../utils/favorite.js');
var Comment = require('../../utils/comment.js');
var HttpUtil = require('../../utils/httpUtil.js');
var app = getApp();
const innerAudioContext = wx.createInnerAudioContext();
innerAudioContext.obeyMuteSwitch=false;
var src = "";
var number;
Page({
  /**
   * 页面的初始数据
   */

  data: {
    // isPlayAudio: false,
    //自定义音频地址
    sliderValue: '',
    isplay: false,
    nowTime: "00:00",
    totalTime: "",
    title: '',
    max: "100",
    sliderValue: "0",
    audiosrc: [],
    playIndex:-1,
    total:0,
    //结束

    promptStatus: true,
    mainPath: app.globalData.mainPath,
    videoPath: app.globalData.videoPath,
    audioPath: app.globalData.audioPath,
    userPath: app.globalData.userPath,
    imagePath: app.globalData.imagePath,
    isIphoneX: app.globalData.isIphoneX,
    statusBarHeight: app.globalData.statusBarHeight,
    sectionTitle: "",
    serialNumber:'',
    //课程类型
    userId:"",
    type: 0,
    barInfo: {},
    barList: [],
    sectionId: 0,
    sectionList: [],
    sectionListJson: "",
    nextcourseSection: 0,
    courseId: 0,
    //单个进度条宽度
    widths: 0,
    favoriteSectionId:0,
    isFavorite: false,
    // 学习进度
    studyProgress: 0,
    upIndex:0,
    scrollTop:0,
    scrollHeight:0,
    navHeight:0,
    winWidths:0,
    // 进度百分比
    percentage:0,
    // 滚动条白色标识位置
    progressLeft:0,
    // 小节内容
    sectionContert:[],
    // 当前小节下标
    currentIndex:0,
    btnLoagIng:false,
    //控制视频显隐
    isPay:"true",
  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    var value = wx.getStorageSync('userId');
    let winWidths = wx.getSystemInfoSync().windowWidth;
    let winHeights = wx.getSystemInfoSync().windowHeight;
    let scrollHeight = (winHeights - app.globalData.statusBarHeight);
    that.setData({
      scrollHeight: scrollHeight,
      userId: value,
      courseId: options.courseId,
      favoriteSectionId: options.favoriteSectionId,
      winWidths: winWidths
    })
    // this.queryBarInfo()
  },

  //小节详情
  queryBarInfo() {
    var that = this
    
    wx.showLoading({
      title: '加载中',
    })
    that.setData({
      noData: true, //把"无数据"的变量设为true，隐藏
      searchLoading: false, //把"数据加载中"的变量设为false，显示
      searchLoadingComplete: true //把"没有更多数据"的变量设为true，隐藏
    });


    var data = {
      courseId: that.data.courseId,
      userId: that.data.userId,
    }
   
    var url = app.globalData.shopPath + '/app/course/section';
    HttpUtil.post(url, data).then((res) => {
    
      console.log(res.data.entity)
      if(res.data.success){
        setTimeout(function(){
          wx.hideLoading()
        // var childSection = res.data.entity.section.childSections;
        //  var childArray = [];
        // for (let child of childSection){
        //   if(child.type == 4){
        //     var mulsrc = app.globalData.audioPath+child.result;
        //       childArray.push(mulsrc);
        //   }
        // }

        // 计算进度条
        var currentIndex = res.data.entity.currentIndex;
          var sectionList = res.data.entity.sectionList;
          var progress = res.data.entity.progress;
          if(progress > 100) {
          progress = 100;
        }
        // studyProgress = parseInt(100 / sectionList.length * (currentIndex+1));

        var widths = parseInt((that.data.winWidths * progress) / 100);
        that.setData({
          sectionList: sectionList,
          upIndex: currentIndex == 99 ? currentIndex : currentIndex - 1,
          widths: widths,
          percentage: progress,
          btnLoagIng: true,
          isPay:res.data.entity.isPay,
        })
        console.log(that.data.scrollTop)
        // 判断当前下标是不是99如果是99代表本章课程已经学完了
        if (currentIndex == 99) {
          that.setData({
            progressLeft: that.data.winWidths - 38,
            percentage: 100,
          })
          currentIndex = 0;
        }

        if (that.data.favoriteSectionId != 0) {

          for (let i = 0; i < sectionList.length; i++) {
            if (sectionList[i].id == that.data.favoriteSectionId) {
              currentIndex = i;
              break
            }
          }
        };
        that.showContent(currentIndex);
        },1000)
  
        console.log(that.data.widths)
      }
      
    }).catch((errMsg) => {
      var that = this;

    });

  },
  showContent(currentIndex){
    console.log(currentIndex);

    let that=this;
    let sectionList=this.data.sectionList;


    let sectionContert = sectionList[currentIndex];
      let isFavorite = sectionContert.isFavorite;
    that.onListener();//初始化方法
    var childSections = sectionContert.childSections
    for (let i = 0; i < childSections.length; i++) {
      var content = childSections[i].result;
      if (that.data.isPay == "false") {
        let ipos = content.indexOf("<video");
        let str1 = content.substring(0, ipos); //取前部分
        let str2 = content.substring(ipos, content.length);//取后部分
        let ipos3 = str2.indexOf("</video>");
        let str3 = str2.substring(ipos3, str2.length);//取后部分
        content = str1 + str3;
      }else{
        content = content;
      }
    
      if (content != null && content != '') {
        var content = content.replace(/#imagePath#/g, that.data.imagePath);
        WxParse.wxParse('barContent' + i, 'html', content, that, 20);
        if (i == childSections.length - 1) {
          WxParse.wxParseTemArray("WxParseListArr", 'barContent', childSections.length, that);
        }
      }
    }

    that.setData({
      sectionContert: sectionContert,
      barList: sectionContert.childSections,
      currentIndex: currentIndex,
      sectionId: sectionContert.id,
      sectionTitle: sectionContert.name,
      isFavorite:isFavorite,
      scrollTop: 0
    });
    //this.scrollTop(0);
  },
  onListener:function () {
    //监听音频准备就绪
    var that = this;
    innerAudioContext.onTimeUpdate(() => {
      // 必须。可以当做是初始化时长
      innerAudioContext.duration;
      // 必须。不然也获取不到时长

      // var total = parseInt(innerAudioContext.duration);
      setTimeout(() => {

        that.setData({
          // totalTime: util.timeToText(total),
        }); // 401.475918
      }, 100);
    });
  },
  //播放
  playaudio: function (e) {
    var that = this;
    //点击对象下标
    let index = e.currentTarget.dataset.index;
    //变量
    let playIndex = that.data.playIndex;
    if (index != playIndex) {//播放新音频
      that.setData({
        isplay: true,
        playIndex: index,
        sliderValue: '0'
      })
      //通过下标获取音频路径
      let srcS = that.data.barList[index].result;
      //音频路径
      innerAudioContext.src = app.globalData.audioPath + srcS;
      innerAudioContext.title = that.data.barList[index].musicName;
      innerAudioContext.play();
      setTimeout(function(){
        //总时长
        var total = parseInt(innerAudioContext.duration);
        that.setData({
          total: total,
          "totalTime": util.timeToText(total),
        })
      },1000);
    }else{
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

    }
        //更新进度
        innerAudioContext.onTimeUpdate(() => {

              //进度时长
              var per = parseInt(innerAudioContext.currentTime);
              //进度条
              var slider = (per/that.data.total)*100;
              // innerAudioContext.onEnded
                that.setData({
                  "sliderValue": "" + slider,
                  "nowTime": util.timeToText(per),
                })
        })
    innerAudioContext.onEnded(()=>{
      that.setData({
        playIndex: -1,
        isplay: false,
        sliderValue: '0'
      });
      innerAudioContext.offEnded();
      innerAudioContext.offTimeUpdate();
    })
  },



  onShow:function(){
    var that = this;

    that.queryBarInfo();


  },

  //收藏与取消
  collect:function(){
    var that = this
    var data = {
      otherId: that.data.sectionId,
      userId: that.data.userId,
      type:'section'
    }
    if (!that.data.isFavorite) {
      var that = this
      var url = app.globalData.userPath + '/app/favorite/add';
      HttpUtil.post(url, data).then((res) => {
        that.setData({
          isFavorite:true,
        })
      }).catch((errMsg) => {
        var that = this;

      });
    }
    if (that.data.isFavorite){
      var that = this
      var url = app.globalData.userPath + '/app/favorite/del';
      HttpUtil.post(url, data).then((res) => {

        that.setData({
          isFavorite:false,
        })
        console.log(123456)
      }).catch((errMsg) => {
        var that = this;

      });
    }
  },
//判断用户是否为空

  barSkip: function (){
    let that = this;
    wx.redirectTo({
      url: '../exam/exam?sectionId=' + that.data.sectionId + '&sectionListLength=' + that.data.sectionList.length + '&courseId=' + that.data.courseId
    })
  },
  skipConclusion:function(){
    var that = this;
    var courseId = that.data.courseId;
    wx.redirectTo({
      url: '../skipChapter/skipChapter?courseId=' + courseId + '&complete=' + 'yes',
    })
  },
  onUnload: function () {

    innerAudioContext.stop();
  },

//返回上一节
  returnbar: function (e) {
    var that = this;
    var type = e.currentTarget.dataset.type;
    var currentIndex = that.data.currentIndex
    // back上一节、advance下一节
    if (type == 'back') {
      currentIndex = currentIndex - 1
    } else {
      currentIndex = currentIndex + 1
    }

    that.showContent(currentIndex);
},

})

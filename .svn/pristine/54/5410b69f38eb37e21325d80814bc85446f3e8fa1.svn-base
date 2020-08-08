var HttpUtil = require('../../utils/httpUtil.js');
var Common = require('../../utils/common.js');
var app = getApp();
Page({

  /**
    *  页面的初始数据
    */
  data: {
    checkedIndex: '',
    sectionList: [],
    userId: '',
    questionList: [],
    submit: true,
    isSubmit: true,
    nextcourseSection: 0,
    sectionId: 0,
    courseId:0,
    progress:0,
    //  判断有没有做到最后一节
    cmp: false,
    isIphoneX: app.globalData.isIphoneX,
    statusBarHeight: app.globalData.statusBarHeight,
    sectionTitle:'',
    coursetype:'',
    studyProgress:0,
    // 考试弹窗
    examPromtStatus: true,
    examPromtType: '',
    examPromtText:'',
    examPromtTitle:'',
    promptWindowHeight: 0,
    btnStatus:'',
    operationPromptStatus:true,
    winWidths: 0,
    widths:0,
    // 进度百分比
    percentage: 0,
    // 滚动条白色标识位置
    progressLeft: 0,
    // 总小节数
    sectionListLength:0,
    // 当前下标
    currentIndex:0,
    // 是否是最后一节
    last:0,
    examTbn:false,
  },
  /**
    *  生命周期函数--监听页面加载
    */
  onLoad: function (options) {
    var that = this;
    let Height = wx.getSystemInfoSync().windowHeight;
    let winWidths = wx.getSystemInfoSync().windowWidth;
    var userId = wx.getStorageSync('userId');
    that.setData({
      sectionListLength: options.sectionListLength,
      promptWindowHeight: Height,
      sectionId: options.sectionId,
      userId: userId,
      courseId: options.courseId,
      winWidths: winWidths,
    });
    that.queryQuestions();
  },
  queryQuestions: function () {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    var data = {
      "sectionLength": that.data.sectionListLength,
      "sectionId": that.data.sectionId,
      "userId": that.data.userId,
    }
    var url = app.globalData.examPath + '/app/get/question/by/point';
    HttpUtil.post(url, data).then((res) => {
      console.log(res.data.entity)
      setTimeout(function(){
        wx.hideLoading();//加载中消失
        if (res.data.entity != null) {
          var progressLeft = parseInt((that.data.winWidths) * (res.data.entity.studyProgress / 100));
          that.setData({
            questionList: res.data.entity.questionList,
            sectionTitle: res.data.entity.sectionTitle,
            studyProgress: res.data.entity.studyProgress,
            progressLeft: progressLeft,
            last: res.data.entity.last
          })
          console.log(that.data.progressLeft)
          var questionList = that.data.questionList;
          for (var i = 0; i < questionList.length; i++) {
            var question = questionList[i];
            //用户选择答案
            question.isDo = false;
            if (question.userAnswer != null && question.userAnswer != '') {

              // if (question.userAnswer==)
              // option.isAnswer=
              question.isDo = true;
            }
            // debugger
            //正确答案
            if (question.answer != null && question.answer != '') {
              for (var j = 0; j < question.optionList.length; j++) {
                let option = question.optionList[j]
                if (question.answer.indexOf(option.optionChar) > -1) {
                  option.isAnswer = true;
                } else {
                  option.isAnswer = false;
                }
                if (question.userAnswer != undefined && question.userAnswer != '' && question.userAnswer.indexOf(option.optionChar) > -1) {
                  option.isUserAnswer = true;
                } else {
                  option.isUserAnswer = false;
                }
              }
           
            }
         
         that.setData({
           questionList: questionList,
         })
          }
          console.log(questionList)
        }
        that.setData({
          examTbn:true,
        })
      },1000)
      console.log(that.data.questionList)
    })
  },
  navigateBack:function(){
    var that = this;
    var studyProgress = that.data.studyProgress;
    if (studyProgress != 100){
      Common.operationPrompt(that, '本章还有题目未完成，你确定要现在离开吗？', 'chick', 'determine', that.data.promptWindowHeight)
    }else{
      that.returnBtn();
    }
  },
  tabNameOne:function(){
    var that = this;
    that.returnBtn();
  },
  returnBtn:function(){
    wx.navigateBack({
      delta: 1
    })
  },
  cancelNameS:function(){
    var that = this;
    that.setData({
      operationPromptStatus:true
    })
  },
  choose: function (e) {
    var that = this;
    //  父元素下标
    var parentIndex = e.currentTarget.dataset.parentindex;
    //  被选中的选项  子元素下标
    var index = e.currentTarget.dataset.index;
    var question = that.data.questionList[parentIndex];
    console.log(question)
    var optionList = that.data.questionList[parentIndex].optionList;
    var questionList = that.data.questionList;
    //正确不可选
    if (question.isDo && question.userAnswer == question.answer) {
      return;
    }
    var questionTarget = 'questionList[' + parentIndex + ']';
    //错题清除状态
    if (question.isDo && question.userAnswer != question.answer) {
      question.isDo = false;
      question.userAnswer = "";
      that.setData({
        [questionTarget]: question,
      })
      for (var i = 0; i < optionList.length; i++) {
        optionList[i].isUserAnswer = false;
      }
    }
    // 判断是多选还是单选
    for (var i = 0; i < optionList.length; i++) {
      if (question.answer.length == 1) { //单选、判断
        if (i != index) {
          optionList[i].isUserAnswer = false;
        } else {
          optionList[i].isUserAnswer = true
        }
      } else { //多选 不定项
        if (i == index && question.optionList[i].isUserAnswer == true) {//已选中，则取消
          optionList[i].isUserAnswer = false;
        } else if (i == index) {
          optionList[i].isUserAnswer = true;
        }
      }
    }
    var optionListTarget = 'questionList[' + parentIndex + '].optionList';

    that.setData({
      [optionListTarget]: optionList
    })
    // 判断所有的题是否都做了，如果没做禁止提交
    var doNum = 0;
    var questionNum = 0;
    for (let question of questionList) {

      // 没提交或者用户提交了但是没选对
      if ((question.userAnswer == undefined || question.userAnswer == '') ||
        (question.userAnswer != undefined && question.answer != question.userAnswer)) {
        questionNum++
      }
      // 判断是否提交过
      if (question.isDo) {
        continue;
      }
      for (let option of question.optionList) {
        if (option.isUserAnswer) {
          doNum++;
          break;
        }
      }
    }
    // 如果参与判断的题数和点击的题数相等按钮可以点击
    if (doNum == questionNum) {
      that.setData({
        submit: false
      })
    }
  },
  // 提交试卷
  submitPaper: function () {
    var that = this;
    var questionList = that.data.questionList;
    var record = [];
    let flag = true;
    var last = that.data.last;
    var sectionList = that.data.sectionListLength;
    for (let question of questionList) {
      question.isDo = true;
      var recordItem = {
        questionId: question.idStr,
        userAnswer: '',
        score: 0
      };
      for (let optionObj of question.optionList) {
        // 提交试卷参数
        if (optionObj.isUserAnswer == true) {
          recordItem.userAnswer += optionObj.optionChar;
        }
      }
      question.userAnswer = recordItem.userAnswer;
      if (flag && question.userAnswer != question.answer) {
        flag = false;

      }
      record.push(recordItem);
    }
    let examPromtType = '';
    var examPromtText = '';
    var examPromtTitle = '';
    // 判断用户做的题是否正确
    if (!flag) {
      examPromtType = 'promptErrors';
      examPromtText = '重新选择正确答案提交，全部正确才能进入下一节';
      examPromtTitle = '啊呀，有题目答错了'
    }
    if(flag) {
      if (last !=1){
        examPromtType = 'promptCorrect';
        examPromtText = '趁热打铁，继续学习下一节内容';
        examPromtTitle = '太棒了，都答对啦！'
      }
      if (last == 1){
        examPromtType = 'nextChapter';
        examPromtText = '您已经答对本章全部小节题目，可以查看本章学习总结。';
        examPromtTitle = '恭喜您，都答对了！'
      }
    }
    that.setData({
      questionList: questionList,
      examPromtType: examPromtType,
    })
    var data = {
      'userId': that.data.userId,
      'record': JSON.stringify(record),
      'sectionId': that.data.sectionId,
      "courseId": that.data.courseId,
    }
    var url = app.globalData.examPath + '/app/chapter/record/modify';
    HttpUtil.post(url, data).then((res) => {
      if (res.data.success) {
        console.log(res.data.success)
      }
    })
    Common.examPrompt(that, examPromtText, examPromtType, examPromtTitle, that.data.promptWindowHeight,'exam')
  },
  // 查看错题
  examineErrors: function () {
    var that = this;
    var query = wx.createSelectorQuery().in(this);
    that.setData({
      isSubmit: false,
      submit: true
    })
    // 弹出框消失
    that.setData({
      examPromtStatus: true,
    })
    var questionList = that.data.questionList;
    var errorsIndex = 0;
    var errorsId = '';
    for (var i = 0; i < questionList.length;i++){
      if (questionList[i].userAnswer != questionList[i].answer){
        errorsIndex = i;
        errorsId = '#exam-questions-content' + i
        break;
      }
    }
    var top = 99
    var questionTop = 0
    for (var j = 0; j < errorsIndex;j++){
      query.select(errorsId).boundingClientRect()
      query.exec(function (res) {
        questionTop = res[0].height * errorsIndex;
      })
    }
    query.exec(function (res) {
      wx.pageScrollTo({
        scrollTop: questionTop + top
      })
    })
  },

  skipNextChapter:function(){
    var that = this;
    var courseId = that.data.courseId;
    wx.redirectTo({
      url: '../skipChapter/skipChapter?courseId=' + courseId,
      })
  },
  // 进入下一节
  nextVerse: function () {
    var that = this;

    var courseId = that.data.courseId;
    // 弹出框消失
    // debugger
    that.setData({
      examPromtStatus: true,
    })

    wx.redirectTo({
      url: '../bar/bar?courseId=' + courseId ,

    })
  },

  //返回上一页
  thePreviousSection:function(){
    var that = this;
    var courseId = that.data.courseId;
      //  wx.navigateTo({
      //    url: '../bar/bar?courseId=' + courseId,
      //  })
    wx.redirectTo({
      url: '../bar/bar?courseId=' + courseId,

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
    // var that = this;
    // that.queryQuestions();

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

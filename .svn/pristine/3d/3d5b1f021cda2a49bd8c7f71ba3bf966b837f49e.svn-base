var HttpUtil = require('./httpUtil.js');
var app = getApp();
var Common = require('./common.js');
var MD5 = require('./md5.js');

//添加评论
function addComment(that, content, type, otherId, parentId) {

  if (!Common.checkLogin(app)) {
    return;
  }
  if (content == '' || content.length < 3 || content.length > 200) {
    Common.dialog(that, '请输入3~200个字');
    return;
  }

  var data = {
    "userId": app.globalData.userId,
    "type": type,
    "otherId": otherId,
    "parentId": parentId,
    "content": content,
  }
  var url = app.globalData.userPath + '/app/comment/add' //添加评论
  HttpUtil.post(url, data).then((res) => {
    if (!res.data.success) {
      Common.dialog(that, res.data.message)
      return;
    }
    Common.dialog(that, '评论成功')
    that.setData({
      commentContent: ""
    })

    if (that.data.commentNum != undefined) {
      var commentNum = that.data.commentNum
      if (commentNum != '99+') {
        commentNum = commentNum + 1
        that.setData({
          commentNum: commentNum
        })
      }
    }
    if (that.data.commentList != undefined) { //插入评论到页面
      res.data.entity.index = that.data.commentNum + 1;
      that.data.commentList.unshift(res.data.entity);
      that.setData({
        commentList: that.data.commentList
      })
    }
    that.cancelComment();

  }).catch((errMsg) => {
    Common.dialog(that, errMsg); //错误提示信息
  });
}

function commentList(that, currentPage, type, otherId) {
  that.setData({
    noData: true, //把"无数据"的变量设为true，隐藏  
    searchLoading: false, //把"数据加载中"的变量设为false，显示  
    searchLoadingComplete: true //把"没有更多数据"的变量设为true，隐藏  
  });

  var data = {
    "type": type,
    "otherId": otherId,
    "queryUserId": app.globalData.userId,
  }
  var url = app.globalData.userPath + '/app/comment/list'
  HttpUtil.post(url, data).then((res) => {
    that.setData({
      searchLoading: true //把"数据加载中"的变量设为true，隐藏  
    });

    if (!res.data.success) {
      that.setData({
        loadingFail: false //把"数据加载失败"的变量设为false，显示  
      });
      return;
    }
    var commentTopList = res.data.entity.commentTopList
    if (commentTopList != null) {
      //时间格式化 设置是否隐藏，用于删除
      for (var i in commentTopList) {
        commentTopList[i].createTime = getDateDiff(new Date(commentTopList[i].createTime.replace(/\-/g, '/')).getTime());
        commentTopList[i].isHidden = false
        commentTopList[i].index = i + 1
      }
      that.setData({
        commentTopList: commentTopList
      })
    }
    var commentList = res.data.entity.commentList
    if (commentList != null && commentList.length > 0) {
      //时间格式化 设置是否隐藏，用于删除
      for (var i in commentList) {
        commentList[i].createTime = getDateDiff(new Date(commentList[i].createTime.replace(/\-/g, '/')).getTime());
        commentList[i].isHidden = false
        commentList[i].index = i + 6
      }
      if (currentPage > 1) { //大于第一页追加数据
        that.setData({
          commentList: that.data.commentList.concat(commentList),
          page: res.data.entity.page
        })
      } else {
        that.setData({
          commentList: commentList,
          page: res.data.entity.page
        })
        if (that.data.commentNum != undefined) {
          var commentNum = res.data.entity.page.totalResultSize
          that.setData({
            commentNum: commentNum
          })
        }
      }

    } else {
      if (currentPage == 1) {
        that.setData({
          noData: false //把"无数据"的变量设为false，显示  
        });
      } else {
        that.setData({
          searchLoadingComplete: false //把"数据加载中"的变量设为false，显示  
        });
      }
    }
  }).catch((errMsg) => {
    Common.dialog(that, errMsg); //错误提示信息
  });

}

function getDateDiff(dateTimeStamp) {
  var result;
  var minute = 1000 * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var halfamonth = day * 15;
  var month = day * 30;
  var now = new Date().getTime();
  var diffValue = now - dateTimeStamp;
  if (diffValue < 0) {
    return;
  }
  var monthC = diffValue / month;
  var weekC = diffValue / (7 * day);
  var dayC = diffValue / day;
  var hourC = diffValue / hour;
  var minC = diffValue / minute;
  if (monthC >= 1) {
    if (monthC <= 12)
      result = "" + parseInt(monthC) + "月前";
    else {
      result = "" + parseInt(monthC / 12) + "年前";
    }
  } else if (weekC >= 1) {
    result = "" + parseInt(weekC) + "周前";
  } else if (dayC >= 1) {
    result = "" + parseInt(dayC) + "天前";
  } else if (hourC >= 1) {
    result = "" + parseInt(hourC) + "小时前";
  } else if (minC >= 1) {
    result = "" + parseInt(minC) + "分钟前";
  } else {
    result = "刚刚";
  }

  return result;
};
//删除评论
function delComment(that, commentId) {
  if (!Common.checkLogin(app)) {
    return;
  }

  var data = {
    "userId": app.globalData.userId,
    "commentId": commentId,
  }
  var url = app.globalData.userPath + '/app/comment/del'
  HttpUtil.post(url, data).then((res) => {
    if (!res.data.success) {
      Common.dialog(that, res.data.message)
      return;
    }
    Common.dialog(that, '删除成功')

    if (that.data.commentNum != undefined) {
      var commentNum = that.data.commentNum
      if (commentNum > 0) {
        commentNum = commentNum - 1
        that.setData({
          commentNum: commentNum
        })
      }
    }
    if (that.data.commentList != undefined) { //删除评论
      var currentIndex = that.data.commentList.findIndex(item => item.id === commentId);
      if (currentIndex > -1) {
        that.setData({
          ['commentList[' + currentIndex + '].isHidden']: true,
        });
      }

      currentIndex = that.data.commentTopList.findIndex(item => item.id === commentId);
      if (currentIndex > -1) {
        that.setData({
          ['commentTopList[' + currentIndex + '].isHidden']: true,
        });
      }
    }
  }).catch((errMsg) => {
    Common.dialog(that, errMsg); //错误提示信息
  });
}
//举报评论
function reportComment(that, otherId) {
  if (!Common.checkLogin(app)) {
    return;
  }
  var data = {
    "userId": app.globalData.userId,
    "type": "comment",
    "otherId": otherId,
  }
  var url = app.globalData.userPath + '/app/report/add' //举报评论
  HttpUtil.post(url, data).then((res) => {
    if (!res.data.success) {
      Common.dialog(that, res.data.message)
      return;
    }
    Common.dialog(that, '举报成功')

  }).catch((errMsg) => {
    Common.dialog(that, errMsg); //错误提示信息
  });
}
//评论点赞
//点赞
function praiseComment(that, commentId, parentOtherId, type) {
  //传到服务器
  var data = {
    "userId": app.globalData.userId,
    "type": type,
    "parentOtherId": parentOtherId,
    "otherId": commentId,
  }
  var url = app.globalData.userPath + '/app/praise/add'
  HttpUtil.post(url, data).then((res) => {
    if (!res.data.success) {
      Common.dialog(that, res.data.message);
    } else {
      Common.dialog(that, "点赞成功");
    }
  }).catch((errMsg) => {
    Common.dialog(that, errMsg); //错误提示信息
  });
}
module.exports = {
  addComment: addComment,
  delComment: delComment,
  reportComment: reportComment,
  praiseComment: praiseComment,
  commentList: commentList
}
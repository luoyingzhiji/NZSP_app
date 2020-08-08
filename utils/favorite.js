var app = getApp()
var HttpUtil = require('./httpUtil.js');
var Common = require('./common.js');
//取消收藏
function cancelFavorite(that, type, otherId) {
  if (!Common.checkLogin(app)) {
    return;
  }
  var data = {
    "userId": app.globalData.userId,
    "type": type,
    "otherId": otherId,
  }
  var url = app.globalData.userPath + '/app/favorite/del' //取消收藏
  HttpUtil.post(url, data).then((res) => {
    if (!res.data.success) {
      return;
    }
    that.setData({
      collect: "collect",
      collectOpt: "addFavorite"
    })
    Common.dialog(that, '取消收藏');
  }).catch((errMsg) => {
    Common.dialog(that, errMsg); //错误提示信息
  });

}
//添加收藏
function addFavorite(that, type, otherId) {
  if (!Common.checkLogin(app)) {
    return;
  }
  var data = {
    "userId": app.globalData.userId,
    "type": type,
    "otherId": otherId,
  }
  var url = app.globalData.userPath + '/app/favorite/add' //取消收藏
  HttpUtil.post(url, data).then((res) => {
    if (!res.data.success) {
      return;
    }
    that.setData({
      collect: "collect_on",
      collectOpt: "cancelFavorite"
    })
    Common.dialog(that, '收藏成功');
  }).catch((errMsg) => {
    Common.dialog(that, errMsg); //错误提示信息
  });
}

module.exports = {
  addFavorite: addFavorite,
  cancelFavorite: cancelFavorite,
}
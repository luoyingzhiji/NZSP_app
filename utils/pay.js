var HttpUtil = require('./httpUtil.js');
var app = getApp();
var Common = require('./common.js');
var MD5 = require('./md5.js');

function creatOrder(that, orderType, goodsId, otherField) {
  that.setData({
    noData: true, //把"无数据"的变量设为true，隐藏  
    searchLoading: false, //把"数据加载中"的变量设为false，显示  
    searchLoadingComplete: true //把"没有更多数据"的变量设为true，隐藏  
  });
  var data = {
    "userId": app.globalData.userId,
    "goodsId": goodsId,
    "month": otherField,
  }
  var url = app.globalData.shopPath + '/app/create/' + orderType + '/pay/order'
  HttpUtil.post(url, data).then((res) => {

    that.setData({
      searchLoading: true //把"数据加载中"的变量设为true，隐藏  
    });
    if (!res.data.success) {
      Common.dialog(that, res.data.message);
      return;
    }
    if (res.data.entity.optionStatus == 'y') {
      that.setData({
        isOk: true
      })
    } else {
      //跳转支付页
      wx.navigateTo({
        url: '/pages/pay/orderPay?requestId=' + res.data.entity.requestId,
      })
    }
  }).catch((errMsg) => {
    Common.dialog(that, errMsg); //错误提示信息
  });

}

function creatCashOrder(that, payCash) {
  that.setData({
    noData: true, //把"无数据"的变量设为true，隐藏  
    searchLoading: false, //把"数据加载中"的变量设为false，显示  
    searchLoadingComplete: true //把"没有更多数据"的变量设为true，隐藏  
  });

  var data = {
    "userId": app.globalData.userId,
    "payCash": payCash,
  }
  var url = app.globalData.shopPath + '/app/create/cash/order'
  HttpUtil.post(url, data).then((res) => {
    that.setData({
      searchLoading: true //把"数据加载中"的变量设为true，隐藏  
    });
    if (!res.data.success) {
      Common.dialog(that, res.data.message);
      return;
    }
    that.queryOrder(res.data.entity.requestId);
  }).catch((errMsg) => {
    Common.dialog(that, errMsg); //错误提示信息
  });

}
module.exports = {
  creatOrder: creatOrder,
  creatCashOrder: creatCashOrder,
}
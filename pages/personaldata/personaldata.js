//获取应用实例
var HttpUtil = require('../../utils/httpUtil.js');
var MD5 = require('../../utils/md5.js');
var Common = require('../../utils/common.js');
var Util = require('../../utils/util.js');
var arrays = require('../../utils/city.js');
var app = getApp();
//搜索公司高亮
const getInf = (str, key) => str.replace(new RegExp(`${key}`, 'g'), `%%${key}%%`).split('%%');
Page({
  data: {
    //职位
    arrayPositions: [],
    areaShowOne: false,
    areaShow:false,
    index: 0,
    //结束
    // 地址
    value: [0, 0, 0],
    val: 0,
    
    //中国
    states: arrays.states,
    provinces: arrays.provinces,
    citys: arrays.citys,
    curretnStates: '',
    curretnProvince: '',
    provinceCitys: arrays.citys[0],
    curretnCity: '',
    //新西兰
  
    curretnProvince: '',
    curretnStates: '中国',
    curretnProvince: '北京市',
    curretnCity: '北京市',

    shopPath: app.globalData.shopPath,
    imagePath: app.globalData.imagePath,
    isIphoneX: app.globalData.isIphoneX,
    statusBarHeight: app.globalData.statusBarHeight,
    promptStatus: true,
    userId:'',
    state:'',
    province:'',
    city: '',
    areaText:'',
    realName: '',
    //公司列表
    companyList: [],
    cTYPE: 0,
    cTYPE1: 0,
    mobilePosition: 0,
    //搜索公司高亮
    companyName: '',
    companyList: [],
    companyListCopy: [],
    mobile: '',
    position: '',
    avatar: '',
    userAvatar: '',
    email: '',
    //初始的邮箱（保存起来）
    emailEnd:false,
    emailOne:'',
    // chooseS:0,
    
        //提示弹窗
    operationPromptStatus: true, 
    operationPromptType: '', 
    operationPromptText: '', 
    btnStatus: ''  ,
    countries:'',
    chooseStatus:'',
  },
  onLoad: function (options) {
    let that = this;
    var value = wx.getStorageSync('userId');
    var countries = wx.getStorageSync('countries');
    var chooseStatus = wx.getStorageSync('chooseStatus');
    console.log(countries)
    that.positionN();
    that.setData({   
      userId: value,
      countries: countries,
      chooseStatus: chooseStatus,
    });
    that.personalInfo();
  },
  //编辑姓名
  getRealName: function (e) {
    var that = this;
    this.setData({
      realName: e.detail.value,
    });
    var data={
      "updateType": 'name',
      'user.realName': that.data.realName,
      'user.id': that.data.userId,
      'cityStr': that.data.state + ',' + that.data.province + ',' + that.data.city,
    }
    var url = app.globalData.userPath + "/app/user/update/content"
     HttpUtil.post(url, data).then((res) => {
        // Common.dialog(this, "编辑成功");
       let userInfo = {
         'avatar': that.data.avatar,
         'nickname': that.data.realName,
         'realName': that.data.realName
       }
       wx.setStorageSync('userInfo', userInfo);
      }).catch((errMsg) => {
        var that = this;
      })
  },
  //电话
  getMobile: function (e) {
    this.setData({
      mobile: e.detail.value,
    });
  },
  //点击显示地区
  areaShowFun: function () {
    var that = this;
    that.setData({
      areaShow: true,
    })
  },
  bindChange: function (e) {

    var that = this;
    var val = e.detail.value
    if (val[0] == 0) {
      that.setData({
        curretnStates: that.data.states[val[0]],
        curretnProvince: that.data.provinces[val[1]],
        provinceCitys: that.data.citys[val[1]],
        curretnCity: that.data.citys[val[1]][val[2]],
        value: val,
      })
    }
 
  },
  selectAddress: function () {
    var that = this;
      that.setData({
        city: that.data.curretnCity,
        areaText: that.data.curretnStates + "," + that.data.curretnProvince + "," + that.data.curretnCity,
        areaShow: false
      })
      var data = {
        "updateType": 'city',
        'cityStr': that.data.areaText,
        'user.id': that.data.userId,
      }
      var url = app.globalData.userPath + "/app/user/update/content"
      HttpUtil.post(url, data).then((res) => {
        // Common.dialog(this, "编辑成功");
      }).catch((errMsg) => {
        var that = this;
      })
  
  },
  //邮件
  getEmail: function (e) {
    var that = this;
    that.setData({
      emailOne: e.detail.value
    }) 
    // var thirdKey = wx.getStorageSync('thirdKey');
        if (that.data.email != e.detail.value ){
         var data={
           "email": e.detail.value,
           'userId': that.data.userId,
         }
          var url = app.globalData.userPath + "/app/user/update/email";
          HttpUtil.post(url, data).then((res) => { 
          }).catch((errMsg) => {
            if (errMsg == "no") {
              that.setData({
                emailEnd: true,
              })
            }
          })
        }
  },
  //继续保存邮箱
  emailEndOne: function (e) {
    wx.showLoading({
      title: '保存中',
    })
    var that = this;
    var data = {
      "email": that.data.emailOne,
      'userId': that.data.userId,
       'iskey': 'keyekyu'
    }
 
    var url = app.globalData.userPath + "/app/user/update/email";
    HttpUtil.post(url, data).then((res) => {
      console.log(res.data.message)
      if(res.data.success){
        setTimeout(function(){

          wx.hideLoading();//加载中消失
          wx.setStorageSync('grade', res.data.entity.grade);
          that.setData({
            emailEnd: false,
          })
        },1000)
       
      }
    }).catch((errMsg) => {
      // var that = this;
      // Common.dialog(this, errMsg);
    })

  },
  //取消保存
  emailEndOneS:function(){
    var that = this;
    that.setData({
      emailEnd:false,
      email: that.data.email,
    })
  },
  //职位
  //职位列表信息
  positionN: function () {
  
    var that = this;
    var position = 'position';
    var data = {
      'company.type': position,
    }
    var url = app.globalData.shopPath + "/app/company/sele";
    HttpUtil.post(url, data).then((res) => {
      that.setData({
        arrayPositions: res.data.entity,
      })
    }).catch((errMsg) => {
      var that = this;
      Common.dialog(that, errMsg); //错误提示信
    });
  },
  getposition: function () {
    this.setData({
      index: 0,
      areaShowOne: true,
    })
  },
  selectAddress1() {
    var that = this;
    that.setData({
      areaShowOne: false,
      position: that.data.arrayPositions[that.data.index].name
    })
   
    var data = {
      "updateType": 'position',
      'user.position': that.data.position,
      'user.id': that.data.userId,
      'cityStr': that.data.state + ',' + that.data.province + ',' + that.data.city,
    }
    var url = app.globalData.userPath + "/app/user/update/content"
    HttpUtil.post(url, data).then((res) => {

      // Common.dialog(this, "编辑成功");

    }).catch((errMsg) => {
      var that = this;
    })
  },
  bindChange1: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  //公司
  getcompanyName: function (e) {

    var that = this;
    var companyName = that.trim(e.detail.value);
    that.setData({
      companyName: companyName,
    })
    var company = 'company';
    var data = {
      'company.name': companyName,
      'company.type': company,
    }

    var url = app.globalData.shopPath + "/app/company/sele";
    HttpUtil.post(url, data).then((res) => {
      if (res.data.entity != '') {
        if (e.detail.value == '') {
          that.setData({
            cTYPE: 0,
            companyListCopy: [],
            companyList: [],
          })
        }
        if (e.detail.value != '') {
          that.setData({
            cTYPE: 1,
            // cTYPE1: 1,
            companyList: res.data.entity,
            companyListCopy: res.data.entity,

          })
          that.searchTap();
        };
      } else {
        that.setData({
          cTYPE: 0,
          companyListCopy: [],
          companyList: [],
        })
      }
    }).catch((errMsg) => {
    });
  },
  getcompanyNameOne:function(e){
    //公司名称提交到数据库
    var that = this;
    var data = {
      "updateType": 'companyName',
      'user.companyName': e.detail.value,
      'user.id': that.data.userId,
      'cityStr': that.data.state + ',' + that.data.province + ',' + that.data.city,
    }
    var url = app.globalData.userPath + "/app/user/update/content"
    HttpUtil.post(url, data).then((res) => {
      // Common.dialog(this, "编辑成功");
    }).catch((errMsg) => {
      var that = this;
    })
  },
  // 搜索关键字
  searchTap: function () {
    var that = this;
    // debugger
    var data = that.data.companyList;
    var newData = that.data.companyListCopy;
    for (var i = 0; i < data.length; i++) {
      var dic = data[i];
      var newDic = newData[i];
      var name = dic.name;
      newDic.name = getInf(name, that.data.companyName);
    }
    that.setData({
      companyListCopy: newData,
    })

  },
  // 去除首尾的空格
  trim: function (s) {
    return s.replace(/(^\s*)|(\s*$)/g, "");
  },
  //先择公司并显示
  select: function (e) {
    var that = this;
    //点击对象下标
    let index = e.currentTarget.dataset.index;
    let company = that.data.companyListCopy[index].name;
    //company被付的值是数组（转化成字符串，并去掉所有逗号） a.replace(/,/g, '');
    var companyName = company.join().replace(/,/g, '');
    that.setData({
      companyName: companyName,
      cTYPE: 0,
    })
     //公司名称提交到数据库
    var data = {
      "updateType": 'companyName',
      'user.companyName': that.data.companyName,
      'user.id': that.data.userId,
      'cityStr': that.data.state + ',' + that.data.province + ',' + that.data.city,
    }
    var url = app.globalData.userPath + "/app/user/update/content"
    HttpUtil.post(url, data).then((res) => {
      // Common.dialog(this, "编辑成功");
    }).catch((errMsg) => {
      var that = this;
    })
  },
  //个人详情
  personalInfo() {
    var that = this
    that.setData({
      noData: true,
      searchLoading: false,
      searchLoadingComplete: true
    });
    var data = {
      userId: that.data.userId,
    }
    var url = app.globalData.userPath + '/app/user/info';
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
      that.setData({
        state: res.data.entity.state,
        province: res.data.entity.province,
        city: res.data.entity.city,
        realName: res.data.entity.realName,
        companyName: res.data.entity.companyName,
        mobile: res.data.entity.mobile,
        position: res.data.entity.position,
        avatar: res.data.entity.avatar,
        userAvatar: res.data.entity.businessCard,
        email: res.data.entity.email,
        // emailOne: res.data.entity.email,
      });
    }).catch((errMsg) => {
      var that = this;
      Common.dialog(that, errMsg);
    });
  },
onShow(){
  var that = this;
  that.setData({
    city: that.data.city,
    realName: that.data.realName,
    companyName: that.data.companyName,
    mobile: that.data.mobile,
    position: that.data.position,
    avatar: that.data.avatar,
    userAvatar: that.data.userAvatar,
    email: that.data.email,
  });
  //每2s判断一次是否输入完毕
  // that.timeEmail();
 }, 
//上传名片
  chooseAvatar: function () {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths1 = res.tempFilePaths;
        var  tempFilePaths= tempFilePaths1[0];
       that.uploadPhotoInfo(tempFilePaths)
      }
    })
  },
  // 上传头像获取密钥
  uploadPhotoInfo: function (tempFilePaths) {
    var that = this;
    var filePaths = tempFilePaths;
    wx.showToast({
      icon: "loading",
      title: "正在上传",
      // duration: 2000
    })
    wx.request({
      url: app.globalData.mainPath + '/upload/policy',
      data: { "ossFile": "image" },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(filePaths.length)
        that.uploadPhoto(that, res.data, filePaths);
      }
    })
  },
  //上传
  uploadPhoto: function (that, info, filePaths) {
    var that = this;
    var fileName = info.dir + "/image/" + Util.random_string(20) + Util.get_suffix(filePaths)
    console.log(info.host)
    wx.uploadFile({
      
      url: app.globalData.imagePath,
      filePath: filePaths,
      name: 'file',
      header: { "Content-Type": "multipart/form-data" },
      formData: {
        'key': fileName,
        'policy': info.policy,
        'OSSAccessKeyId': info.accessid,
        'success_action_status': '200', //让服务端返回200,不然，默认会返回204
        'signature': info.signature,
      },
      success: function (res) {
        that.setData({
          userAvatar: '/' + fileName,
        })
        var data = {
          'user.businessCard': that.data.userAvatar,
          'user.id': that.data.userId,
          'cityStr': that.data.state + ',' + that.data.province + ',' + that.data.city,
        }
        var url = app.globalData.userPath + "/app/user/update/content"
        HttpUtil.post(url, data).then((res) => {
          // Common.dialog(that, "编辑成功");
        }).catch((errMsg) => {
          var that = this;
        })
      },
      fail: function (e) {
        console.log(e);
        Common.dialog(that, '上传失败失败，请稍后再试');
      }
    })
  },
  //点击阴影关闭
  // shadowClick(){
  //   var that = this;
  //   that.setData({
  //     areaShowOne: false,
  //     areaShow:false,
  //   })
  // },
})

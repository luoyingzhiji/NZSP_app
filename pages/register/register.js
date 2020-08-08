var MD5 = require('../../utils/md5.js');
var Common = require('../../utils/common.js');
var Util = require('../../utils/util.js');
var HttpUtil = require('../../utils/httpUtil.js');
var arrays = require('../../utils/city.js');
var util = require('../../utils/util.js');
var app = getApp();
//搜索公司高亮

const getInf = (str, key) => str.replace(new RegExp(`${key}`, 'g'), `%%${key}%%`).split('%%');
Page({

  data: {
    //公司列表
    companyList: [],
    cTYPE: 0,
    cTYPE1: 0,
    mobilePosition:0,
    //搜索公司高亮
    companyName: '',
    companyList: [],
    companyListCopy:[],
   
    //职位
    arrayPositions: [],
    areaShowOne: false,
    index: 0,
    //结束
    mainPath: app.globalData.mainPath,
    userPath: app.globalData.userPath,
    imagePath: app.globalData.imagePath,
    isIphoneX: app.globalData.isIphoneX,
    statusBarHeight: app.globalData.statusBarHeight,
    // 地址
    value: [0, 0, 0],
    val: 0,
    statesType: false,
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
    mobileArea:0,
    areaTextCity:'',
    areaShow:false,
    //个人信息
    // examPromtStatus: true,
    realName: '',
    mobile: '',
    areaText: '',
    email: '',
    position: '',
    businessCard: '',
    promptStatus: true,
    promptHeight: 0,
    regType: -1,
    err: 0,
    //取到缓存
    userId: '',
    chooseS: 0,
    tab: 0,
   //手机授权
    sessionkey: '',
    code: '',
    code1:'',
    mobileAccredit:0,
    skipUrl:'',
    skipType:'',
    emailEnd: false,
    iv:'', 
    encryptedData:'',
    // isKey:''
    sign:'',
    id:'',
  },
  onLoad(options) {
    var that = this;
  
    let height = wx.getSystemInfoSync().windifowHeight;
    var id = options.id
    that.setData({
      promptHeight: height,
       skipUrl: options.url,
      // sign: sign,
      skipType:options.type,
      sign: options.sign,
      id: options.id,
    })
    if (options.type == 'ordinary') {
      that.setData({
        skipUrl: options.url + '?id=' + options.id
      })
    } else {
      that.setData({
        skipUrl: options.url,
      })
    }
    that.positionN();
    //取缓存
    var value = wx.getStorageSync('userId');
    var chooseS = wx.getStorageSync('chooseStatus');
    if (chooseS == "hobby") {
      that.setData({
        chooseS: 1
      })
    } else {
      that.setData({
        chooseS: 2
      })
    }
    that.setData({
      userId: value,

    })
    console.log(that.data.userId)
    that.querySessionKey();
  },
  //获取姓名
  getName: function(e) {
    var name = e.detail.value
    var reg = RegExp(/^[a-zA-Z0-9]+$/);
    var reg1 = RegExp(/[,.!\u3002\uff0c]/);
    if (reg.test(name) || reg1.test(name) || name == '') {
      this.setData({
        err: 1,
      });
      Common.dialog(this, "请输入正确的中文姓名信息");
      return;
    } else {
      this.setData({
        err: 0,
        realName: e.detail.value,
      });
    }
  },
  //获取电话需要的sessionkey
  querySessionKey: function() {
    var that = this;
    wx.login({
      success: function(_res) {
        if (_res.code) {
          var code = _res.code;
          console.log("CODE:" + code);
          that.setData({
            code: code,
          })
          var data = {
            code: code,
          }
          var url = app.globalData.userPath + "/mobile/wx/getSessionKey";
          HttpUtil.post(url, data).then((res) => {
            that.setData({
              sessionkey: res.data.entity,
            });
          }).catch((errMsg) => {
            var that = this;
          });
        }
      }
    })
  },

  //电话
  getMobile: function(e) {
    var that = this;
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      that.setData({
        iv: e.detail.iv,
      })
      var data = {
        // code:that.data.code,
        iv: e.detail.iv,
        encryptedData: e.detail.encryptedData,
        sessionKey: that.data.sessionkey,
      }

      var url = app.globalData.userPath + "/mobile/wx/mobile/info";
      HttpUtil.post(url, data).then((res) => {
        console.log(res.data.entity)
        that.setData({
          mobileAccredit:1,
          mobile: res.data.entity.phoneNumber,
        });

      }).catch((errMsg) => {

      });

    }else{
      that.setData({
        mobileAccredit:1 ,
        mobile: e.detail.value,
      })
    }

  },
  //点击显示地区
  areaShowFun: function(e) {
    var that = this;
    that.setData({
      areaShow: true,
      mobileArea:1,
    
    })
  },
  bindChange: function(e) {
    var that = this;
    var val = e.detail.value;

      that.setData({
     
        curretnStates: that.data.states[val[0]],
        curretnProvince: that.data.provinces[val[1]],
        provinceCitys: that.data.citys[val[1]],
        curretnCity: that.data.citys[val[1]][val[2]],
        value: val,
      })

  },
  selectAddress: function() {
    var that = this;
   
      that.setData({
        areaText: that.data.curretnStates + "," + that.data.curretnProvince + "," + that.data.curretnCity,
        areaTextCity: that.data.curretnCity,
        areaShow: false
      })

  },
  //邮件
  getemail: function(e) {
    // 判断邮箱
    var that = this;

    var str = e.detail.value;
    if (str == '' || str.indexOf("@") == -1) {
      this.setData({
        err: 2,
      });
      Common.dialog(this, "请输入正确的邮箱地址信息");
      return;
    } else {
      this.setData({
        err: 0,
        email: str,
      });
    }

  },
  //职位
  getposition: function() {
    this.setData({
      index: 0,
      areaShowOne: true,
      mobilePosition:1,
    })
  },
  selectAddress1() {
    var that = this;
    that.setData({
      areaShowOne: false,
      position: that.data.arrayPositions[that.data.index].name,
    })
  },
  bindChange1: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })

  },
  //职位信息
  positionN: function() {
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
      Common.dialog(that, errMsg); //错误提示信息
    });
  },

  //公司
  getcompanyTop:function(e){
      // 控制滚动
      wx.pageScrollTo({
        scrollTop: e.currentTarget.offsetTop,
        duration: 300
      })
      
  },
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

  // 搜索关键字
  searchTap: function () {
    var that = this;
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
        var tempFilePaths = tempFilePaths1[0];
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
        console.log(fileName)
        that.setData({
          businessCard: '/' + fileName,
        })
        console.log('/' + fileName)
      },
      fail: function (e) {
        console.log(e);
        Common.dialog(that, '上传失败失败，请稍后再试');
      }
    })
  },

  // 注册
  regBtn: function() {
    var that = this;
    if (that.data.chooseS == 2){
      if (that.data.realName == '' && that.data.mobile == '' && that.data.areaText == '' && that.data.email == '' && that.data.position == '' && that.data.companyName == '') {
        wx.showLoading({
          title: '注册中',
        })
      }
    }else{
      if (that.data.realName == '' && that.data.mobile == '' && that.data.areaText == '' && that.data.email == '' ) {
        wx.showLoading({
          title: '注册中',
        })
      }
    }

    var thirdKey = wx.getStorageSync('thirdKey');
    //判断姓名
    if (that.data.realName == '') {
      Common.dialog(this, "请输入正确的中文姓名");
      return;
    }
    //判断手机
    if (that.data.mobile == '') {
      Common.dialog(this, "请输入正确的手机号码");
      return;
    }
    //判断所在地区
    if (that.data.chooseS == 1 &&that.data.areaText == '') {
      Common.dialog(this, "请输入正确的所在地区信息");
      return;
    }
    //判断邮箱
    if (that.data.email == '') {
      Common.dialog(this, "请输入正确的邮箱地址");
      return;
    }
    //判断公司名称
    if (that.data.chooseS == 2 && that.data.companyName == '') {
      Common.dialog(this, "请输入正确的公司名称信息");
      return;
    }
    //判断职位
    if (that.data.chooseS==2&&that.data.position == '') {
      Common.dialog(this, "请输入正确的职位信息");
      return;
    }
    //判断所在地区
    if (that.data.chooseS == 2 && that.data.areaText == '') {
      Common.dialog(this, "请输入正确的所在地区信息");
      return;
    }
    wx.login({
      success: function (_res) {
        if (_res.code) {
          let code = _res.code;
          let keyekyu = '';
          console.log("CODE:" + code);
          wx.getUserInfo({
            
            success: function (e) {
              // console.log(that.data.isKey)
              
              if (that.data.emailEnd==true){
                keyekyu = 'iskey'
                //写入需要时间，首先在在外层声明一个变量，然后将值付给它
                // that.setData({
                //   iskey: keyekyu
                // });
              }
              let data = {
                "code": code,
                "iv": e.iv,
                "encryptedData": e.encryptedData,
                "user.avatar": e.userInfo.avatarUrl,
                "user.type": that.data.chooseS,
                "user.realName": that.data.realName,
                "cityStr": that.data.areaText,
                "user.email": that.data.email,
                "user.mobile": that.data.mobile,
                "user.position": that.data.position,
                "user.companyName": that.data.companyName,
                "user.businessCard": that.data.businessCard,
                'user.id': that.data.userId,
                'iskey': keyekyu
              };
              var url = app.globalData.userPath + "/app/user/update/info"
              HttpUtil.post(url, data).then((res) => {
                wx.hideLoading();//加载中消失
                console.log(res.data.entity)
                console.log("grade:" + res.data.entity.grade);
                wx.setStorageSync('grade', res.data.entity.grade);
                wx.setStorageSync('openId', res.data.entity.thirdKey);
                wx.setStorageSync('mobile', that.data.mobile);
                let userInfo = {
                  'avatar': res.data.entity.avatar,
                  'nickname': res.data.entity.nickname,
                  'realName': res.data.entity.realName
                }
                wx.setStorageSync('userInfo', userInfo);
                let dateStr = util.formatTime(new Date());
                var time = util.formatDate(dateStr, 'YMD');
                console.log(time)
                wx.setStorageSync(time, time);
                that.setData({
                  emailEnd: false,
                })
               //从业者
                if (that.data.chooseS == 2 && that.data.sign != undefined && that.data.sign != null && that.data.sign != '' ){
                  wx.setStorageSync('id', that.data.id);
                  wx.setStorageSync('sign', that.data.sign);
                    wx.switchTab({
                      url: '../activity_show/activity_show'
                    })
                 return;
                } 
               if (that.data.skipType == 'tabber'){
                 wx.switchTab({//爱好者(全调首页)
                   url: that.data.skipUrl,
                   })
                  return;
                }
                 
                if (that.data.skipType == 'ordinary') {
                    wx.redirectTo({
                      url: that.data.skipUrl,
                     })
                     return;
                 }
                    wx.switchTab({//爱好者(全调首页)
                      url: '../NZSP_index/NZSP_index'
                    })
                
              
              }).catch((errMsg) => {
                wx.hideLoading();//加载中消失
                if (errMsg == 'no') {
                   that.setData({
                     emailEnd:true,
                   })
                }else{
                  Common.dialog(that, errMsg); //错误提示信息
                }
              });
            }
          });
        }
      }
    });

  },
  //签到成功（好的）
  signInBtn: function () {
    var that = this;
    that.setData({
      examPromtStatus: true,
    })
  },
  //确定保存
  emailEndOne(){
    this.regBtn();  
  },
    //取消保存
  emailEndOneS: function() {
      this.setData({
        operationPromptStatus: true,
      })
    },
  //点击阴影关闭
  // shadowClick() {
  //   var that = this;
  //   that.setData({
  //     areaShowOne: false,
  //     areaShow: false,
  //   })
  // },

})
//app.js
var util = require('utils/util.js');
App({
  onLaunch: function () {
    // debugger
    // this.getJavaTokenFn();
  },
  getJavaTokenFn: function () {

    console.log("登录的第一次");
    wx.login({
      //login流程获取token
      success: (res) => {
        //登录成功

        if (res.code) {
          var code = res.code;

          wx.getUserInfo({
            //getUserInfo流程
            success: (res2) => {
              const url = 'https://test.aipaike.com/api/login/loginByWxCode.jhtml';
              wx.request({
                url: url,
                method: 'POST',
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                data: {
                  encryptedData: res2.encryptedData,
                  iv: res2.iv,
                  code: code
                },
                success: (data) => {
                  //4.解密成功后 获取自己服务器返回的结果
                  console.log("+++++++++++++++++++++");
                  console.log(data.data.code);
                  this.globalData.openId = data.data.content.openid;
                  if (data.data.code == 0) {
                    var contentData = data.data.content;
                    this.globalData.javaToken = contentData.token;
                    this.globalData.memberRankId = contentData.memberRankId;
                    this.globalData.openId = contentData.openid;
                    this.globalData.imagePath = data.data.content.imagePath;
                    this.globalData.username = data.data.content.nickName;
                    this.globalData.menberRank = data.data.content.menberRank;
                    wx.setStorageSync('globalDataKey', this.globalData);
                  } else if (data.data.code != 0) {
                    var msg = data.data.desc;
                    var imgicon = '../assets/images/warn_icon.png';
                    util.spTips(msg, imgicon);
                  }

                },
                fail: function () {
                  console.log('系统错误')
                }
              })
            }
          });

        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }

    })
  },
  globalData: {
    appid: 'wxb3620e2c3e5f4eb4',
    appSecret: 'ade1adb1314e8ed13550d1baa519eb21',
    userInfo: true,
    javaToken: '',
    apkBase: 'https://test.aipaike.com',
    memberRankId: '',
    openId: '',
    imagePath: '',
    username: '',
    menberRank: ''
  },
  httpGET(url, data, callBack) {
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "Content-Type": "application/json",
        'token': wx.getStorageSync('globalDataKey').javaToken
      },
      data: data,
      success: function (res) {
        callBack(res);

      },
      fail: function (error) {
        console.log(error)
      }
    })
  },
  httpPOST(url, dataJson, callBack) {
    // debugger;
    var that = this;
    wx.request({
      url: url,
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'token': wx.getStorageSync('globalDataKey').javaToken
      },
      data: dataJson,
      success: function (res) {
        callBack(res);
      },
      fail: function (error) {
        console.log(error)
      }
    })
  }
})

var app = getApp()
Page({
  data: {
    /** 
        * 页面配置 
        */
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    menberList: [],//全部
    menberwitePayList: [],//待支付
    imagePath: '',
    username: '',
    menberRank: ''
  },
  payforNow: function (e) {
    var that = this;
    var openid = wx.getStorageSync('globalDataKey').openId;

    var url = "https://test.aipaike.com/api/payment/submit.jhtml";
    var data = { //获取支付信息
      type: "payment",
      paymentPluginId: "weixinAppletPayPlugin",
      sn: e.target.dataset.sn,
      openid: openid,
    };

    app.httpGET(url, data, function (res) {

      wx.requestPayment(
        {
          timeStamp: res.data.content.timeStamp,
          nonceStr: res.data.content.nonceStr,
          package: res.data.content.package,
          signType: res.data.content.signType,
          paySign: res.data.content.paySign,
          success: function (res) {
            wx.redirectTo({
              url: '../paysuccess/paysuccess',
            })
          },
          'fail': function (res) {
            console.log(res)
          },
          'complete': function (res) { }
        })
    }, "GET");

  },
  initData() {
    wx.showToast({
      mask: true,
      title: '加载中',
      icon: 'loading'
    });
    var that = this;

    var urlMenber = "https://test.aipaike.com/api/member/memberIndexSmall.jhtml";
    var openid = wx.getStorageSync('globalDataKey').openId;
    var data = { //个人中心
      openId: openid
    }
    app.httpGET(urlMenber, data, function (res) {
      wx.hideToast();
      that.setData({
        imagePath: res.data.content.imagePath,
        username: res.data.content.nickName,
        menberRank: res.data.content.rankName,
      });
    }, "GET");

    var url = "https://test.aipaike.com/api/member/order/list.jhtml";
    var data = { //全部订单
      pageNumber: 1,
      pageSize: 10,
      platformId: 11,
    }
    app.httpGET(url, data, function (res) {
      that.setData({
        menberList: res.data.content.orderFormList,
      })
    }, "GET");
    var dataWite = { //待支付订单
      pageNumber: 1,
      pageSize: 10,
      platformId: 11,
      paymentStatus: 10,
    }
    app.httpGET(url, dataWite, function (res) {

      console.log(res);
      that.setData({
        menberwitePayList: res.data.content.orderFormList,
      })
    }, "GET");
    /** 
     * 获取系统信息 
     */
    wx.getSystemInfo({

      success: function (res) {
        that.setData({
          winHeight: res.windowHeight
        });
      }

    });
  },
  onShow: function () {
    var that = this;
    var timmer = null;
    if (wx.getStorageSync('globalDataKey') == null || wx.getStorageSync('globalDataKey').javaToken == null) {
      timmer = setInterval(function () {
        app.getJavaTokenFn();

        if (wx.getStorageSync('globalDataKey') && wx.getStorageSync('globalDataKey').javaToken) {
          clearInterval(timmer);

          that.initData();
        }
      }, 800)
    } else {
      that.initData();
    }
  },
  onLoad: function () {
  },
  /** 
     * 滑动切换tab 
     */
  bindChange: function (e) {

    var that = this;
    that.setData({ currentTab: e.detail.current });

  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  }
})  
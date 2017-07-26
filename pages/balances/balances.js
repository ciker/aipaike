// pages/balances/balances.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    alertName: "",//弹窗模板名
    alertMask: "none",//是否显示遮罩
    addressList: [],//地址列表
    detailsList: [],//商品各种属性
    detailsCoumponList: [],//优惠券数组
    orderAmount: '',//应付金额
    choseCouponList: [],//选中的优惠券数组
    couponPrice: '',//优惠的金额
    freightFee: 0,//运费
    priceMarket: 0,//商品价格
    remarkMessage: '',//备注留言
    receiverId: '',//收货地址id
    shippingMethodId: '',//配送方式id
    orgId: '',//商户id
    oderList: [],//订单列表
    orderId: '',//订单id
    consignee: '',//收货人
    areaName: '',//区域全称
    address: '',//收货地址
    phone: '',//手机
    cartItemTypePass: '',
    deductibleFee: 0,//优惠券共优惠多少
    maxRebateValue: '',//本单可返利多少钱
    zoneId: '',//邮编
    shippingMethodName:''//快递方式
  },
  payforNow: function () {
    var that = this;
    var orderFormData = new Object();
    orderFormData.cartItemType = that.data.cartItemTypePass;
    orderFormData.platformId = 11;
    orderFormData.receiverId = that.data.receiverId;
    if (that.data.choseCouponList.length > 0) {
      orderFormData.couponCodeArrayId = that.data.choseCouponList;
    } else {
      var foreachCouponList = that.data.detailsCoumponList;
      for (var i = 0; i < foreachCouponList.length; i++) {
        if (foreachCouponList[i].isSelected == true) {
          var foreachCouponListTrue = [];
          foreachCouponListTrue.push(foreachCouponList[i].couponCodeId);
          orderFormData.couponCodeArrayId = foreachCouponListTrue;
          var balanceTypeIdAnOther = [];

        }
      }
    }

    orderFormData.paymentMethodId = 1;
    var wsOrderGroups = new Array();
    var wsOrderGroup = new Object();
    wsOrderGroup.orgId = that.data.orgId;
    wsOrderGroup.shippingMethodId = that.data.shippingMethodId;
    wsOrderGroup.memo = that.data.remarkMessage;
    wsOrderGroups[wsOrderGroups.length] = wsOrderGroup;
    orderFormData.orderGroupVos = wsOrderGroups;

    wx.request({//
      url: 'https://test.aipaike.com/api/member/order/create.jhtml',
      method: 'POST',
      data: {
        "orderFormData": JSON.stringify(orderFormData)
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': wx.getStorageSync('globalDataKey').javaToken
      },
      success: function (res) {
        debugger;
        that.setData({
          orderId: res.data.content,
        });
        var openid = wx.getStorageSync('globalDataKey').openId;

        var url = "https://test.aipaike.com/api/payment/submit.jhtml";
        var data = { //获取支付信息  
          type: "payment",
          paymentPluginId: "weixinAppletPayPlugin",
          openid: openid,
          orderId: res.data.content,
        }
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
      fail: function () {
        // fail  
      },
      complete: function () {
        // complete  
      }
    })
  },
  choseCoupon: function () {
    var that = this;
    var strConponList = JSON.stringify(that.data.detailsCoumponList)
    debugger
    wx.redirectTo({
      url: '../useCoupon/useCoupon?couponList=' + strConponList + '&couponArrayId=' + that.data.cartItemTypePass,
    })
  },
  closeAlert: function () {
    var that = this
    that.setData({
      alertName: "",
      alertMask: "none",
    })
  },
  alertDetails: function () {
    var that = this;

    that.setData({
      alertName: "alert-screen-template",
      alertMask: "",
    })
  },
  addAddressFun: function () {
    wx.navigateTo({
      url: '../gladdress/gladdress',
    })
  },
  initData(options) {
    wx.showToast({
      mask:'true',
      title: '加载中',
      icon: 'loading'
    });
    var that = this;
    var orderFormData = new Object();
    orderFormData.cartItemType = that.data.cartItemTypePass;
    orderFormData.platformId = 11;
    orderFormData.paymentMethodId = 1;
    orderFormData.couponCodeId = '';
    if (options.couponIdArry != undefined) {
      orderFormData.couponCodeArrayId = options.couponIdArry.split(',');
      that.setData({
        choseCouponList: options.couponIdArry.split(',')
      });

    }

    wx.request({//
      url: 'https://test.aipaike.com/api/member/order/infoNew.jhtml',
      method: 'GET',
      data: {
        "orderFormData": orderFormData
      },
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync('globalDataKey').javaToken
      },
      success: function (res) {
        debugger
        wx.hideToast();
        if (res.data.code != 0) {
          wx.showToast({
            title: res.data.desc,
            icon: 'succes',
            duration: 2000,
            mask: true
          });
          return
        }
        that.setData({
          detailsList: res.data.content.orderGroupVos[0].orderItems[0],
          detailsCoumponList: res.data.content.wsCouponCodeVos,
          orderAmount: res.data.content.factPayFee,
          couponPrice: res.data.content.deductiblefee,
          freightFee: res.data.content.freightFee,
          priceMarket: res.data.content.payAmount,
          receiverId: res.data.content.receiverId,
          shippingMethodId: res.data.content.orderGroupVos[0].shippingMethodId,
          orgId: res.data.content.orderGroupVos[0].orgId,
          oderList: res.data.content.orderGroupVos,
          shippingMethodName: res.data.content.orderGroupVos[0].shippingMethodName,
          areaName: res.data.content.areaName,//区域全称
          address: res.data.content.address,//收货地址
          phone: res.data.content.phone,//手机
          zoneId: res.data.content.b2cAreaVo.zoneId,
          deductibleFee: res.data.content.deductibleFee,
          maxRebateValue: res.data.content.maxRebateValue
        })
        if (res.data.content.consignee != null) {
          that.setData({
            consignee: res.data.content.consignee,//收货人
          })
        }
      },
      fail: function () {
        // fail  
      },
      complete: function () {
        // complete  
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      cartItemTypePass: options.cartItemType
    })
    var timmer = null;
    if (wx.getStorageSync('globalDataKey') == null || wx.getStorageSync('globalDataKey').javaToken == null) {
      timmer = setInterval(function () {
        app.getJavaTokenFn();
        if (wx.getStorageSync('globalDataKey') && wx.getStorageSync('globalDataKey').javaToken) {
          clearInterval(timmer);
          that.initData(options);
        }
      }, 800)
    } else {
      that.initData(options);
    }


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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
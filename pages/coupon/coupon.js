var app = getApp();
var QR = require("../../utils/wxqrcode.js");
// var WxParse = require('../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    alertName: "",//弹窗模板名
    alertMask: "none",//是否显示遮罩
    havenoUsesmArrow: "use_explain_arrow",//未使用初始样式
    haveUsesmArrow: "use_explain_arrow",//已使用初始样式
    haveOverdueArrow: "use_explain_arrow",//已过期初始样式
    havenoUsesList: [],//未使用列表
    haveUsesList: [],//已使用列表
    haveOverdueList: [],//已过期列表
    userCellId: '',//列表id 
    userCellId2: '',//列表id
    userCellId3: '',//列表id
    coupon_code: '',//优惠券号
    coupon_code_img: '',//优惠券号二维码
    codeCou: '',//激活的优惠券号
    replaecHtmlList: [],//未使用
    replaecHtmlListUse: [],//已使用
    WxParseHtml: [],
    useSm: [],//使用说明
    useCount: '',//已使用数量,
    unUseCount: '',//未使用数量,
    expiredCount: '',//已过期数量
    loadingMore: '上拉加载更多',
    unUseCountNum:10,
    pageNum:2
  },
  activationCoupon: function () {
    var urlAc = 'https://test.aipaike.com/api/member/balance/activeCode.jhtml';
    var dataAc = {
      code: that.data.codeCou
    }
    app.httpPOST(arulBuy, dataAc, function (res) {



    }, "POST");
  },
  havenoUseSmDisplay: function (e) { //设置未使用箭头样式
    var that = this;

    debugger
    if (that.data.havenoUsesList[e.currentTarget.dataset.idx].display == 'none') {
      that.data.havenoUsesList[e.currentTarget.dataset.idx].display = 'block';

    }
    else {
      that.data.havenoUsesList[e.currentTarget.dataset.idx].display = 'none'
    };

    that.setData({
      havenoUsesList: that.data.havenoUsesList,
      userCellId: e.currentTarget.dataset.idx,
    });

    // if (that.data.havenoUsesmArrow == "use_explain_arrow") {
    //   that.setData({
    //     havenoUsesmArrow: "use_explain_arrow_up"
    //   });
    // }
    // else {
    //   that.setData({
    //     havenoUsesmArrow: "use_explain_arrow"
    //   });
    // }
  },
  haveUseSmDisplay: function (e) { //设置已使用箭头样式
    var that = this;

    that.setData({
      userCellId2: e.target.dataset.indx,
    });
    // if (that.data.haveUsesmArrow == "use_explain_arrow") {
    //   that.setData({
    //     haveUsesmArrow: "use_explain_arrow_up"
    //   });
    // }
    // else {
    //   that.setData({
    //     haveUsesmArrow: "use_explain_arrow"
    //   });
    // }
  },
  haveOverdueDisplay: function (e) { //设置已过期箭头样式
    var that = this;
    that.setData({
      userCellId3: e.target.dataset.indx,
    });
    // if (that.data.haveOverdueArrow == "use_explain_arrow") {
    //   that.setData({
    //     haveOverdueArrow: "use_explain_arrow_up"
    //   });
    // }
    // else {
    //   that.setData({
    //     haveOverdueArrow: "use_explain_arrow"
    //   });
    // }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  initData() {
    //yeahMiLu
    var that = this;
    var urlTotal = "https://test.aipaike.com/api/member/balance/couponCount.jhtml";
    var data = { //总数

    }
    app.httpGET(urlTotal, data, function (res) {
      that.setData({
        useCount: res.data.content.useCount,//已使用数量,
        unUseCount: res.data.content.unUseCount,//未使用数量,
        expiredCount: res.data.content.expiredCount,//已过期数量
      })

    }, "GET");
    var url = "https://test.aipaike.com/api/member/balance/couponIndex.jhtml";
    var data = { //未使用
      type: 0,
      pageNumber: 1,
      pageSize: 200
    }
    app.httpGET(url, data, function (res) {
      debugger
      console.log(res);
      debugger
      that.setData({
        havenoUsesList: res.data.content.content,
      });

      var replaecHtml = that.data.havenoUsesList;

      var replaecHtmlList = [];
      for (var i = 0; i < replaecHtml.length; i++) {
        replaecHtml[i].display = 'none'
        replaecHtml[i].introduction = replaecHtml[i].introduction.replace(/<br \/\>/g, "\n");
        replaecHtml[i].introduction = replaecHtml[i].introduction.replace(/&nbsp;/g, "");
        replaecHtml[i].introduction = replaecHtml[i].introduction.replace(/;/g, "");

        replaecHtmlList.push(replaecHtml[i].introduction)

      }
      that.setData({
        havenoUsesList: replaecHtml,
        useSm: replaecHtmlList
      })

      // WxParse.wxParse('replaecHtmlList', 'html', replaecHtmlList[5], that, 5);
      // debugger
      // that.setData({
      //   replaecHtmlList: replaecHtmlList
      // });
    }, "GET");



    var datause = {//已使用
      type: 1,
      pageNumber: 1,
      pageSize: 200
    }
    app.httpGET(url, datause, function (res) {
      debugger
      console.log(res);
      that.setData({
        haveUsesList: res.data.content.content,
      });
      var replaecHtml = that.data.haveUsesList;
      var replaecHtmlList = [];
      for (var i = 0; i < replaecHtml.length; i++) {
        replaecHtml[i].introduction = replaecHtml[i].introduction.replace(/<br \/\>/g, '。\n');
        replaecHtml[i].introduction = replaecHtml[i].introduction.replace(/&nbsp;/g, "");
        replaecHtml[i].introduction = replaecHtml[i].introduction.replace(/;/g, "");

        replaecHtmlList.push(replaecHtml[i].introduction)
      }

      that.setData({
        haveOverdueList: res.data.content.content,
        replaecHtmlListUse: replaecHtmlList
      })
    }, "GET");
    var overude = {//已过期
      type: 2,
      pageNumber: 1,
      pageSize: 200
    }
    app.httpGET(url, datause, function (res) {
      debugger
      console.log(res);
      var replaecHtml = that.data.haveUsesList;
      var replaecHtmlList = [];

      for (var i = 0; i < replaecHtml.length; i++) {
        replaecHtml[i].introduction = replaecHtml[i].introduction.replace(/<br \/\>/g, '。\n');
        replaecHtml[i].introduction = replaecHtml[i].introduction.replace(/&nbsp;/g, "");
        replaecHtml[i].introduction = replaecHtml[i].introduction.replace(/;/g, "");

        replaecHtmlList.push(replaecHtml[i].introduction)
      }

      that.setData({
        haveOverdueList: res.data.content.content,
        replaecHtmlListUse: replaecHtmlList
      })
    }, "GET");
    /** 
     * 获取系统信息 
     */
    wx.getSystemInfo({

      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
  },
  tolower: function () {
    var that = this;
    var couponUseList = that.data.havenoUsesList;
    var unUseCountNumNew = that.data.unUseCountNum;
    var j = that.data.pageNum;
    var url = "https://test.aipaike.com/api/member/balance/couponIndex.jhtml";
    var data = { //未使用 
      type: 0,
      pageNumber: j,
      pageSize: 10
    }
    if (unUseCountNumNew >= that.data.unUseCount) {
       that.data.unUseCount = unUseCountNumNew + 10
      // that.data.havenoUsesList.length = that.data.unUseCount;
      return
    }
    app.httpGET(url, data, function (res) {
      console.log(res);
      if (res.data.desc == 'success'){
        debugger
        unUseCountNumNew += 10;
        j++;

        that.setData({
          unUseCountNum: unUseCountNumNew,
          pageNum: j
        })

        
        if (couponUseList.length >= res.data.content.total) {
          that.setData({
            loadingMore: '没有更多了'
          })
          return
        }
debugger
        for (var i = 0; i < res.data.content.content.length; i++) {
          couponUseList.push(res.data.content.content[i])
        };
        that.setData({
          havenoUsesList: couponUseList,
        });

        var replaecHtml = that.data.havenoUsesList;

        var replaecHtmlList = [];
        for (var i = 0; i < replaecHtml.length; i++) {
          replaecHtml[i].introduction = replaecHtml[i].introduction.replace(/<br \/\>/g, "\n");
          replaecHtml[i].introduction = replaecHtml[i].introduction.replace(/&nbsp;/g, "");
          replaecHtml[i].introduction = replaecHtml[i].introduction.replace(/;/g, "");

          replaecHtmlList.push(replaecHtml[i].introduction)

        }
        that.setData({
          useSm: replaecHtmlList
        });
        
      }
      return
  
    }, "GET");
  },
  onShow: function () {
    var that = this;
    var timmer = null;
    if (wx.getStorageSync('globalDataKey') == null || wx.getStorageSync('globalDataKey').javaToken == null) {
      timmer = setInterval(function () {
        app.getJavaTokenFn();
        if (wx.getStorageSync('globalDataKey') && wx.getStorageSync('globalDataKey').javaToken) {
          debugger
          clearInterval(timmer);
          var that = this;
          that.initData()
        }
      }, 800)
    } else {
      debugger
      that.initData();
    }
  },
  closeAlert: function () {
    var that = this
    that.setData({
      alertName: "",
      alertMask: "none",
    })
  },
  alertConpunDetails: function (e) {
    var that = this

    that.setData({

      coupon_code: e.target.dataset.code,
      alertName: "coupon-number-template",
      alertMask: "",
    })
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
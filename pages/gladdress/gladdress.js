// pages/gladdress/gladdress.js
let util = require('../../utils/util.js');
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listAdderssArr:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   

  
  },
  //编辑
  editAddressFn(e){
      let address = e.currentTarget.dataset.address;
      let areaid = e.currentTarget.dataset.areaid;
      let consignee =e.currentTarget.dataset.consignee;
      let isdefault = e.currentTarget.dataset.isdefault
      let phone = e.currentTarget.dataset.phone;
      let zipcode = e.currentTarget.dataset.zipcode;
      let id = e.currentTarget.dataset.id;
      let areaname =  e.currentTarget.dataset.areaname;
      // debugger;

    wx.navigateTo({
      url:'../address/address?consignee='+consignee+'&areaid='+areaid+'&address='+address+'&zipcode='+zipcode+'&phone='+phone+'&isdefault='+isdefault+'&id='+id+'&areaname='+areaname,
    })
    // debugger;

  },
  getListAddress(event){
    let that = this;
    const listAddress = app.globalData.apkBase + '/api/member/receiver/list.jhtml';
    let params={}
    app.httpGET(listAddress,params,function(res){
      // debugger;
      util.hideLoading();
      var  listAdderssArr = res.data.content.receivers;
      that.setData({
        listAdderssArr:listAdderssArr
      })
    })
  },
  delAddressFn(e){
    var _self = this;
    const delUrlAddress = app.globalData.apkBase + '/api/member/receiver/delete.jhtml';
    let addressId =e.currentTarget.dataset.id;
    let params={
      id:addressId
    }
    wx.showModal({
      title: '确认删除该地址吗？',
      success: function(res) {
        if (res.confirm) {
           app.httpPOST(delUrlAddress,params,function(res){
              if(res.data.code == 0){
                 util.spTips('删除成功');
                 _self.getListAddress();
              }
            })
        } else if (res.cancel) {
          
        }
      }
    })
  },
  //设为默认地址
  isDefaultAddressFn(e){
      let _self = this;
      let address = e.currentTarget.dataset.address;
      let areaid = e.currentTarget.dataset.areaid;
      let consignee =e.currentTarget.dataset.consignee;
      let isdefault = e.currentTarget.dataset.isdefault
      let phone = e.currentTarget.dataset.phone;
      let zipcode = e.currentTarget.dataset.zipcode;
      let id = e.currentTarget.dataset.id

      let receiverData = {};
      receiverData.consignee = consignee;
      receiverData.areaId = areaid;
      receiverData.address = address;
      receiverData.zipCode = zipcode;
      receiverData.phone = phone;
      receiverData.isDefault = isdefault;
      receiverData.receiverId = id;

      let params = {
        receiverData:JSON.stringify(receiverData)
      };

      const updateUrl = app.globalData.apkBase + '/api/member/receiver/update.jhtml';
      app.httpPOST(updateUrl,params,function(res){
        if(res.data.code == 0){
            _self.getListAddress();
        }
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
    util.showLoading();

    var that = this;
    var timmer = null;
    if(wx.getStorageSync('globalDataKey') == null || wx.getStorageSync('globalDataKey').javaToken == null){
     timmer =  setInterval(function(){
          app.getJavaTokenFn();
          if(wx.getStorageSync('globalDataKey') && wx.getStorageSync('globalDataKey').javaToken){
            clearInterval(timmer);
            
            this.getListAddress();
          }
      },800)
    }else{
    this.getListAddress();
    }
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
//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var formatLocation = require('../../utils/formatLocation.js')

Page({
  data: {
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    checkResult: '',

    open: false,

    showTime:[],
    partyTime: [],
    sharerNickName: '',
    teamID:'', 
    sharerAvatarUrl:'', 
    activityName:'',
  },

  onLoad(options) {
    console.log(options) //接传递的值
    this.setData({
      showTime: this.changeSelectDateToTextArray(options.partyTime),
      partyTime: this.parseTextToArray(options.partyTime),
      sharerNickName: options.sharerNickName,
      teamID: options.teamID,
      sharerAvatarUrl: options.sharerAvatarUrl,
      activityName: options.activityName,
    })
    this.login().then(() => {
      //请求成功的操作
      console.log("liuchong")
      this.checkIfAlreadyConfirmed(); //先login获得openID再检查
    }); //先接TeamID再login要不没法检查是否二次登录
  },
  parseTextToArray(str){
    var times = str.split(",");
    return times;
  },
  changeSelectDateToTextArray(partyTime) {
    var txt = [];
    var times = partyTime.split(",");

    for (var time of times) {  //不能用in！in是给对象的
      var selectDate = time.split("/");
      var str = '';
      if (selectDate[3] === "0") {
        str = selectDate[0] + '年' + selectDate[1] + '月' + selectDate[2] + '日--------[上午] 9点30'
      } else if (selectDate[3] === "1") {
        str = selectDate[0] + '年' + selectDate[1] + '月' + selectDate[2] + '日--------[下午] 1点30'
      } else {
        str = selectDate[0] + '年' + selectDate[1] + '月' + selectDate[2] + '日--------[晚上] 7点30'
      }
      txt.push(str);
    }
    return txt;
  },
  //login的helper函数
  // 显示失败提示,再次申请权限！！！！
  getAccessShowModel(title, content) {
    var that = this
    wx.hideToast();
    wx.showModal({
      title,
      content: JSON.stringify(content),
      complete: function (res) { //无论成不成功都要显示！所以要用complete，不能用success，用success苹果没问题，安卓不弹窗
        if (res.confirm) {
          console.log('用户点击确定')
          wx.openSetting({
            complete: (res) => {
              if (res.authSetting["scope.userInfo"]) {
                that.login()
              } // 如果成功打开授权
              else { that.getAccessShowModel('集合需要权限', '为了更好的服务，请开启一下权限') } // 如果用户依然拒绝授权
            },
            fail: function () { //调用失败，授权登录不成功
              fail()
            }
          })

        } else if (res.cancel) {
          console.log('用户点击取消')
          wx.openSetting({
            complete: (res) => {
              if (res.authSetting["scope.userInfo"]) {
                that.login()
              } // 如果成功打开授权
              else { that.getAccessShowModel('集合需要权限', '为了更好的服务，请开启一下权限') } // 如果用户依然拒绝授权
            },
            fail: function () { //调用失败，授权登录不成功
              fail()
            }
          })
        }
      }
    })
  },

  // 被分享的用户首次登录
  login() {
    var app = getApp()
    // if (this.data.logged) return
    util.showBusy('正在登录')
    var that = this
    // 调用登录接口
    let promise = new Promise(function (resolve, reject) {
      qcloud.login({
        success(result) {
          // 首次登录，返回用户信息，但是这里的result和wx.getUserInfo的result格式不一样。所以不能存全局变量。
          // if (result) {
          //   util.showSuccess('登录成功1')
          //   that.setData({
          //     // userInfo: result,
          //     logged: true
          //   })

          // }
          // 如果不是首次登录，通过请求接口获取用户信息
          qcloud.request({
            url: config.service.userUrl,
            login: true,
            success(result) { //必须要成功才显示！所以用success
              util.showSuccess('登录成功')
              that.setData({
                userInfo: result.data.data,
                logged: true
              })
              //保存用户信息到全局变量
              app.globalData.userInfo = result.data.data
              console.log(app.globalData.userInfo) //用户信息！
              console.log(that.data.userInfo) //用户信息！
              
              resolve();//等待结束！！！！
            },
            fail(error) {
              that.getAccessShowModel('集合需要权限', '为了更好的服务，请开启一下权限') // 向用户提示需要权限才能继续
              // util.showModel('登陆失败', error)
              console.log('request fail', error)
            }
          })
        },
        fail(error) {
          that.getAccessShowModel('集合需要权限', '为了更好的服务，请开启一下权限') // 向用户提示需要权限才能继续
          // util.showModel('登录失败', error)
          console.log('登录失败', error)
        }
      })
    })

    return promise

  },

  //检查是否二次队
  checkIfAlreadyConfirmed(){
    var that = this
    console.log('openid24444', getApp().globalData.userInfo.openId)
    wx.request({
      url: config.service.checkIfAlreadyConfirmedUrl,
      data: {
        openId: getApp().globalData.userInfo.openId,
        teamID: that.data.teamID,
        activityName: that.data.activityName,
      },
      method: 'GET',
      success(result) {
        // util.showSuccess('已提交')
        console.log('openid2', getApp().globalData.userInfo.openId)
        console.log('request success', result)
        that.setData({
          checkResult: JSON.stringify(result.data)
        })
        console.log('checkResult :', that.data.checkResult)
        if (result.data.data){
          wx.hideToast();
          wx.showModal({
            title:'提示',
            content: '你已经入队啦，请到“正在进行的活动”中查看。',
            complete: function (res) {
              if (res.confirm) {
                wx.redirectTo({
                  url: '../index/index'//?teamID=425   传递值
                })
              }else{
                wx.redirectTo({
                  url: '../index/index'//?teamID=425   传递值
                })
              }
            }
          })
        }
      },
      fail(error) {
        util.showModel('检查请求提交失败', error);
        console.log('request fail', error);
      }
    })
  },
  //选择位置位置
  chooseLocation: function (e) {
    console.log(e)
    var that = this
    wx.chooseLocation({
      success: function (res) {
        // success
        console.log(res.address)
        that.setData({
          hasLocation: true,
          location: {
            longitude: res.longitude,
            latitude: res.latitude,
            address: res.address
          }
        })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },

  confirmRequest: function () {
    var that = this
    let userInfo = getApp().globalData.userInfo

    if (JSON.stringify(this.data.location)==='{}'){
      util.showModel('错误', '请选择出发位置'); 
      return;
    }else{
      console.log(this.data.selectDate)
      console.log(this.data.location)
      util.showBusy('提交匹配中...')
      // var that = this
      console.log("userInfo:"+userInfo) 

      var options = {
        url: config.service.confirmRequestUrl,
        login: true,
        data:{
          nickName: userInfo.nickName,
          openId: userInfo.openId,
          avatarUrl: userInfo.avatarUrl,
          gender: userInfo.gender,
          timestamp: userInfo.watermark.timestamp,
          address: this.data.location.address,
          latitude: this.data.location.latitude,
          longitude: this.data.location.longitude,
          selectDate: this.data.partyTime,
          teamID: this.data.teamID,
          activityName: this.data.activityName,
        },
        method:'GET',
        success(result) {
          util.showSuccess('已提交')
          console.log('request success', result)
          that.setData({
            requestResult: JSON.stringify(result.data)
          })
        },
        fail(error) {
          util.showModel('匹配请求提交失败', error);
          console.log('request fail', error);
        }
      }
      if (this.data.takeSession) {  // 使用 qcloud.request 带登录态登录
        qcloud.request(options)
      } else {    // 使用 wx.request 则不带登录态
        wx.request(options)
      }
    }
    wx.redirectTo({
      url: '../index/index'//?teamID=425   传递值
    })

  },
})
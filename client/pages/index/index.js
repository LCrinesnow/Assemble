//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
  data: {
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    open: false,
    // showList:[],
  },

  onLoad(options) {
    this.login();
  },

  //login的helper函数
  // 显示失败提示,再次申请！！！！
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

  // 用户登录
  login(){
    var app = getApp()
    if (this.data.logged) return
    util.showBusy('正在登录')
    var that = this
    // 调用登录接口
    qcloud.login({
      success(result) {
        // 首次登录，返回用户信息，但是这里的result和wx.getUserInfo的result格式不一样。所以不能存全局变量。
        if (result) {
          util.showSuccess('登录成功1')
          that.setData({
            // userInfo: result,
            logged: true
          })
          // app.globalData.userInfo = result;
          // console.log(app.globalData.userInfo)
        }
        // 如果不是首次登录，通过请求接口获取用户信息
        qcloud.request({
          url: config.service.userUrl,
          login: true,
          success(result) {
            util.showSuccess('登录成功2')
            that.setData({
              userInfo: result.data.data,
              logged: true
            })
            console.log(that.data.userInfo) //用户信息！
            //保存用户信息到全局变量
            app.globalData.userInfo = result.data.data
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
  },
  //跳转篮球
  bindBasketballTap: function () {
    wx.navigateTo({
      url: '../basketball/basketball'  //?userInfo=1   传递值
    })
  },

  sideNav: function (e) {
    if (this.data.open) {
      this.setData({
        open: false
      });
    } else {
      this.setData({
        open: true
      });
    }
  },

  onGoActivity: function() {
    //确保已经获取数据，再跳转
    console.log("eeeeeeeee")
    wx.navigateTo({
      url: '../onGoActivity/onGoActivity'  //?teamID=425   传递值
    })      
  },
  // // 切换是否带有登录态
  // switchRequestMode: function (e) {
  //     this.setData({
  //         takeSession: e.detail.value
  //     })
  //     this.doRequest()
  // },

  // doRequest: function () {
  //     util.showBusy('请求中...')
  //     var that = this
  //     var options = {
  //         url: config.service.requestUrl,
  //         login: true,
  //         success (result) {
  //             util.showSuccess('请求成功完成')
  //             console.log('request success', result)
  //             that.setData({
  //                 requestResult: JSON.stringify(result.data)
  //             })
  //         },
  //         fail (error) {
  //             util.showModel('请求失败', error);
  //             console.log('request fail', error);
  //         }
  //     }
  //     if (this.data.takeSession) {  // 使用 qcloud.request 带登录态登录
  //         qcloud.request(options)
  //     } else {    // 使用 wx.request 则不带登录态
  //         wx.request(options)
  //     }
  // },

  // // 上传图片接口
  // doUpload: function () {
  //     var that = this

  //     // 选择图片
  //     wx.chooseImage({
  //         count: 1,
  //         sizeType: ['compressed'],
  //         sourceType: ['album', 'camera'],
  //         success: function(res){
  //             util.showBusy('正在上传')
  //             var filePath = res.tempFilePaths[0]

  //             // 上传图片
  //             wx.uploadFile({
  //                 url: config.service.uploadUrl,
  //                 filePath: filePath,
  //                 name: 'file',

  //                 success: function(res){
  //                     util.showSuccess('上传图片成功')
  //                     console.log(res)
  //                     res = JSON.parse(res.data)
  //                     console.log(res)
  //                     that.setData({
  //                         imgUrl: res.data.imgUrl
  //                     })
  //                 },

  //                 fail: function(e) {
  //                     util.showModel('上传图片失败')
  //                 }
  //             })

  //         },
  //         fail: function(e) {
  //             console.error(e)
  //         }
  //     })
  // },

  // // 预览图片
  // previewImg: function () {
  //     wx.previewImage({
  //         current: this.data.imgUrl,
  //         urls: [this.data.imgUrl]
  //     })
  // },

  // // 切换信道的按钮
  // switchChange: function (e) {
  //     var checked = e.detail.value

  //     if (checked) {
  //         this.openTunnel()
  //     } else {
  //         this.closeTunnel()
  //     }
  // },

  // openTunnel: function () {
  //     util.showBusy('信道连接中...')
  //     // 创建信道，需要给定后台服务地址
  //     var tunnel = this.tunnel = new qcloud.Tunnel(config.service.tunnelUrl)

  //     // 监听信道内置消息，包括 connect/close/reconnecting/reconnect/error
  //     tunnel.on('connect', () => {
  //         util.showSuccess('信道已连接')
  //         console.log('WebSocket 信道已连接')
  //         this.setData({ tunnelStatus: 'connected' })
  //     })

  //     tunnel.on('close', () => {
  //         util.showSuccess('信道已断开')
  //         console.log('WebSocket 信道已断开')
  //         this.setData({ tunnelStatus: 'closed' })
  //     })

  //     tunnel.on('reconnecting', () => {
  //         console.log('WebSocket 信道正在重连...')
  //         util.showBusy('正在重连')
  //     })

  //     tunnel.on('reconnect', () => {
  //         console.log('WebSocket 信道重连成功')
  //         util.showSuccess('重连成功')
  //     })

  //     tunnel.on('error', error => {
  //         util.showModel('信道发生错误', error)
  //         console.error('信道发生错误：', error)
  //     })

  //     // 监听自定义消息（服务器进行推送）
  //     tunnel.on('speak', speak => {
  //         util.showModel('信道消息', speak)
  //         console.log('收到说话消息：', speak)
  //     })

  //     // 打开信道
  //     tunnel.open()

  //     this.setData({ tunnelStatus: 'connecting' })
  // },

  // /**
  //  * 点击「发送消息」按钮，测试使用信道发送消息
  //  */
  // sendMessage() {
  //     if (!this.data.tunnelStatus || !this.data.tunnelStatus === 'connected') return
  //     // 使用 tunnel.isActive() 来检测当前信道是否处于可用状态
  //     if (this.tunnel && this.tunnel.isActive()) {
  //         // 使用信道给服务器推送「speak」消息
  //         this.tunnel.emit('speak', {
  //             'word': 'I say something at ' + new Date(),
  //         });
  //     }
  // },

  // /**
  //  * 点击「关闭信道」按钮，关闭已经打开的信道
  //  */
  // closeTunnel() {
  //     if (this.tunnel) {
  //         this.tunnel.close();
  //     }
  //     util.showBusy('信道连接中...')
  //     this.setData({ tunnelStatus: 'closed' })
  // }
})

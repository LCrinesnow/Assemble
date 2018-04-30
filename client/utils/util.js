const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


// 显示繁忙提示
var showBusy = text => wx.showToast({
  title: text,
  icon: 'loading',
  duration: 10000
})

// 显示成功提示
var showSuccess = text => wx.showToast({
  title: text,
  icon: 'success'
})

// 显示失败提示
var showModel = (title, content) => {
  wx.hideToast();
  wx.showModal({
    title,
    content: JSON.stringify(content),
    showCancel: false
  })
}

// // 用户登录
// var login = function () {
//   var app = getApp()
//   if (this.data.logged) return
//   util.showBusy('正在登录')
//   var that = this
//   // 调用登录接口
//   qcloud.login({
//     success(result) {
//       // 首次登录，返回用户信息，但是这里的result和wx.getUserInfo的result格式不一样。所以不能存全局变量。
//       if (result) {
//         util.showSuccess('登录成功')
//         that.setData({
//           userInfo: result,
//           logged: true
//         })
//         // app.globalData.userInfo = result;
//         // console.log(app.globalData.userInfo)
//       }
//       // 如果不是首次登录，通过请求接口获取用户信息
//       qcloud.request({
//         url: config.service.userUrl,
//         login: true,
//         success(result) {
//           util.showSuccess('登录成功')
//           that.setData({
//             userInfo: result.data.data,
//             logged: true
//           })
//           console.log(that.data.userInfo) //用户信息！
//           //保存用户信息到全局变量
//           app.globalData.userInfo = result.data.data
//         },
//         fail(error) {
//           util.getAccessShowModel('集合需要权限', '为了更好的服务，请开启一下权限') // 向用户提示需要权限才能继续
//           // util.showModel('登陆失败', error)
//           console.log('request fail', error)

//         }
//       })
//     },
//     fail(error) {
//       util.getAccessShowModel('集合需要权限', '为了更好的服务，请开启一下权限') // 向用户提示需要权限才能继续

//       // util.showModel('登录失败', error)
//       console.log('登录失败', error)
//     }
//   })
// }

//用于获取信息和登陆
module.exports = {
  formatTime, showBusy, showSuccess, showModel
}

//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var formatLocation = require('../../utils/formatLocation.js')

Page({
  data: {
    partyTime:'', 
    nickName:'', 
    avatarUrl:'',
    teamID:'', 
    showList:[], 
  },

  onLoad(options) {
    console.log(options) //接传递的值
    this.getTeamMember().then(() => {
      var app =getApp();
      this.setData({
        nickName: app.globalData.userInfo.nickName,
        avatarUrl: app.globalData.userInfo.avatarUrl,
        openId: app.globalData.userInfo.openId,
        showList: app.globalData.showList,//展示列表
      })
    }); 
    // console.log(this.data.partyTime) //接传递的值
  },

  changeSelectDateToText(str){
    var selectDate=str.split("/");
    var txt='';
    if (selectDate[3]==="0"){
      txt = selectDate[0] + '年'+selectDate[1]+'月'+selectDate[2]+'日,[上午] 9点30'
    } else if (selectDate[3] === "1"){
      txt = selectDate[0] + '年' + selectDate[1] + '月' + selectDate[2] + '日,[下午] 1点30'
    }else{
      txt = selectDate[0] + '年' + selectDate[1] + '月' + selectDate[2] + '日,[晚上] 7点30'
    }
    return txt;
  },

  
  //根据openId获取所有匹配好了的Activity list 传到前台
  getTeamMember() {
    var app = getApp()
    util.showBusy('正在加载')
    var that = this
    let promise = new Promise(function (resolve, reject) {
      wx.request({
        url: config.service.getTeamMemberUrl,
        data: {
          openId: getApp().globalData.userInfo.openId,
        },
        method: 'GET',
        success(result) {
          app.globalData.showList = result.data.data;
          // that.setData({
          //   showList: result.data.data,
          // })
          // for (let team of result.data.data){
          //   for(let person of team){
          //     console.log(person.nickName)
          //     console.log(person.avatarUrl)
          //     console.log(person.gender)
          //     console.log(person.activityName)
          //   }
          // }
          console.log(JSON.stringify(result.data) + 'pppppp')
          resolve();//等待结束！！！！
          util.showSuccess('载入成功')
        }, fail(error) {
          util.showModel('检查请求提交失败', error);
          console.log('request fail', error);
        }
      })
    })
    return promise
  },
})
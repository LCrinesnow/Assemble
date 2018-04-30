//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var formatLocation = require('../../utils/formatLocation.js')

Page({
  data: {
    partyTime:'', 
    showTime:[],
    nickName:'', 
    teamID:'',  
    avatarUrl:'',
    activityName:'',

  },

  onLoad(options) {
    console.log(options) //接传递的值
    this.setData({
      partyTime: options.partyTime,
      showTime: this.changeSelectDateToTextArray(options.partyTime),
      nickName: options.nickName,
      teamID: options.teamID,
      avatarUrl: options.avatarUrl,
      activityName: options.activityName,
    })
    console.log(this.data.partyTime +"partyTime") //接传递的值
  },
  changeSelectDateToTextArray(partyTime){
    var txt=[];
    var times = partyTime.split(",");

    for(var time of times){  //不能用in！in是给对象的
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

  //转发分享   Bug：title和desc用不了
  onShareAppMessage: function () {
    return {
      title: '',
      desc: this.data.nickName+'邀请你在'+this.data.partyTime+'一起组队!',
      path: '/pages/accept/accept?teamID=' + this.data.teamID + '&partyTime=' + this.data.partyTime + '&sharerNickName=' + this.data.nickName + '&sharerAvatarUrl=' + this.data.avatarUrl + '&activityName=' + this.data.activityName, //传teamID给对方
    }
  },

  //转发二维码

  //保存二维码
  // wx.saveImageToPhotosAlbum({
  //   success(res) {
  //   }
  // }),

  //跳转生成二维码或邀请  页
  bindCheckOnGoActivityTap: function () {
    wx.redirectTo({
      url: '../onGoActivity/onGoActivity'  //?teamID=425   传递值
    })
  },

})
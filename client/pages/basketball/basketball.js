//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var formatLocation = require('../../utils/formatLocation.js')

Page({
  data: {
    hasEmptyGrid: false,
    cur_year: '',
    cur_month: '',
    selectDate: [], //for 数据库
    hasLocation: false, //是否有地理位置
    colorIndex: [],//使用wxs需要在Page里面声明
    pickerTimeFrame: ["上午", "下午", "晚上"],
    nickName:'',
    avatarUrl: '',
    teamID:'',
    activityName:'Basketball',
    // modalHidden:true
    location:{},
    // requestResult:'',
  },
  onLoad(options) {
    this.setNowDate();
    // console.log(options) 接传递的值
  },
  // modalIfChooseInvaildDate:function(e) {
  //   console.log(e)
  //   const date = new Date();
  //   const cur_year = date.getFullYear();
  //   const cur_month = date.getMonth() + 1;
  //   const today = date.getDate() - 1;
  //   const pickday = e.currentTarget.dataset.idx;

  //   console.log(Number(cur_year) +" "+ Number(this.data.cur_year))
  //   console.log(Number(cur_month)+" "+ Number(this.data.cur_month))
  //   // console.log(cur_month >= this.data.cur_month)
  //   console.log(pickday +" "+ today)

  //   // 日期符合规定
  //   if (cur_year >= this.data.cur_year && cur_month >= this.data.cur_month && pickday >=today){
  //     console.log('ok')
  //     this.setData({
  //       modalHidden: true
  //     })
  //   } else {      // 日期不符合规定
  //     console.log('not ok')
  //     this.setData({
  //       modalHidden: false
  //     })
  //   }

  // },
  // modalClicked: function (e) {
  //   this.setData({
  //     modalHidden: true
  //   })
  // },
  bindPickerChange: function (e) {
    console.log(e)
    var cur_day_item = e.currentTarget.dataset.itm; //这个itm和前端的data-itm关联
    var time = e.detail.value;

    //得到后端String存入MySQL
    var selectDateString = this.dateSelectAction(cur_day_item, time);

    //当前日期是否已选
    var selectDateIndex = this.data.selectDate.indexOf(selectDateString);
    if (selectDateIndex != -1) { //已选 删除
      console.log(selectDateIndex)
      this.data.selectDate.splice(selectDateIndex, 1)
    } else { //未选 添加
      this.data.selectDate.push(selectDateString)
    }

    var colorIndex = this.getColorIndex();

    console.log(colorIndex)
    console.log(`点击的日期:${this.data.cur_year}年${this.data.cur_month}月${cur_day_item.num}保存日期:${this.data.selectDate}`);

    //刷新前端
    this.setData({
      // selectDateFrontEnd: this.data.selectDate,
      colorIndex: colorIndex,
      cur_day_item: time
    })
  },
  getColorIndex() {
    //获取当前页面的染色日期索引
    var dataSqe = this.data.selectDate;
    var year = this.data.cur_year
    var month = this.data.cur_month
    var colorIndex = []
    for (var ele of dataSqe) {
      if (Number(ele.split('/')[0]) === year && Number(ele.split('/')[1]) === month) {
        colorIndex.push(Number(ele.split('/')[2]))
      }
    }
    return colorIndex;
  },
  dateSelectAction(cur_day_item, time) {
    // var cur_day = e.currentTarget.dataset.idx; //这个itm和前端的data-idx关联
    // cur_day_item = e.currentTarget.dataset.itm; //这个itm和前端的data-itm关联

    // console.log(cur_day_item.num-1)
    cur_day_item.time = time;
    console.log(cur_day_item.time)

    var selectDateString = this.data.cur_year + '/' + this.data.cur_month + '/' + cur_day_item.num + '/' + cur_day_item.time;

    return selectDateString;
  },

  setNowDate: function () {
    const date = new Date();
    // console.log(date.getFullYear())
    // console.log(date.getMonth())
    // console.log(date.getDate())
    const cur_year = date.getFullYear();
    const cur_month = date.getMonth() + 1;
    const todayIndex = date.getDate() - 1;

    console.log(`日期索引，从零开始：${todayIndex}`)
    const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
    this.calculateEmptyGrids(cur_year, cur_month);
    this.calculateDays(cur_year, cur_month);
    this.setData({
      cur_year: cur_year,
      cur_month: cur_month,
      weeks_ch,
      todayIndex,
    })
  },

  getThisMonthDays(year, month) {  //获得当月日期
    return new Date(year, month, 0).getDate();
  },
  getFirstDayOfWeek(year, month) {
    return new Date(Date.UTC(year, month - 1, 1)).getDay();
  },
  calculateEmptyGrids(year, month) {
    const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
    let empytGrids = [];
    if (firstDayOfWeek > 0) {
      for (let i = 0; i < firstDayOfWeek; i++) {
        empytGrids.push(i);
      }
      this.setData({
        hasEmptyGrid: true,
        empytGrids
      });
    } else {
      this.setData({
        hasEmptyGrid: false,
        empytGrids: []
      });
    }
  },
  calculateDays(year, month) {
    let days = [];
    const thisMonthDays = this.getThisMonthDays(year, month);

    for (let i = 1; i <= thisMonthDays; i++) {
      //日期格式
      var s = i + ''
      var day = {
        num: i,
        time: '',
      }
      days.push(day);
    }
    this.setData({
      days
    });
  },
  handleCalendar(e) {
    const handle = e.currentTarget.dataset.handle;
    const cur_year = this.data.cur_year;
    const cur_month = this.data.cur_month;

    const date = new Date();//当天功能：获取当天月份和年份
    const todayYear = date.getFullYear();//当天功能：获取当天月份和年份
    const todayMonth = date.getMonth() + 1;//当天功能：获取当天月份和年份
    const todayIndex = date.getDate() - 1;//当天功能：获取当天月份和年份

    if (handle === 'prev') {
      let newMonth = cur_month - 1;
      let newYear = cur_year;
      if (newMonth < 1) {
        newYear = cur_year - 1;
        newMonth = 12;
      }

      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);

      //获得后一月的colorIndex
      var colorIndex = []
      for (var ele of this.data.selectDate) {
        if (Number(ele.split('/')[0]) === newYear && Number(ele.split('/')[1]) === newMonth) {
          colorIndex.push(Number(ele.split('/')[2]))
        }
      }
      //当天功能：上月是当天月
      if (newYear === todayYear && newMonth === todayMonth) {
        this.setData({
          cur_year: newYear,
          cur_month: newMonth,
          colorIndex: colorIndex,
          todayIndex: todayIndex  //当天功能：换月当天的标志显示
        })
      } else {
        this.setData({
          cur_year: newYear,
          cur_month: newMonth,
          colorIndex: colorIndex,
          todayIndex: -1  //当天功能：换月当天的标志消失
        })
      }

    } else {
      let newMonth = cur_month + 1;
      let newYear = cur_year;
      if (newMonth > 12) {
        newYear = cur_year + 1;
        newMonth = 1;
      }

      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);

      //获得前一月的colorIndex
      var colorIndex = []
      for (var ele of this.data.selectDate) {
        if (Number(ele.split('/')[0]) === newYear && Number(ele.split('/')[1]) === newMonth) {
          colorIndex.push(Number(ele.split('/')[2]))
        }
      }
      //当天功能：下一个月是当天月
      if (newYear === todayYear && newMonth === todayMonth) {
        this.setData({
          cur_year: newYear,
          cur_month: newMonth,
          colorIndex: colorIndex,
          todayIndex: todayIndex  //当天功能：换月当天的标志显示
        })
      } else {
        this.setData({
          cur_year: newYear,
          cur_month: newMonth,
          colorIndex: colorIndex,
          todayIndex: -1  //当天功能：换月当天的标志消失
        })
      }
    }
  },
  //地图函数
  //获取经纬度
  // getLocation: function (e) {
  //   console.log(e)
  //   var that = this
  //   wx.getLocation({
  //     success: function (res) {
  //       // success
  //       console.log(res)
  //       that.setData({
  //         hasLocation: true,
  //         location: {
  //           longitude: res.longitude,
  //           latitude: res.latitude
  //         }
  //       })
  //     }
  //   })
  // },
  //根据经纬度在地图上显示
  // openLocation: function (e) {
  //   console.log("openLocation" + e)
  //   var value = e.detail.value
  //   wx.openLocation({
  //     longitude: Number(value.longitude),
  //     latitude: Number(value.latitude)
  //   })
  // },
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

  //后端传值
  // bindLocationInput:function(){
    
  // },
  //匹配

  matchRequest: function () {
    var that = this
    let userInfo = getApp().globalData.userInfo

    if (JSON.stringify(this.data.location)==='{}'){
      console.log(JSON.stringify(this.data.location) + "ooooo")
      util.showModel('错误', '请选择出发位置');
      return
    } else if (JSON.stringify(this.data.selectDate)==='[]'){
      util.showModel('错误','请选择空闲时间');
      return
    }else{
      console.log(this.data.selectDate)
      console.log(this.data.location)
      util.showBusy('提交匹配中...')
      // var that = this
      console.log("userInfo:"+userInfo) 
      this.data.nickName = userInfo.nickName;
      this.data.teamID = 'team-' + Date.now();
      this.data.avatarUrl = userInfo.avatarUrl;

      var options = {
        url: config.service.matchRequestUrl,
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
          selectDate: JSON.stringify(this.data.selectDate),
          teamID: this.data.teamID,
          activityName: this.data.activityName,
          // requestTime: requestTime
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

    //跳转生成二维码或邀请  页  但是navigateTo就页面就进栈了.redirectTo页面不进栈，点左上角不会返回“匹配界面”。
    wx.redirectTo({
      url: '../invite/invite?nickName=' + this.data.nickName + '&partyTime=' + this.data.selectDate + '&teamID=' + this.data.teamID + '&avatarUrl=' + this.data.avatarUrl + '&activityName=' + this.data.activityName //?teamID=425   传递值
    })

  },
  // //跳转生成二维码或邀请  页
  // bindBasketballTap: function () {
  //   wx.navigateTo({
  //     url: '../invite/invite'  //?teamID=425   传递值
  //   })
  // },
})
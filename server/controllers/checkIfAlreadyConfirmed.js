const qcloud = require('../qcloud')
const { mysql } = qcloud

module.exports = async ctx => {
  // var confirmRequest = {
  //   teamID:ctx.query.teamID,
  //   userOpenId: ctx.query.openId, //先登录拿到openId再通过get请求用openId验证
  // }
  
  // if (ctx.query.activityName === 'Basketball')
  //   teamMemberLog = await mysql("Team-Member-Basketball").select('openId').where({ teamID: ctx.query.teamID })
  // if (ctx.query.activityName === 'Boardgame')
  //   teamMemberLog = await mysql("Team-Member-Boardgame").select('openId').where({ teamID: ctx.query.teamID })
  teamMemberLog = await mysql("Team-Members").select('openId').where({ teamID: ctx.query.teamID })

  //checking
  var result=false;
  for (var log of teamMemberLog){
    if (log.openId === ctx.query.openId){
      result = true;
      break;
    }
  }
  ctx.state.data = result;
}

// 用knex
// var knex = require('knex')({
//   client: 'mysql',
//   connection: {
//     host: 'localhost',
//     port: 3306,
//     user: 'root',
//     password: 'wxb366c43b3a096ade',
//     database: 'cAuth',
//     charset: 'utf8mb4'
//   }
// });

// const { mysql } = require('../config');

// var knex = require('knex')({
//   client: 'mysql',
//   connection: {
//     host: config.host,
//     port: config.port,
//     user: config.user,
//     password: config.pass,
//     database: config.db,
//     charset: config.char,
//     multipleStatements: true
//   }
// });

// async function post(ctx, next) {
//   // 增
//   var matchRequest = {
//     nickName: ctx.query.nickName,
//     openId: ctx.query.openId,
//     avatarUrl: ctx.query.avatarUrl,
//     gender: ctx.query.gender,
//     timestamp: ctx.query.timestamp,
//     address: ctx.query.address,
//     latitude: ctx.query.latitude,
//     longitude: ctx.query.longitude,
//     selectDate: ctx.query.selectDate,
//     // requestTime: mysql
//   }
//   await qcloud.mysql("Basketball-Location-SpareTime").insert(matchRequest)
//   // 查
//   // var res = await mysql("Book").where({ id }).first()
//   // // 改
//   // await mysql("Book").update({ price: 66 }).where({ id })
//   // // 删
//   // await mysql("Book").del().where({ id })
//   ctx.state.data = ctx
// }

// module.exports = {
//   post
// }
const qcloud = require('../qcloud')

module.exports = async ctx => {
  
  //basketball_Teams 格式[{teamID:team-xxxxxxx},{},{}]
  // var basketball_Teams = await qcloud.mysql("Team-Member-Basketball").select('teamID').where({ openId: ctx.query.openId})
  // var boardgame_Teams = await qcloud.mysql("Team-Member-Boardgame").select('teamID').where({ openId: ctx.query.openId})

  var Teams = await qcloud.mysql("Team-Members").select('teamID').where({ openId: ctx.query.openId})
  // var basketball_teamMates_teamID =[]
  // var boardgame_teamMates_teamID =[]
  var teamMates_teamID =[]

  for (team of Teams) {
    var temp = await qcloud.mysql("Team-Members").column('nickName', 'avatarUrl', 'gender', 'activityName').select().where({ teamID: team.teamID })
    teamMates_teamID.push(temp)

  // for (team of basketball_Teams){
  //   var temp = await qcloud.mysql("Team-Member-Basketball").column( 'nickName', 'avatarUrl', 'gender','activityName').select().where({ teamID: team.teamID })
  //   basketball_teamMates_teamID.push(temp)
  }
  //basketball_teamMates_teamID 格式：如果有两队
  //[[{"nickName":"大差距","avatarUrl":"https:...","gender":1},{..},{..}],[{},{},{}]]  两个数组两个队

  // for (team of boardgame_Teams) {
  //   var temp = await qcloud.mysql("Team-Member-Boardgame").column('nickName', 'avatarUrl', 'gender', 'activityName').select().where({ teamID: team.teamID })
  //   boardgame_teamMates_teamID.push(temp)
  // }
  // var all_teamMates_teamID = basketball_teamMates_teamID.concat(boardgame_teamMates_teamID)
  var all_teamMates_teamID = teamMates_teamID.reverse()
  ctx.state.data = all_teamMates_teamID
}
//废
async function match(){
  // 查
  var id = 6;
  // var res = await mysql("Basketball-Location-SpareTime").where({ id }).first()
  var res = await mysql("Basketball-Location-SpareTime").del().where({ id })
  // var res = await mysql("Basketball-Location-SpareTime").insert({})
  return res
}

module.exports={
  match
}
const mongoose = require('mongoose');

//?authSource=admin解决权限验证失败问题
const db=mongoose.createConnection('mongodb://lihongbo:admin888@localhost:27017/covidDatabase?authSource=admin',{useNewUrlParser:true,useUnifiedTopology:true},err => {
  if (err) throw err
})
const caseListModel=db.model('caseList',{
  confirmed: String,
  died: String,
  crued: String,
  relativeTime: String,
  confirmedRelative: String,
  diedRelative: String,
  curedRelative: String,
  asymptomaticRelative: String,
  asymptomatic: String,
  curConfirm: String,
  curConfirmRelative: String,
  icuDisable: String,
  area: String,
  subList:Array
})
const caseOutsideListModel=db.model('caseOutsideList',{
  confirmed: String,
  died: String,
  crued: String,
  relativeTime: String,
  icuDisable: String,
  curConfirm:String,
  area: String,
  confirmedRelative: String,
  curedPercent:String,
  diedPercent:String,
  subList:Array
})
const summaryDataInModel=db.model('summaryDataIn',{
  confirmed: String,
  died: String,
  cured: String,
  asymptomatic:String,
  asymptomaticRelative: String,
  unconfirmed: String,
  relativeTime: String,
  confirmedRelative:String,
  unconfirmedRelative: String,
  curedRelative: String,
  diedRelative:String,
  icu:String,
  icuRelative:String,
  overseasInput: String,
  unOverseasInputCumulative: String,
  overseasInputRelative:String,
  unOverseasInputNewAdd: String,
  curConfirm: String,
  curConfirmRelative: String,
  icuDisable: String
})
const summaryDataOutModel=db.model('summaryDataOut',{
  confirmed: String,
  died: String,
  curConfirm:String,
  cured:String,
  confirmedRelative:String,
  curedRelative: String,
  diedRelative:String,
  curConfirmRelative:String,
  relativeTime:String,
  curedPercent:String,
  diedPercent:String
})
const globalListModel=db.model('globalList',{
  area: String,
  subList: Array,
  died: String,
  crued:String,
  confirmed: String,
  curConfirm: String,
  confirmedRelative: String
})
const topAddCountryModel=db.model('topAddCountry',{
  name:String,
  value:String
})
const topOverseasInputModel=db.model('topOverseasInput',{
  name:String,
  value:String
})
const asymptomaticTopProvinceModel=db.model('asymptomaticTopProvince',{
  name:String,
  value:String
})
const newAddTopProvinceModel=db.model('newAddTopProvince',{
  name:String,
  local:String,
  overseasInput:String
})
const allForeignTrendModel = db.model('allForeignTrend',{
  updateDate:Array,
  list:Array
})
const trendModel = db.model('trend',{
  updateDate:String,
  confirmed:Number,
  unConfirmed:Number,
  cured:Number,
  died:Number,
  newConfirmed:Number,
  newUnConfirmed:Number,
  newCured:Number,
  newDied:Number,
  overseasInput:Number,
  newOverseasInput:Number
})

const spiderArticleModel = db.model('spiderArticle',{
  articleId:Number,
  type:Number,
  show:Boolean,
  text:String,
  date:String,
  textContent:String,
  title:String,
  url:String,
})
const userModel = db.model('user',{
  userName:String,
  password:String,
  phone:Number,
  type:Number,
  userId:String
})
const articleModel = db.model('article',{
  date:String,
  url:String,
  title:String,
  text:String,
  type:String,
  status:Number,
  unique:String || Number,
  textHeader:String,
  textDate:String,
  author:String,
  show:Boolean,
  textContent:Array
})

const reportModel = db.model('report',{
  name:String,
  card:String,
  phone:String,
  regionIn:Array,
  regionOut:Array,
  start:String,
  end:String,
  address:String,
  resource1:String,
  resource2:String,
  resource3:String,
  userName:String,
  userId:String,
  danger:Number,
  userPhone:String
})

module.exports= {
  caseListModel,
  caseOutsideListModel,
  summaryDataInModel,
  summaryDataOutModel,
  globalListModel,
  topAddCountryModel,
  topOverseasInputModel,
  asymptomaticTopProvinceModel,
  newAddTopProvinceModel,
  allForeignTrendModel,
  trendModel,
  articleModel,
  spiderArticleModel,
  userModel,
  reportModel
}
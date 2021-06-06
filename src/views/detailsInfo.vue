<template>
  <div class="detailsInfo-tabs">
  <div class="coverage">
    <div class="tableContainer">
      <div class="list-search-news">
        <div class="news-view" v-for="(k,v) in tableData" :key="v" @click="showArticle(k,v)">
          <div class="news-header"><h3>{{k.title}}</h3></div>
          <div class="news-main"><p>{{k.text}}</p></div>
          <div class="news-footer"><p><span class="date">{{k.date}}</span></p></div>
        </div>
      </div>
    </div>
  </div>
   <div class="pagination">
     <el-pagination
       background
       @size-change="handleSizeChange"
       @current-change="handleCurrentChange"
       :current-page="currentPage"
       layout="prev, pager, next"
       :total="this.total">
     </el-pagination>
   </div>
  </div>
</template>

<script>
  import {getArticleData, getPersonalArticle} from "../request/api";
  export default {
    name: "detailsInfo",
    props:{
        msg:String,
        currentType:Number
    },
    data(){
      return{
        keyWords:1,
        color:['#DA4308','#EC0D2C','#FE9022','#1860D5','#00A4C7'],
        RgbaColor:['rgba(218,67,8,.1)','rgba(236,13,44,.1)','rgba(254,144,34,.1)','rgba(24,96,213,.1)','rgba(0,164,199,.1)'],
        tableData:[],
        currentPage: 1,
        total:10,
        pageSize:5,
        pageNum:1,
        type:0
      }
    },
    methods:{
      async showArticle(item,index){
        this.$router.push({
          name: 'ArticleDetails',
          params: {
            id: index,
            ...item
          }
        })
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.pageSize = 5
        this.pageNum = val
        this.init(this.currentType)
      },
      ruleTitle(keyWords,data,dom) {
        data=`<div>${data}</div>`
        if (!data) {
          return '';
        }
        if (keyWords && keyWords.length > 0) {
          // 匹配关键字正则
          let replaceReg = new RegExp(keyWords, 'g');
          // 高亮替换v-html值
          let replaceString = '<span style="color: #FD660B;display: inline-block;text-align: center;">' + keyWords + '</span>';
          // 开始替换
          dom.innerHTML = data.replace(replaceReg, replaceString);
        }
      },
      setTextColor(keyWords){
        let body=document.getElementsByClassName('coverage-body')
        let title=document.getElementsByClassName('title')
        body.forEach((item,index)=>{
          this.ruleTitle(keyWords,this.tableData[index].text,item)
          this.ruleTitle(keyWords,this.tableData[index].title,title[index])
        })
      },
     async init(type=0){
       this.tableData = []
       if (type==3){
         await getPersonalArticle({type:3,pageSize:2,pageNum:1,show:true}).then(res=>{
           this.tableData = res.content.data
         })
       }else {
         await getArticleData({type:type,pageSize:this.pageSize,pageNum:this.pageNum}).then(res=>{
           const data = res.content.data
           const {type,total,pageSize,pageNum} = res.content
           this.total = total
           this.pageSize = pageSize
           this.pageNum = pageNum
           this.type = type
           data.forEach(item=>{
             //去掉一些多余的dom元素
             item.text = item.text.replace("<h3>","")
             item.text = item.text.replace("</h3>","")
             item.text = item.text.replace("<em>","")
             item.text = item.text.replace("</em>","")
             this.parseDom(item,this.tableData)
           })
         })
       }

      }
    },
    mounted() {
      this.setTextColor(this.$route.params.keyWords)
    },
    watch:{
      msg(newValue){
        this.setTextColor(newValue)
      }
    }

  }
</script>

<style scoped>
 @import '../../public/css/info.css';
  .el-icon-search{
    padding-top: 10px;
    height: 40px;
    font-size: 20px;
    color: #B3B3B3;
  }
 .list-search-news {
   padding: 0 20px;
   border-bottom: 1px solid #e3e3e3;
   overflow: hidden;
 }
 .news-view {
   border-bottom: 1px dashed #ccc;
   padding: 15px 0;
 }
 .news-header {
   padding: 5px 0;
 }
 .news-header a {
   font-size: 16px;
   line-height: 24px;
   color: #333;
   font-weight: 700;
   padding-right: 5px;
 }
</style>
<!--  -->
<template>
  <div class="container">
    <div class="Header">
      <div class="searchAndCop">
        <div class="search">
          <el-input placeholder="请输入内容" v-model="input" class="input-with-select" @input="getSearchOrder" >
<!--            <el-select v-model="select" slot="prepend" placeholder="请选择" @change="setInput">-->
<!--              <el-option v-for="(item,index) in option" :label="item.name" :value="item.name" :key="index"></el-option>-->
<!--            </el-select>-->
            <el-button slot="append" icon="el-icon-search" @click="getSearchOrder"></el-button>
          </el-input>
        </div>
        <div class="cop" @click="toManage">
          {{admin==0 ? '信息管理' :'我要发布'}}
        </div>
      </div>
    </div>
    <div class="thinkBody">
      <div class="newPolicy">
        <div class="newPolicy-head">
          <div class="rectAndTitle">
            <div class="rect"></div>
            <div class="head-title">{{policy.first}}</div>
          </div>
          <div class="arrowAndText" @click="getDetailByIndex(0)">
            <div class="arrowAndText-text">更多</div>
            <div class="el-icon-arrow-right arrow"></div>
          </div>
        </div>
        <div class="tableContainer">
          <div class="list-search-news">
            <div class="news-view"  v-for="(item,index) in tableData" :key="index" @click="showArticle(item,index)">
              <div class="news-header"><h3>{{item.title}}</h3></div>
              <div class="news-main"><p>{{item.text}}</p></div>
              <div class="news-footer"><p><span class="date">{{item.date}}</span></p></div>
            </div>
          </div>
        </div>
      </div>
      <div class="policyItem">
        <div class="forth-contain">
        <div class="policyItem-forth" v-for="(item,index) in policyForth" :key="index">
           <div class="newPolicy-head">
             <div class="rectAndTitle">
               <div :class="[item.type===0?'rect-cured':'orange']"></div>
               <div class="head-title">{{item.title}}</div>
             </div>
             <div class="arrowAndText" @click="getDetailByIndex(index+1)">
               <div class="arrowAndText-text">更多</div>
               <div class="el-icon-arrow-right arrow"></div>
             </div>
           </div>
           <div class="tableContainer">
             <div class="list-search-news">
               <div class="news-view"  v-for="(k,v) in item.table" :key="v" @click="showArticle(k,v)">
                 <div class="news-header"><h3>{{k.title}}</h3></div>
                 <div class="news-main"><p>{{k.text}}</p></div>
                 <div class="news-footer"><p><span class="date">{{k.date}}</span></p></div>
               </div>
             </div>
           </div>
        </div>
        </div>
        <div class="policyItem-five">
<!--          个人文章-->
          <div class="five-item" v-if="policy.second.table.length>0">
            <div class="newPolicy-head">
              <div class="rectAndTitle">
                <div class="rect-green"></div>
                <div class="head-title">{{policy.second.title}}</div>
              </div>
              <div class="arrowAndText" @click="getDetailByIndex(0)">
                <div class="arrowAndText-text">更多</div>
                <div class="el-icon-arrow-right arrow"></div>
              </div>
            </div>
            <div class="tableContainer">
              <div class="list-search-news">
                <div class="news-view"  v-for="(item,index) in policy.second.table" :key="index" @click="showArticle(item,index)">
                  <div class="news-header"><h3>{{item.title}}</h3></div>
                  <div class="news-main"><p>{{item.text}}</p></div>
                  <div class="news-footer"><p><span class="date">{{item.date}}</span><span class="date" style="margin-left: 30px">作者：{{item.author}}</span></p></div>
                </div>
              </div>
            </div>
          </div>
<!--          信息预警-->
          <div class="forth-specia-item" v-if="policy.third.table.length>0">
            <div class="newPolicy-head">
              <div class="rectAndTitle">
                <div class="rect-worning"></div>
                <div class="head-title">{{policy.third.title}}</div>
              </div>
              <div class="arrowAndText" @click="getDetailByIndex(0)">
<!--                <div class="arrowAndText-text">更多</div>-->
<!--                <div class="el-icon-arrow-right arrow"></div>-->
              </div>
            </div>
            <div class="user-alert">
              <el-table
                :data="this.policy.third.table"
                height="350"
                style="width: 100%">
                <el-table-column
                  prop="name"
                  label="姓名"
                  min-width="50">
                </el-table-column>
                <el-table-column
                  prop="start"
                  min-width="50"
                  label="出发城市">
                </el-table-column>
                <el-table-column
                  prop="end"
                  min-width="50"
                  label="到达城市">
                </el-table-column>
                <el-table-column
                  prop="resource1"
                  min-width="40"
                  label="接触患者">
                </el-table-column>
                <el-table-column
                  prop="resource2"
                  min-width="40"
                  label="发热咳嗽">
                </el-table-column>
                <el-table-column
                  prop="resource3"
                  min-width="40"
                  label="境外接触">
                </el-table-column>
                <el-table-column
                  prop="danger"
                  min-width="40"
                  label="危险程度">
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {getArticleData,clearAllArticle,getPersonalArticle,getDangerUser,fuzzyArticle,fuzzyPersonArticle,fuzzyUserInfo,updateAllArticle} from "../request/api";
  export default {
    data() {
      return {
        admin:9,
        input:'',
        select:'',
        country: '国',
        category:'疫苗',
        option:[
          {name:'最新消息',type:0,pageSize:5,pageNum:1},
          {name:'防控指南',type:2,pageSize:2,pageNum:1},
          {name:'疫情趋势',type:1,pageSize:2,pageNum:1},
          {name:'个人文章',type:3,pageSize:2,pageNum:1},
          {name:'信息预警',type:6,pageSize:2,pageNum:1}
        ],
        RgbaColor:['rgba(218,67,8,.1)','rgba(236,13,44,.1)','rgba(254,144,34,.1)','rgba(24,96,213,.1)','rgba(0,164,199,.1)'],
        tableData:[],
        policy:{
          first:'最新消息',
          second:{
            title:'个人文章',
            type:0,
            table:[]
          },
          third:{
            title:'信息预警',
            type:0,
            table:[]
          }
        },
        policyForth:  [
          {
            title:'防控指南',
            type:1,
            table:[]
          },
          {
            title:'疫情趋势',
            type:0,
            table:[]
          },
        ],
        allData:[]
      };
    },
    methods: {
      //搜索
     async getSearchOrder(){
       this.policyForth[0].table = []
       this.policyForth[1].table = []
       this.tableData = []
       if (!this.input){
        await this.init()
       }else {
         await fuzzyArticle({keyWords:this.input}).then(res=>{
           if (res.content.length>0){
             let data = res.content,i = 0,j=0,k=0
             data.forEach(item=>{
               if (item.type==0 && item.show==true){

                 this.tableData.push(item)
                 i++
               }
               if (item.type==1 && item.show==true && j<2){
                 this.policyForth[1].table.push(item)
                 j++
               }
               if (item.type==2 && item.show==true && k<2){
                 this.policyForth[0].table.push(item)
                 k++
               }
             })
           }
         })
         await fuzzyPersonArticle({keyWords:this.input}).then(res=>{
           this.policy.second.table = []
           let data = res.content,i=0
           if (data.length>0){
             data.forEach(item=>{
               if (item.type==3 && item.show==true && i<2){
                 this.policy.second.table.push(item)
                 i++
               }
             })
           }
         })
         await fuzzyUserInfo({keyWords:this.input}).then(res=>{
           this.policy.third.table = []
           let data = res.content,i=0
           if (data.length>0){
             data.forEach(item=>{
               this.policy.third.table.push(item)
             })
           }
         })
       }

      },
      setInput(){
        console.log(this.select)
      },
      getDetailByIndex(index){
        this.$router.push({
          name: 'ThinktankDetails',
          params: {
            id: index
          }
        })
      },
      toManage(){
       this.admin==0 ?
        this.$router.push('/ThinkTankManagement'):
         this.$router.push({
           name: 'ArticleDetails',
           params: {
             type: 4         //type=4表示新增
           }
         })
      },
    async showArticle(item,index){
        this.$router.push({
          name: 'ArticleDetails',
          params: {
            ...item
          }
        })
      },
      getHref(content) {
        if (!content) {
          return "";
        }
        let urlPattern = /((?:http:\/\/)?w{3}(?:.[\w]+)+)/g
          //(https?:\/\/|www\.)[a-zA-Z_0-9\-@]+(\.\w[a-zA-Z_0-9\-:]+)+(\/[\(\)~#&\-=?\+\%/\.\w]+)?/g;
        let href
        content = content.replace(urlPattern, (match)=> {
            href = match;
          // if (match.indexOf("http") == -1) {
          //   href = "http://" + match;
          // }
        });
        return href;
      },
      replaceDom(data,table){
        data.forEach(item=>{
         if (item.text){
           //去掉一些多余的dom元素
           item.text = item.text.replace("<h3>","")
           item.text = item.text.replace("</h3>","")
           item.text = item.text.replace("<em>","")
           item.text = item.text.replace("</em>","")
           this.parseDom(item,table)
         }
        })
      },
      async init(){
        //type  0 最新消息 1疫情趋势 2防控指南
       await getArticleData({type:0,pageSize:5,pageNum:1}).then(res=>{
         const data = res.content.data
         this.replaceDom(data,this.tableData)
       })
        await getArticleData({type:1,pageSize:2,pageNum:1}).then(res=>{
          const data = res.content.data
          this.replaceDom(data,this.policyForth[1].table)
        })
        await getArticleData({type:2,pageSize:2,pageNum:1}).then(res=>{
          const data = res.content.data
          this.replaceDom(data,this.policyForth[0].table)
        })
          await getPersonalArticle({type:3,pageSize:2,pageNum:1,show:true}).then(res=>{
            res.content.data.forEach(item=>{
              this.policy.second.table.push(item)
            })
        })
      await  getDangerUser({danger:4}).then(res=>{
          res.content.forEach(item=>{
            let obj = {}
            obj.name = item.name
            obj.start = item.start
            obj.end = item.end
            obj.resource1 = item.resource1 ==='是' ? '疑似' :item.resource1
            obj.resource2 = item.resource2
            obj.resource3 = item.resource3 ==='是' ? '疑似' :item.resource3
            if (item.danger<=6){
              obj.danger = '中等'
            }
            if (item.danger>=6 && item.danger<=8){
              obj.danger = '偏高'
            }
            if (item.danger>=8 && item.danger<9){
              obj.danger = '高'
            }
            if (item.danger>=9){
              obj.danger = '极高'
            }
            this.policy.third.table.push(obj)
          })

        })
        await this.rebuild()
      },
      async rebuild(){
        await getArticleData({}).then(async res=>{
          const data = res.content
         await this.replaceDom(data,this.allData)
          for (let i=0;i<this.allData.length;i++){
            await updateAllArticle(this.allData[i]).then(res=>{

            })
          }
        })
        // .catch(async e=>{
        //   //重构
        //   await updateAllArticle(this.allData).then(res=>{
        //     console.log(res,'===')
        //   })
        // })
        // //重构
      }
    },
    mounted() {
      this.admin = sessionStorage.getItem('type')
      this.init()

    // let s = this.readFile('123.txt')
    //  this.tableData = this.parseDom(s)
    }
  };
</script>
<style scoped>
  @import '../../public/css/thinktank.css';
  .copSpan{
    display: inline-block;
    width: 56px;
    height: 26px;
    text-align: center;
    background: rgba(230, 0, 18, 0.1);
    font-size: 16px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #DA4308;
    line-height: 26px;
    border-radius: 13px;
  }
  .container{
    background-color:#EEF2F4;
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
  .news-footer{
    margin-top: 10px;
  }
  .user-alert{
    width: 100%;
    padding: 10px;
  }
</style>


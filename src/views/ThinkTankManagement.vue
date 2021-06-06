<template>
  <div class="container" >
    <div class="manage" v-if="admin==0"  >
      <div class="crumbsa">
        <crumbs></crumbs>
      </div>
      <div class="management">
        <div class="thinkSearch">
          <div class="thinkSearch-title">信息管理</div>
          <div class="thinkSearch-input">
            <el-input placeholder="请输入内容" v-model="input" @input="getSearchOrder">
              <el-button slot="append" icon="el-icon-search" @click="getSearchOrder" />
            </el-input>
          </div>
          <div class="thinkSearch-filter">筛选</div>
          <div class="thinkSearch-select">
            <el-checkbox-group v-model="checkList" @change="changeSearch">
              <el-checkbox :label="item" v-for="(item,index) in title" :key="index" change="changeSearch" ></el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="thinkSearch-button">
            <div class="button-clear">重置</div>
            <div class="button-enter">确认</div>
          </div>
        </div>
        <div class="management-table">
          <div class="add-contain">
            <div></div>
            <div class="add-think" @click="jumpToAdd">新增</div>
          </div>
          <div class="management-table-item">
            <el-table
              :data="tableData"
              height="800"
              style="width: 100%">
              <el-table-column
                prop="number"
                label="编号"
                min-width="40">
              </el-table-column>
              <el-table-column
                prop="title"
                label="文章标题"
                min-width="280">
              </el-table-column>
              <el-table-column
                prop="name"
                label="分类">
              </el-table-column>
              <el-table-column
                prop="person"
                label="发布人">
              </el-table-column>
              <el-table-column
                prop="date"
                min-width="100"
                label="发布时间">
              </el-table-column>
              <el-table-column
                prop="show"
                min-width="100"
                label="是否公开">
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.show"
                    @change="openOrFalse(scope)"
                  >
                  </el-switch>
                </template>
              </el-table-column>
              <el-table-column
                prop="opera"
                min-width="200"
                label="操作"
              >
                <template slot-scope="scope">
                  <div class="opera">
                    <el-link type="primary" @click="showDetails(scope)">查看</el-link>
                    <el-popover
                      placement="top-start"
                      width="180"
                      trigger="hover">
                      <div>
                        <el-button type="primary" @click="review(scope,1)">通过</el-button>
                        <el-button type="danger" @click="review(scope,2)">不通过</el-button>
                      </div>
                      <el-link type="warning" slot="reference" v-if="scope.row.type==3 && scope.row.status==0" >审核</el-link>
                    </el-popover>
                    <div class="review-tip" v-if="scope.row.type==3 && scope.row.status!=0">{{scope.row.status==1 ? '已审核通过' : '审核未通过'}}</div>
                    <el-link type="success" v-if="scope.row.type==3" @click="changeInfo(scope)">修改</el-link>
                    <el-link type="danger" @click="deleteArticle(scope)">删除</el-link>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
    <div v-else  class="report-tip">
      <div class="tip-item-manage">您不具备管理权限，请联系管理员!</div>
    </div>
  </div>


</template>

<script>
  import crumbs from "../components/crumbs";
  import detailsInfo from "./detailsInfo";
  import {getArticleData,fuzzyPersonArticle,fuzzyArticle, deleteArticle,setSystemArticle, getPersonalArticle,deletePersonalArticle,reviewPersonalArticle} from "../request/api";
  import {MessageBox, Message} from 'element-ui';

  export default {
    name: "ThinkTankManagement",
    data() {
      return {
        admin:1,
        value: '',
        input: '',
        checkList: ['国家','个人'],
        title: [
          '国家',
          '个人',
        ],
        tableData: [],
        split:0
      }
    },
    components: {
      crumbs,
    },
    methods: {
      //显示隐藏
      openOrFalse(scope) {
        if ((scope.row.status==2 || scope.row.status==0) && scope.row.show){
          this.$message.error('审核未通过文章不可展示！')
          scope.row.show = false
        }else {
          if (scope.row.type==3){
            reviewPersonalArticle({unique:scope.row.unique,show:scope.row.show}).then(res=>{
              if (res.content.msg) {
                Message({
                  type: 'success',
                  message: res.content.msg
                });

                this.init()
              }
            })
          }else {
            console.log(scope.row)
            setSystemArticle({articleId:scope.row.articleId,show:scope.row.show}).then(res=>{
              console.log(res,'111')
              if (res.content.msg) {
                Message({
                  type: 'success',
                  message: res.content.msg
                });
                this.init()
              }
            })
          }
        }

      },
      //修改
      changeInfo(scope) {
        this.$router.push({
          name: 'ArticleDetails',
          params: {
            change:true,
            ...scope.row
          }
        })
      },
      //查看
      showDetails(scope) {
        this.$router.push({
          name: 'ArticleDetails',
          params: {
            ...scope.row
          }
        })
      },
      //新增
      jumpToAdd() {
        this.$router.push({
          name: 'ArticleDetails',
          params: {
            type: 4         //type=4表示新增
          }
        })
      },
      //搜索
      async getSearchOrder(){
        this.tableData = []
        if (!this.input){
          await this.init()
        }
        await fuzzyArticle({keyWords:this.input,manage:true}).then(res=>{
          console.log(res)
          if (res.content.length>0){
            let data = res.content,i = 0,j=0,k=0
             data = res.content.reverse()
            this.split =  data.length
            data.forEach((item,index) => {
              //去掉一些多余的dom元素
              item.text = item.text.replace("<h3>", "")
              item.text = item.text.replace("</h3>", "")
              item.text = item.text.replace("<em>", "")
              item.text = item.text.replace("</em>", "")
              item.number = index+1
              this.parseDom(item, this.tableData)
            })
          }
        })
        await fuzzyPersonArticle({keyWords:this.input,manage:true}).then(res=>{
          let data = res.content
          data = data.reverse()
          if (data.length>0){
            this.tableData.push(...data)
            this.tableData.forEach((item, index) => {
              item.number = index + 1
              item.person = item.author ? item.author : '-----'
              item.name = item.type == 3 ? '个人' : '国家'
            })
          }
        })
      },
      async init() {
        //清除数据
        this.tableData = []
        await getArticleData({}).then(res => {
          const data = res.content.reverse()
          this.split = res.content.length
          data.forEach(item => {
            //去掉一些多余的dom元素
            item.text = item.text.replace("<h3>", "")
            item.text = item.text.replace("</h3>", "")
            item.text = item.text.replace("<em>", "")
            item.text = item.text.replace("</em>", "")
            this.parseDom(item, this.tableData)
          })
          getPersonalArticle({type:3}).then(res=>{
            //反转数组展示最新的文章
            let data = res.content.reverse()
            this.tableData.push(...data)
            this.tableData.forEach((item, index) => {
              item.number = index + 1
              item.person = item.author ? item.author : '-----'
              item.name = item.type == 3 ? '个人' : '国家'
            })
          })
        })
      },
      //筛选
      async changeSearch(){
        //清除数据
        this.tableData = []
        if (this.checkList.length===1 && this.checkList.includes('国家')){
          await getArticleData({}).then(res => {
            const data = res.content.reverse()
            this.split = res.content.length
            data.forEach(item => {
              //去掉一些多余的dom元素
              item.text = item.text.replace("<h3>", "")
              item.text = item.text.replace("</h3>", "")
              item.text = item.text.replace("<em>", "")
              item.text = item.text.replace("</em>", "")
              this.parseDom(item, this.tableData)
            })
          })
        }else if (this.checkList.length===1 && this.checkList.includes('个人')){
          getPersonalArticle({type:3}).then(res=>{
            //反转数组展示最新的文章
            let data = res.content.reverse()
            this.tableData = this.tableData
            this.tableData.push(...data)
            this.tableData.forEach((item, index) => {
              item.number = index + 1
              item.person = item.author ? item.author : '-----'
              item.name = item.type == 3 ? '个人' : '国家'
            })
          })
        }else if (this.checkList.length===0){
          this.tableData = []
        }else {
         await this.init()
        }
      },
      //审核
      review(scope,status) {
        scope.row.status = status
        console.log(status,'===')
        reviewPersonalArticle({unique:scope.row.unique,status}).then(res=>{
          if (res.content.msg) {
            Message({
              type: 'success',
              message: res.content.msg
            });
            this.init()
          }
        })
      },
      //删除
      deleteArticle(scope) {
        MessageBox.confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          this.tableData.splice(scope.$index, 1)
          let tip
          if (scope.row.type==3){
            await deletePersonalArticle({unique:scope.row.unique}).then(res=>{
              tip = res.content.msg
            })
          }else if (scope.row.type==0||scope.row.type==1||scope.row.type==2){
            await deleteArticle({articleId: scope.row.id}).then(res=>{
              tip = res.content.msg
            })
          }
          Message({
            type: 'success',
            message: tip
          });
        }).catch(() => {
          Message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    },
    mounted() {
      this.init()
      this.admin = sessionStorage.getItem('type')
    }
  }
</script>

<style scoped>
  @import '../../public/css/manage.css';

  .report-tip{
    width: 100%;
    height: 800px;
    padding: 40px 20px;
    position: relative;
  }
  .tip-item-manage{
    width: 100%;
    min-height: 200px;
    text-align: center;
    line-height: 200px;
    font-size: 24px;
    color: #99045f;
    letter-spacing: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
  }
  .reported-icon{
    font-size: 40px;
    color: #99045f;position: absolute;right: 10px;
    top: -5px;
  }
</style>
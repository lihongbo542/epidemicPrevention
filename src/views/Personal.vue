<template>
<div class="user-center">
<div class="user">
  <el-divider></el-divider>
  <div class="user-text">用户名：<span>{{userName}}</span>
<!--    暂时不支持修改用户名，修改用户名会产生很多bug-->
<!--    <span class="el-icon-edit-outline icon" @click="changeUserInfo('userName')" ></span>-->
  </div>
  <el-divider></el-divider>
  <div class="user-text">密码：<span>******</span><el-link class="icon" type="warning" @click="changeUserInfo('password')" >修改密码</el-link></div>
  <el-divider></el-divider>
  <div class="user-text user-title">手机号：<span>{{phone}}</span><el-link class="icon" @click="changeUserInfo('phone')" type="warning">更换手机号</el-link></div>
  <el-collapse v-model="activeNames" @change="handleChange" class="test">
    <el-collapse-item title="我的文章" name="3">
      <el-table
        :data="articleData"
        height="800"
        style="width: 100%">
        <el-table-column
          prop="titleShow"
          label="文章标题"
          min-width="150">
        </el-table-column>
        <el-table-column
          prop="date"
          min-width="150"
          label="发布时间">
        </el-table-column>
        <el-table-column
          prop="statusShow"
          min-width="70"
          label="当前状态">
        </el-table-column>
        <el-table-column
          prop="opera"
          min-width="70"
          label="操作"
        >
          <template slot-scope="scope">
            <div class="opera-user">
              <el-link type="success" style="margin-right: 10px" class="user-opera"  @click="changeArticle(scope)">修改</el-link>
              <el-link type="danger"  @click="deleteArticle(scope)">删除</el-link>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-collapse-item>
    <el-collapse-item title="用户管理" name="4" v-if="type==0">
      <el-table
        :data="userData"
        height="800"
        style="width: 100%">
        <el-table-column
          prop="userName"
          label="用户名"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="id"
          min-width="50"
          label="用户ID">
        </el-table-column>
        <el-table-column
          prop="card"
          min-width="50"
          label="身份">
        </el-table-column>
        <el-table-column
          prop="phone"
          min-width="80"
          label="手机号">
        </el-table-column>
        <el-table-column
          prop="opera"
          min-width="150"
          label="操作"
        >
          <template slot-scope="scope">
            <div class="opera">
              <el-link type="success" class="user-opera"  @click="changeInfo(scope)">{{scope.row.type==1 ? '设为管理员' :'设为普通用户'}}</el-link>
              <el-popover
                placement="top-start"
                width="60"
                trigger="hover">
                <div class="between-btn">
                  <el-link type="primary" @click="changeUserInfo('phone',scope)">电话号码</el-link>
                  <el-link type="primary" @click="changeUserInfo('password',scope)">密码</el-link>
                </div>
                <el-link type="warning" class="user-opera" slot="reference"  >编辑</el-link>
              </el-popover>
              <el-link type="danger" @click="deleteUserInfo(scope)">删除</el-link>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-collapse-item>
  </el-collapse>
</div>
  <el-dialog
    title="信息修改"
    :visible.sync="vis"
    width="25%"
  >
    <el-form :model="ruleForm" status-icon :rules="registerRules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="用户名" prop="userName" v-if="currentChange==='userName'" >
        <el-input v-model.number="ruleForm.userName"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phone" v-if="currentChange==='phone'"  >
        <el-input v-model.number="ruleForm.phone"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass" v-if="currentChange==='password'" >
        <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass" v-if="currentChange==='password'" >
        <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</div>
</template>

<script>
  import {getPersonalArticle, deletePersonalArticle,deleteUser,setUserAdmin, deleteArticle,updateUserInfo,getUserList} from "../request/api";
  import {Message, MessageBox} from "element-ui";

  export default {
    name: '',
    data() {
      let checkUserName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('用户名不能为空'));
        }
        setTimeout(() => {
          callback();
        }, 1000);
      };
      let checkPhone = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('手机号不能为空'));
        }
        setTimeout(() => {
          if (!Number.isInteger(value)) {
            callback(new Error('请输入数字值'));
          } else {
            callback();
          }
        }, 1000);
      };
      let validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      let validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      }
      return {
        activeNames: ['1'],
        userName:'',
        phone:'',
        type:1,
        userId:'',
        articleData:[],
        userData:[],
        status:['待审核','审核通过','审核未通过'],
        currentChange:'',
        currentChangeUserId:'',
        vis:false,
        ruleForm: {
          password: '',
          checkPass: '',
          phone: '',
          userName:'',
          //0 超级用户 1 普通用户
          type:1
        },
        registerRules: {
          pass: [
            {validator: validatePass, trigger: 'blur'}
          ],
          checkPass: [
            {validator: validatePass2, trigger: 'blur'}
          ],
          userName: [
            {validator: checkUserName, trigger: 'blur'}
          ],
          phone: [
            {validator: checkPhone, trigger: 'blur'}
          ]
        }
      }
    },
    methods:{
      handleChange(val) {
        console.log(val);
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      async changeInfo(scope){

        await setUserAdmin({userId:scope.row.userId,admin:scope.row.type==0?1:0}).then(res=>{
          if (res.content.msg){
            this.$message({
              message: res.content.msg,
              type: 'success'
            });
            this.init()
          }else {
            this.$message.error('操作失败!')
          }
        })
      },
      changeUserInfo(type,scope){
        this.currentChange = type
        this.vis = true
        if (scope){
          this.currentChangeUserId = scope.row.userId
        }
      },
      //修改验证
      submitForm(formName){
        this.$refs[formName].validate(async (valid) => {
          if (valid){
              const {userName,phone,password} = this.ruleForm

              await updateUserInfo({userId: this.currentChangeUserId ? this.currentChangeUserId : this.userId,newName:userName,phone,password}).then(res=>{
                if (res.content.msg){
                  if (password){
                    this.$message({
                      message: '已修改密码，请重新登录！',
                      type: 'success'
                    });
                    setTimeout(()=>{
                      this.$router.push("/Login");
                      sessionStorage.clear()
                    },1000)
                  }else {
                    this.$message({
                      message: res.content.msg,
                      type: 'success'
                    });
                    this.vis = false
                    this.init()
                  }
                }else {
                  this.$message.error(res.content.error)
                }
              })

            //重置数据
            this.ruleForm = {
              password: '',
              checkPass: '',
              phone: '',
              userName:'',
              //0 超级用户 1 普通用户
              type:1
            }
            this.currentChangeUserId = ''
          }
        })
      },
      async init(){
        //获取当前用户信息
        getUserList({userId:this.userId}).then(res=>{
          this.userName = res.content[0].userName
          this.phone = res.content[0].phone
          sessionStorage.setItem('userName',this.userName)
        })
        //获取用户列表
        getUserList({all:true}).then(res=>{
          res.content.forEach(item=>{
            let obj = {}
            if (item.phone && item.userId){
              obj.userId = item.userId
              obj.id = item.userId.slice(0,4)+'...'
              obj.userName = item.userName
              obj.card = item.type == 0 ?'管理员':'用户'
              obj.type = item.type
              obj.phone = item.phone.toString().slice(0,3)+'****'
            }
            this.userData.push(obj)
          })
        })
        getPersonalArticle({author:this.userName,type:3}).then(res=>{
          res.content.forEach(item=>{
            const {date,status,title} = item
            item.date = date
            item.statusShow = this.status[Number(status)]
            item.titleShow = title.length>10 ? title.slice(0,10)+'...' :title
            this.articleData.push(item)
            if (date && status && title){
            }

          })
        })
        //清除数据
        this.userName = ''
        this.phone = ''
        this.userData = []
        this.articleData = []
      },
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
      },
      deleteUserInfo(scope){
        MessageBox.confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let tip
         await deleteUser({userId:scope.row.userId}).then(res=>{
           tip = res.content.msg
           this.init()
         })
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
      },
      //修改
      changeArticle(scope) {
        this.$router.push({
          name: 'ArticleDetails',
          params: {
            change:true,
            ...scope.row
          }
        })
      },
    },
    mounted() {
      this.userId = sessionStorage.getItem('userId')
      this.userName = sessionStorage.getItem('userName')
      this.phone = sessionStorage.getItem('phone')
      this.type = sessionStorage.getItem('type')
      this.init()
    }
  }
</script>


<style type="text/css" scoped>
.user-center{
  width: 100%;
  min-height: 800px;
  align-items: center;
  justify-content: center;
}
.icon{
  position: absolute;
  top: 3px;
  right: 300px;
}
.opera-user{

}
  .user{
    width: 600px;
    height: 800px;
    margin: auto;
    padding: 40px 20px;
  }
  .test >>> .el-collapse-item__header{
    height: 90px !important;
    font-size: 16px;
    color: #282d38;
  }
  .user-title{
    padding-bottom: 30px;
  }
  .user-text{
    text-align: left;
    font-size: 16px;
    color: #282d38;
    display: flex;
    flex-direction: row;
    position: relative;
  }
  .user-opera{
    margin-right: 10px;
  }
  .between-btn{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
</style>

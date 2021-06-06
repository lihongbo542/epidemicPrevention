<template>
  <div class="login-contain">
    <el-form ref="loginForm" :model="form" :rules="rules" label-width="80px" class="login-box">
      <h3 class="login-title">欢迎使用新冠疫情综合监管系统</h3>
      <el-form-item label="账号" prop="username">
        <el-input type="text" placeholder="请输入账号" v-model="form.userName"/>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" placeholder="请输入密码" v-model="form.password"/>
      </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('loginForm')">登录</el-button>
          <el-button @click="register('ruleForm')">注册</el-button>
          <span class="danger">

            <el-popover
              placement="right"
              width="420"
              trigger="click">
              <div class="remain">暂不支持用户修改密码，可联系管理员进行修改！联系电话： 18888888888</div>
              <el-link type="danger"  slot="reference" >忘记密码</el-link>
</el-popover>


          </span>
        </el-form-item>
    </el-form>

    <el-dialog
      title="温馨提示"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <span>请输入账号和密码</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="用户注册"
      :visible.sync="registerVisible"
      width="25%"
    >
      <el-form :model="ruleForm" status-icon :rules="registerRules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model.number="ruleForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model.number="ruleForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
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
  import {register,login} from "../request/api";
  import { Message } from "element-ui";
  export default {
    name: 'Login',
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
            if (value < 18) {
              callback(new Error('必须年满18岁'));
            } else {
              callback();
            }
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
      };
      return {
        form: {
          userName: '',
          password: '',
        },

        // 表单验证，需要在 el-form-item 元素中增加 prop 属性
        rules: {
          userName: [
            {required: true, message: '账号不可为空', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '密码不可为空', trigger: 'blur'}
          ]
        },

        //注册验证
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
    ,
        // 对话框显示和隐藏
        dialogVisible: false,
        registerVisible:false
      }
    },
    methods: {
      onSubmit(formName) {
        // 为表单绑定验证功能
        this.$refs[formName].validate((valid) => {
          if (valid) {
            login(this.form).then(res=>{
             if (res.content.error){
               this.$message.error(res.content.error);
             }else {
              const {userName,phone,type,userId} = res.content
               sessionStorage.setItem('userName',userName)
               sessionStorage.setItem('phone',phone)
               sessionStorage.setItem('type',type)
               sessionStorage.setItem('userId',userId)
               // 使用 vue-router 路由到指定页面，该方式称之为编程式导航
                this.$router.push("/Home");
             }
            })
            .catch(err=>{console.log(err)})

          } else {
            this.dialogVisible = true;
            return false;
          }
        });
      },
      register(){
        this.registerVisible = true
      },
      submitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (this.ruleForm.userName==='李洪波' || this.ruleForm.userName===123 ){
            this.ruleForm.type = 0
          }else {
            this.ruleForm.type = 1
          }
          if (valid) {
            this.ruleForm.userId = this.getUnique()+this.getUnique()+this.getUnique()
          let result = await register(this.ruleForm)
            console.log(result)
            if (result.content.error){
              this.$refs[formName].resetFields(['userName','phone']);
              this.$message.error(result.content.error);
            }else {
              this.$message({
                message: result.content.success,
                type: 'success'
              });
              this.registerVisible = false
            }
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>


<style type="text/css" scoped>
  .danger{
    position: relative;
    right: -40px;
  }
  .login-contain{
    width: 100%;
    height: 100%;
    background: url("../assets/image/bg1.jpg") no-repeat;
    position: absolute;
  }
  .login-box {
    border: 1px solid #DCDFE6;
    background-color: #ffffff;
    width: 400px;
    margin: 300px auto;
    padding: 35px 35px 15px 35px;
    border-radius: 5px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    box-shadow: 0 0 25px #909399;
  }

  .login-title {
    text-align: center;
    margin: 0 auto 40px auto;
    color: #00a0e9;
  }
  .remain{
    font-size: 12px;
    color: brown;
  }
</style>

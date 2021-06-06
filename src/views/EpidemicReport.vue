<template>
<div>
  <div v-if="reported"  class="report-tip">
    <p class="el-icon-sunrise-1 reported-icon" />
    <div class="tip-item">您的信息填报已提交，请十四日后再提交！</div>
  </div>
  <el-form :model="ruleForm" v-else :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
    <el-form-item label="填报人姓名" prop="name">
      <el-input v-model="ruleForm.name" placeholder="请输入填报人姓名" />
    </el-form-item>
    <el-form-item label="证件号" prop="card" >
      <el-input v-model="ruleForm.card" placeholder="请输入填报人证件号" />
    </el-form-item>
    <el-form-item label="手机号" prop="phone">
      <el-input v-model="ruleForm.phone" placeholder="请输入填报人手机号" />
    </el-form-item>
    <el-row>
      <el-col :span="12">
        <el-form-item label="从哪里来" prop="regionIn">
          <el-cascader
            size="large"
            :options="options"
            v-model="ruleForm.regionIn"
            @change="handleStartChange"
          >
          </el-cascader>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="到哪里去" prop="regionOut">
          <el-cascader
            size="large"
            :options="options"
            v-model="ruleForm.regionOut"
            @change="handleEndChange"
          >
          </el-cascader>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="详细地址" prop="address">
      <el-input v-model="ruleForm.address" placeholder="请输入到目的地后居住详细地址" />
    </el-form-item>

    <div>
      <div class="report-title"><span class="require">*</span>14天内是否接触过发热咳嗽人员？</div>
      <el-form-item label="" prop="resource1">
        <el-radio-group v-model="ruleForm.resource1">
          <el-radio label="是"></el-radio>
          <el-radio label="否"></el-radio>
        </el-radio-group>
      </el-form-item>
    </div>
    <div>
      <div class="report-title"><span class="require">*</span>是否有发热咳嗽等症状？</div>
      <el-form-item label="" prop="resource2">
        <el-radio-group v-model="ruleForm.resource2">
          <el-radio label="是"></el-radio>
          <el-radio label="否"></el-radio>
        </el-radio-group>
      </el-form-item>
    </div>
    <div>
      <div class="report-title"><span class="require">*</span>是否同行人员有从海外归来者？</div>
      <el-form-item label="" prop="resource3">
        <el-radio-group v-model="ruleForm.resource3">
          <el-radio label="是"></el-radio>
          <el-radio label="否"></el-radio>
        </el-radio-group>
      </el-form-item>
    </div>
    <div class="submitBtn">
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </div>
  </el-form>

</div>
</template>

<script>
  import {report,newAddDanger,topOversea,getReportRecord} from "../request/api";
  //element-ui中的中国省市区级联选择器
  import { regionData, CodeToText } from "element-china-area-data";
  export default {
    name: '',
    data() {
      return {
        ruleForm: {
          name: '',
          card:'',
          phone:'',
          regionIn:'',
          regionOut:'',
          address:'',
          resource1:'',
          resource2:'',
          resource3:'',
        },
        dangerCity:[],
        reported:false,
        options: regionData,
        start:[],
        end:[],
        rules: {
          name: [
            { required: true, message: '请输入填报人姓名', trigger: 'blur' },
            { min: 2, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          card: [
            { required: true, message: '请输入填报人证件号', trigger: 'blur' },
            { min: 18, message: '长度在18 个字符', trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '请输入填报人手机号', trigger: 'blur' },
            { min: 11, message: '长度在 11个字符', trigger: 'blur' }
          ],
          regionIn: [
            { required: true, message: '请选择区域', trigger: 'change' },
          ],
          regionOut: [
            { required: true, message: '请选择区域', trigger: 'change' },
          ],
          address:[
            { required: true, message: '请填写详细地址', trigger: 'change' }
          ],
          resource1: [
            { required: true, message: '请选择', trigger: 'change' }
          ],
          resource2: [
            { required: true, message: '请选择', trigger: 'change' }
          ],
          resource3: [
            { required: true, message: '请选择', trigger: 'change' }
          ],
        }

      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            //将表单数据提交给服务器验证
            let danger = 0
            const {resource1,resource2,resource3,regionOut,regionIn} = this.ruleForm
           let start = this.start.slice(0,2),
            end = this.end.slice(0,2)
            if (this.dangerCity.includes(start)){
              danger += 1
            }
          if (resource1=='是'){
            danger += 3
          }
            if (resource2=='是'){
              danger += 3
            }
            if (resource3=='是'){
              danger += 3
            }
            this.ruleForm['start'] = this.start
            this.ruleForm['end'] = this.end
            this.ruleForm['danger'] = danger
            this.ruleForm['userName'] = sessionStorage.getItem('userName')
            this.ruleForm['userId'] = sessionStorage.getItem('userId')
            this.ruleForm['userPhone'] = sessionStorage.getItem('phone')
            report(this.ruleForm).then(res=>{
              this.reported = true
            })
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      handleStartChange() {
        var loc = "";
        for (let i = 0; i < this.ruleForm.regionIn.length; i++) {
          loc += CodeToText[this.ruleForm.regionIn[i]];
        }
        this.start = loc
      },
      handleEndChange() {
        var loc = "";
        for (let i = 0; i < this.ruleForm.regionOut.length; i++) {
           loc += CodeToText[this.ruleForm.regionOut[i]];
        }
        this.end = loc
      }
  },
    mounted() {
      let id = sessionStorage.getItem('userId')
      getReportRecord({userId:id}).then(res=>{
        console.log(res,'===')
        if (res.content.length>0){
          this.reported = true
        }
      })
      topOversea({}).then(res=>{
        res.content.forEach(item=>{
          this.dangerCity.push(item.name)
        })
      })
      newAddDanger({}).then(res=>{
        res.content.forEach(item=>{
          this.dangerCity.push(item.name)
        })
      })
    }
  }
</script>


<style type="text/css" scoped>
.address{
  flex-direction: row;
}
  .report-title{
    margin-left: 30px;
    font-size: 16px;
  }
  .require{
    color: red;
  }
  .submitBtn {
    margin-top: 30px;
  }
  .report-tip{
    width: 100%;
    height: 800px;
    padding: 40px 20px;
    position: relative;
  }
  .tip-item{
    width: 100%;
    min-height: 200px;
    text-align: center;
    line-height: 200px;
    font-size: 24px;
    color: #00a0e9;
    letter-spacing: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
  }
  .reported-icon{
    font-size: 40px;
    color: #99045f;position: absolute;right: 10px;
    top: -5px;
  }
</style>

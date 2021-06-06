<template>
  <div class="container">
    <div class="crumbsa">
      <crumbs ></crumbs>
    </div>
    <div class="containerBody">
      <div class="detailsInfo">
        <div class="details-nav">
          <div class="rect"></div>
          <div class="nav-text">{{currentText}}</div>
        </div>
        <div class="details-base">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane :label="item.lable" :name="item.order" v-for="(item,index) in tabs" :key="index"><details-info :currentType="Number(currentType)" ref="details"/></el-tab-pane>
          </el-tabs>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import detailsInfo from "./detailsInfo";
  import crumbs from "../components/crumbs";
  export default {
    name: "ThinktankDetails",
    data(){
      return{
        tabs:[
          {lable:'最新消息',type:0,order:'first'},
          {lable:'防控指南',type:1,order:'second'},
          {lable:'疫情趋势',type:2,order:'1'},
          {lable:'个人文章',type:3,order:'2'},

        ],
        activeName: 'first',
        type:this.$route.params.id || 0,
        title:[
          '国家',
          '个人',
        ],
        currentText:'',
        currentType:0,
      }
    },
    components: {
      crumbs,
      detailsInfo
    },
    methods:{
      handleClick(tab) {
        this.currentType = tab.index
        this.currentText=tab.index==3?'个人':'国家'
        this.$refs.details[tab.index].init(tab.index)
      }
    },
    mounted() {
      this.$refs.details[0].init(0)
      this.currentText=this.type==3?'个人':'国家'
      console.log( this.currentText)
    }
  }
</script>

<style scoped>
@import  '../../public/css/details.css';
</style>
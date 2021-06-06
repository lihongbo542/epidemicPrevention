<template>
  <div class="ClHeader">
    <div class="header">
      <div class="cont cont1">
        <div class="img"><img src="@/assets/img/logo.png" alt=""></div>
        <div class="title">新冠疫情防控</div>
      </div>
      <div class="cont cont2">
        <div class="img postion" @click="toPersonal"><img src="@/assets/img/user.png" alt=""></div>
        <div class="des postion">{{name}}</div>
        <div class="line postion"></div>
        <div class="des postion" @click="logout">退出</div>
      </div>
    </div>
    <el-menu
      :default-active="$route.path"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#0357CB"
      text-color="#fff"
      active-text-color="#ffd04b"
      router
    >
      <el-menu-item index="/Home">首页</el-menu-item>
      <el-menu-item index="/dataBoard">数据分析</el-menu-item>
       <el-menu-item index="/thinktank">疫情填报</el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: "/Home",
      name:''
    };
  },
  methods: {
    logout(){
      this.$router.push("/Login");
      sessionStorage.clear()
    },
    handleSelect(key, keyPath) {
      this.activeIndex = key
      //console.log(this.$route.path)
      // console.log(key, keyPath);
    },
    toPersonal(){
      this.$router.replace('/personal')
    }
  },
  mounted() {
    this.name = sessionStorage.getItem("userName")
  },
};
</script>

<style scoped>
.ClHeader{
  width: 100%;
  height: 100%;
}
.header {
  display: flex;
  height: 60px;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
}
.cont {
  display: flex;
  align-items: center;
}
.header .cont1{
  justify-content: flex-start;
}
.header .cont2{
  justify-content: flex-end;
}
.img {
  display: inline-block;
  width: 42px;
  height: 42px;
  margin-right: 40px;
}
.img img{
  width: 100%;
}
.title {
  font-size: 30px;
  font-family: Source Han Serif CN;
  font-weight: bold;
  color: #221815;
}
.des {
  font-size: 18px;
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: #666666;
}
.line {
  width: 2px;
  height: 18px;
  background: #666666;
}
.postion {
  margin-right: 16px;
}
</style>

<style>
.el-menu-demo {
  background: linear-gradient(90deg, #0357cb 0%, #6a83fb 100%) !important;
}
.el-menu-item .is-active {
  font-size: 12px !important;
  height: 61px !important;
  line-height: 61px !important;
}
.el-menu--horizontal > .el-menu-item {
  line-height: 60px !important;
}
.el-menu-item {
  font-size: 12px !important;
  height: 61px !important;
}
.el-menu--horizontal > .el-menu-item.is-active {
  background-color: #3478ff !important;
  font-size: 12px !important;
  height: 100% !important;
}

.el-menu--horizontal > .el-menu-item {
  width: 130px;
  text-align: center;
  font-size: 20px;
}
.el-menu-demo {
  padding-left: 80px;
  background: linear-gradient(90deg, #0357CB 0%, #6A83FB 100%) !important;
  padding-left: 80px;
}
.el-menu--horizontal>.el-menu-item.is-active{
  background-color: #3478FF !important;
}
.el-menu--horizontal>.el-menu-item {
  width: 130px;
  text-align: center;
  font-size: 20px;
  height: 60px;
  line-height: 60px;
}
</style>

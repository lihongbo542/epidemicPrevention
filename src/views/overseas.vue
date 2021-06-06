<template>
  <div class="_bc">
    <div class="changeBtn" @click="changeMap">国内疫情</div>
    <div id="content">
      <VmLeft class='left'
              :option1 = 'option1'
              :option3 = 'option3'
              :option5 = 'option5'
      />
      <VmCenter class='center'
                :centerTop ='centerTop'
                :foreignData = 'foreignData'
      />
      <VmRight class='right'
               :option2 = 'option2'
               :option4 = 'option4'
               :option6 = 'option6'
      />
    </div>
  </div>
</template>

<script>
  import resize from "../mixins/resize";
  import VmHeader from './components/VmHeader.vue'
  import VmLeft from './components/VmLeft.vue'
  import VmCenter from './components/VmCenter.vue'
  import VmRight from './components/VmRight.vue'

  import {
    getForeinData,
  } from './commonfun/charts'
  export default {
    name: 'overseas',
    mixins: [resize],
    data() {
      return {
        option1:{},
        option2:{},
        option3:{},
        option4:{},
        option5:{},
        option6:{},
        centerTop:{},
        foreignData:{},
      }
    },
    methods:{
      changeMap(){
        this.$parent.changeMap()
      },
    },
    filters: {
      num: (val, fix = 2) => {
        val = val.toFixed(fix); // 保留小数2位
        val = "" + val; // 转换成字符串
        var int = val.slice(0, fix * -1 - 1); // 拿到整数
        var ext = val.slice(fix * -1 - 1); // 获取到小数
        //每个三位价格逗号
        int = int
          .split("")
          .reverse()
          .join(""); // 翻转整数
        var temp = ""; // 临时变量
        for (var i = 0; i < int.length; i++) {
          temp += int[i];
          if ((i + 1) % 3 == 0 && i != int.length - 1) {
            temp += ","; // 每隔三个数字拼接一个逗号
          }
        }
        temp = temp
          .split("")
          .reverse()
          .join(""); // 加完逗号之后翻转
        temp = temp; // 整数小数拼接
        return temp; // 返回
      },
    },
    mounted() {
      getForeinData().then(res => {
        this.option1 = res.option1;
        this.option2 = res.option2;
        this.option3 = res.option3;
        this.option4 = res.option4;
        this.option5 = res.option5;
        this.option6 = res.option6;
        this.centerTop = res.centerTop;
        this.foreignData = res.foreignData;
      })
    },
    components: {
      VmHeader,
      VmLeft,
      VmCenter,
      VmRight,
    },
  }
</script>


<style type="text/css" scoped>
  ._bc{
    width: 100%;
    padding-top: 100px;
    background:url("../../src/assets/image/home_img.png") no-repeat top center;
    position: relative;
  }

  .subsidiesdata_left_top > span {
    font-size: 16px;
    font-family: Source Han Sans CN;
    font-weight: 600;
    color: #666666;
  }

  .coverage_main span {
    font-size: 14px;
    font-family: Source Han Sans CN;
    font-weight: Normal;
    color: #282d38;
  }


  .MapGuide {
    width: 100%;
    background: #eef2f4;
    padding-bottom: 20px;
  }
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }


  li {
    list-style: none;
  }
  #content {
    padding: 10px 10px 0;
    display: flex;
  }
  #content .left {
    flex: 3
  }
  #content .center {
    flex: 5
  }
  #content .right {
    flex: 3
  }
</style>

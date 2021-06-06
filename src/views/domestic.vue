<template>
  <div class="echarts">
    <div style="width:80%;height:800px">
      <div style="width:100%;height:800px" ref="allMap"></div>
      <div class="mapChoose">
      <span v-for="(item,index) in parentInfo" :key="item.code">
        <span class="title" @click="chooseArea(item,index)">{{item.cityName==='全国'?'中国':item.cityName}}</span>
        <span class="icon" v-show="index+1!==parentInfo.length">></span>
      </span>
      </div>
      <div class="chooseCategory">
        <div v-for="(item,index) in tableData" :key="index" :class="currentChoose===item.name ? 'active' :'category' " @click="changeCate(item,index)">{{item.name}}</div>
      </div>
    </div>
    <div style="width:20%;height:800px" class="dataChart">
      <div class="changeBtn" @click="changeMap">海外疫情</div>
      <div class="servicefacilitya">
        <div class="servicefacility_top"></div>
        <div class="servicefacility_ziti">{{currentArea}}疫情数据统计</div>
        <div class="servicefacility_tu">
          <img src="../assets/image/tongyong.png" alt="" />
        </div>
        <div class="tablePersonMsg">
          <div
            class="chart_semicircle"
            v-for="(item, index) in tableData"
            :key="index"
          >
            <div class="tablePersonMsg_name">{{ item.name }}</div>
            <div
              class="tablePersonMsg_progress"

            >
              <div class="progressRect"></div>
            </div>
            <div class="semicircle_value">{{ formatNumber(item.value) }}</div>
          </div>
        </div>
      </div>
      <div class="servicefacilityc">
        <div class="servicefacility_top"></div>
        <div class="servicefacility_ziti">{{currentArea}}疫情数据详情</div>
        <div class="servicefacility_tu">
          <img src="../assets/image/tongyong.png" alt="" />
        </div>
        <div class="zhuangzhuangtu">
          <div id="roadnum" ref="chart"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import resize from "../mixins/resize";
  import echarts from "echarts";
  import {getAllData} from "../request/api";
  import '../styles/home.css'
const geo = require('../../service/province.json')

  export default {
    name: 'allMap',
    mixins: [resize],
    data() {
      return {
        tableData: [
          { name: "累计治愈", value: 0 },
          { name: "累计死亡", value: 0 },
          { name: "累计确诊", value: 0 },
          { name: "现有确诊", value: 0 },
        ],
        currentArea:'全国',
        currentMax:0,
        cityLength:0,
        allData:[
          123,123,13,13
        ],
        all:[0,0,0,0],
        oversea:{},
        myCharts: null,
        zoom:1.4,//当地图进入下一级时，改变其大小
        cityData:[],
        geoJson: {
          features: []
        },
        currentChoose:'累计确诊',
        currentValue:'confirmed',
        parentInfo: [{
          cityName: "全国",
          code: 100000
        }],
        timeTitle: ['2021'],
        unExist:[],
        dataArr: [0,0,0,0],
        getGeoData:null,
        drawData:null
      }
    },
    methods: {
      changeMap(){
        this.$parent.changeMap()
      },
      getGeoJson(data) {
        const {
          adcode,cityCode,code
        } = data
        console.log(data)
        let oversea = {input:0,current:'全国'}
        if (data.name!='全国' && data.cityName!='全国'){
          if (data.allValue.subList && data.allValue.subList.length>0){
            oversea.input = data.allValue.subList[data.allValue.subList.length-1].curConfirm
          }else {
            return false
          }
          oversea.current = data.allValue.area
        }
        this.getGeoData = data
        //adcode || cityCode || code 由于数据原因，前进和后退的地区唯一代码可能是多个标识 所以能取到谁就用谁
        let that = this;
        AMapUI.loadUI(["geo/DistrictExplorer"], DistrictExplorer => {
          let districtExplorer = new DistrictExplorer();
          districtExplorer.loadAreaNode(adcode || cityCode || code, function (error, areaNode) {
            if (error) {
              console.error(error);
              return;
            }
      
            let Json = areaNode.getSubFeatures();
            if (Json.length > 0) {
              that.geoJson.features = Json;
            } else if (Json.length === 0) {
              that.geoJson.features = that.geoJson.features.filter(
                item => item.properties.adcode === adcode
              );
              if (that.geoJson.features.length === 0) return;
            }
            that.getMapData(data,oversea);
          });
        });
      },
      //获取数据
     async getMapData(data,oversea) {
       this.unExist = []
        let mapData = {},
          pointData = {},
          sum = {},
          cityData = [],
          value = {}
          this.all = [0,0,0,0]
          const {name,cityName} = data
        if (name==='全国' || cityName === '全国'){
        await getAllData({}).then(res=>{
            cityData = res.content
          })
        }
        // else if (data.allValue && data.allValue.subList){
        //   cityData = data.allValue.subList
        // }else if (data.allValue){
        //   cityData = data.allValue
        // }
        else {
          let city = cityName || name
          let spec = false
          //后端数据查询时，不需要携带省/自治区，但是高德地图的geo数据有这些文字，需要去掉
          if (city.indexOf('省')!==-1){
            city = city.replace('省', '')
          }else if (city.indexOf('自治区')!==-1){
            if (city==='广西壮族自治区'){
              city = '广西'
            }else city = city.replace('自治区', '')
          }else if (city.indexOf('特别行政区')!==-1){
            city = city.replace('特别行政区', '')
            spec = true
          }
          console.log(city)
          if (city=='新疆维吾尔'){
            city = '新疆'
          }
          if (city=='宁夏回族'){
            city = '宁夏'
          }
          if (city=='重庆市'){
            city = '重庆'
          }
          if (city=='上海市'){
            city = '上海'
          }
          if (city=='天津市'){
            city = '天津'
          }
          if (city=='北京市'){
            city = '北京'
          }
          await getAllData({area:city}).then(res=>{
            console.log(res)
            cityData =spec ? res.content[0] : res.content[0].subList
          })
        }
        this.timeTitle.forEach(item => {
          mapData[item] = []
          pointData[item] = []
          sum[item] = 0
          this.geoJson.features.forEach(j => {
            if (name==='全国' || cityName === '全国'){
              cityData.forEach((item,index)=>{
                if (j.properties.name.indexOf(item.area)!==-1){
                  value = item
                }

              })
            }
            else {
              //后端查询的数据中，有些区域是没有信息的，这个时候就自己组装数据
             if (Object.prototype.toString.call(cityData).slice(8,-1)==='Object'){
               value = cityData
             }else {
               if (cityData.length!==this.geoJson.features.length){
                 for (let i=0;i<cityData.length;i++){
                   let searchValue = cityData[i].city
                   if (searchValue.indexOf('州')!==-1){
                     searchValue = searchValue.replace('州','')
                   }
                   let reg = new RegExp(searchValue , "g");
                   if (j.properties.name.match(reg)){
                     value = cityData[i]
                     continue
                   }
                 }
               }else {
                 cityData.forEach(item=>{
                   if (j.properties.name.indexOf(item.city)!==-1){
                     value = item
                   }
                 })
               }
             }
            }
            //分离境外输入
            let local = 0
            // value.forEach(item=>{
            //    local += Number(item.curConfirm)
            // })

            //当前地区疫情数据
            mapData[item].push({
              name: j.properties.name,
              value: value[this.currentValue],
              allValue:value,
              cityCode: j.properties.adcode,
            })
            pointData[item].push({
              name: j.properties.name,
              value: [j.properties.center[0], j.properties.center[1], value],
              cityCode: j.properties.adcode,
            })
           // sum[item] += value
          })
          // mapData[item] = mapData[item].sort(function (a, b) {
          //   return b.value - a.value
          // });
        })
       //延时挂载地图
        setTimeout(()=>{
          this.initEcharts(mapData, pointData, oversea)
        },100)
      },
      initEcharts(mapData, pointData, oversea) {
        this.myChart = echarts.init(this.$refs.allMap)
        if (this.parentInfo.length === 1) {
          echarts.registerMap('china', this.geoJson); //注册
        } else {
          echarts.registerMap('map', this.geoJson); //注册
        }
        let option = {
          timeline: {
            data: [],
            axisType: 'category',
            autoPlay: false,
            show:false,
            left: '5%',
            right: '10%',
            bottom: '2%',
            width: '80%',
          },
          baseOption: {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              },
            },
            geo: {
              map: this.parentInfo.length === 1 ? 'china' : 'map',
              zoom: this.zoom,
              roam: true,
              center: this.parentInfo.length === 1 ? ['118.83531246', '32.0267395887'] : false,
              label: {
                normal: {
                  show: true,
                  color: "rgb(249, 249, 249)", //省份标签字体颜色
                  formatter: p => {
                    switch (p.name) {
                      case '内蒙古自治区':
                        p.name = "内蒙古"
                        break;
                      case '西藏自治区':
                        p.name = "西藏"
                        break;
                      case '新疆维吾尔自治区':
                        p.name = "新疆"
                        break;
                      case '宁夏回族自治区':
                        p.name = "宁夏"
                        break;
                      case '广西壮族自治区':
                        p.name = "广西"
                        break;
                      case '香港特别行政区':
                        p.name = "香港"
                        break;
                      case '澳门特别行政区':
                        p.name = "澳门"
                        break;
                      default:
                        break;
                    }
                    return p.name;
                  }
                },
                emphasis: {
                  show: true,
                  color: '#f75a00',
                }
              },
              itemStyle: {
                normal: {
                  areaColor: '#24CFF4',
                  borderColor: '#53D9FF',
                  borderWidth: 1.3,
                  shadowBlur: 15,
                  shadowColor: 'rgb(58,115,192)',
                  shadowOffsetX: 7,
                  shadowOffsetY: 6,
                },
                emphasis: {
                  areaColor: '#8dd7fc',
                  borderWidth: 1.6,
                  shadowBlur: 25,
                }

              },
            },

          },
          options: []
        }
        this.timeTitle.forEach(item => {
          let xData = [],
            yData = []
          let arr = []
          mapData[item].forEach(item=>{
            arr.push(item.value)
          })
          arr.sort(function (a, b) {
              return b - a
            });
          let max = arr[0]
          //arr[0] = this.tableData.filter(item=>item.name==this.currentChoose)[0].value
          //echarts只能要数字，不能要string
          option.options.push({
            //展示图
            visualMap: {
              min: 0,
              max: Number(max),
              left: '1%',
              bottom: '5%',
              calculable: true,
              seriesIndex: [0],
              inRange: {
                color: ['#24CFF4', '#2E98CA', '#1E62AC']
              },
              textStyle: {
                color: '#24CFF4'
              }
            },
            xAxis: {
              type: 'value',
              scale: false,
              position: 'top',

              boundaryGap: false,
              splitLine: {
                show: false
              },
              axisLine: {
                show: false,
                lineStyle: {
                  color: '#455B77'
                }
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                margin: 2,
                textStyle: {
                  fontSize: 12,
                  color: '#c0e6f9'
                }
              },
            },
            yAxis: {
              type: 'category',
              nameGap: 16,

              axisLine: {
                show: false,
                lineStyle: {
                  color: '#455B77'
                }
              },
              axisTick: {
                show: false,
              },
              axisLabel: {
                interval: 0,
                textStyle: {
                  color: '#c0e6f9'
                }
              },
              data: null
            },
            series: [
              {
              name: item,
              type: 'map',
              geoIndex: 0,
              map: this.parentInfo.length === 1 ? 'china' : 'map',
              roam: true,
              zoom: 1.3,
              tooltip: {
                trigger: "item",
                formatter: p => {
                  //全国时计算，省级时由上一级计算
                  let overseaC = 0
                  if (p.data.allValue.subList && p.data.allValue.subList.length>1 &&  p.data.allValue.subList[p.data.allValue.subList.length-1].curConfirm){
                    overseaC = p.data.allValue.subList[p.data.allValue.subList.length-1].curConfirm
                  }
                  let val = p.value;
                  if (p.name === '南海诸岛') return
                  if (window.isNaN(val)) {
                    val = 0;
                  }
                  let txtCon =
                    `<div style="display: flex;flex-direction: column">
                    <div>${p.name}:</div>
                    <div>累计确诊:  ${p.data.allValue.confirmed}&nbsp;&nbsp;&nbsp;较昨日新增确诊：${p.data.allValue.confirmedRelative}</div>
                    <div>累计治愈:  ${p.data.allValue.crued}&nbsp;&nbsp;&nbsp;较昨日新增治愈：${p.data.allValue.curedRelative ? p.data.allValue.curedRelative :0 }</div>
                    <div>累计死亡:  ${p.data.allValue.died}&nbsp;&nbsp;&nbsp;较昨日新增死亡：${p.data.allValue.diedRelative ? p.data.allValue.diedRelative : 0}</div>
                   <div style="color: red">现有确诊:  ${p.data.allValue.curConfirm}&nbsp;&nbsp;&nbsp;${oversea.current!='全国' ? '全省' :''}境外输入：${oversea.current!='全国' ? oversea.input :overseaC}</div>
                    </div>`
                  return txtCon;
                }
              },
              label: {
                normal: {
                  show: false,
                },
                emphasis: {
                  show: false,
                }
              },
              data: mapData[item],

            },
              {
              name: '散点',
              type: 'effectScatter',
                //搭配图表类型
              coordinateSystem: 'geo',
                //涟漪特效相关配置
              rippleEffect: {
                brushType: 'fill'
              },
              itemStyle: {
                normal: {
                  color: '#F4E925',
                  shadowBlur: 10,
                  shadowColor: '#333'
                }
              },
              data: pointData[item],
              // symbolSize: 8,
              symbolSize: function (val) {
                let value = val[2].confirmed
                if (value === max) {
                  return 20
                }
                return 10
              },
              showEffectOn: 'render', //加载完毕显示特效
            },
            ]
          })
        })
        this.myChart.setOption(option, true)
        this.myChart.off('click');
        this.myChart.on('click', this.echartsMapClick);
      },

      //点击下钻
     async echartsMapClick(params) {
        if (!params.data) {
          return
        }
        if (
          this.parentInfo[this.parentInfo.length - 1].code ===
          params.data.cityCode
        ) {
          return;
        }
        if (params.data.allValue.subList.length<=1){
          return
       }
        if (this.parentInfo.length>=2) return;
        this.zoom=1.1
        let data = params.data;
        this.parentInfo.push({
          cityName: data.name,
          code: data.cityCode
        });
       this.currentArea = data.name
        this.getGeoJson(data);
       await this.drawLine(data)
       await this.mechanismTrue(data)

      },
      //选择切换市县
     async chooseArea(val, index) {
        if (this.parentInfo.length === index + 1) {
          return
        }
       if (this.parentInfo.length>2){
         this.zoom=1.1
       }else {
         this.zoom=1.4
       }
       this.currentArea = '全国'
        this.parentInfo.splice(index + 1)
        this.getGeoJson(this.parentInfo[this.parentInfo.length - 1]);
       await this.drawLine(this.parentInfo[this.parentInfo.length - 1])
       await this.mechanismTrue(this.parentInfo[this.parentInfo.length - 1])
      },
     async drawLine(data) {
        this.drawData = data
        const {adcode,name,cityCode,cityName,code} = data
        let allData = []
        let xData = [],yData = []
        if (adcode===100000 || cityCode===100000 || code ===100000){
        await getAllData({
          }).then(res=>{
            allData = res.content
          })
        }else {
          let city = cityName || name
          let spec = false
          //后端数据查询时，不需要携带省/自治区，但是高德地图的geo数据有这些文字，需要去掉
          if (city.indexOf('省')!==-1){
            city = city.replace('省', '')
          }else if (city.indexOf('自治区')!==-1){
            if (city==='广西壮族自治区'){
              city = '广西'
            }else city = city.replace('自治区', '')
          }else if (city.indexOf('特别行政区')!==-1){
            city = city.replace('特别行政区', '')
            spec = true
          }
          if (city=='新疆维吾尔'){
            city = '新疆'
          }
          if (city=='宁夏回族'){
            city = '宁夏'
          }
          if (city=='重庆市'){
            city = '重庆'
          }
          if (city=='上海市'){
            city = '上海'
          }
          if (city=='天津市'){
            city = '天津'
          }
          if (city=='北京市'){
            city = '北京'
          }
          await getAllData({area:city}).then(res=>{
            allData = spec ? res.content[0] : res.content[0].subList
          })
        }
        this.cityLength = allData.length
        if (adcode===100000 || cityCode===100000 || code===100000){
          allData.forEach(item=>{
            xData.push(item.area)
            yData.push(Number(item[this.currentValue]))
          })
        }else {
          allData.forEach(item=>{
            xData.push(item.city)
            yData.push(Number(item[this.currentValue]))
          })
        }
        // 基于准备好的dom，初始化echarts实例
        let bar_dv = this.$refs.chart;
        let myChart = this.$echarts.init(bar_dv);
        myChart.setOption({
          title: {
            text: "(人)",
            textStyle: {
              color: "#87BAF8",
            },
          },
          grid: {
            left: "0%",
            right: "10%",
            bottom: "15%",
            containLabel: true,
          },
          dataZoom: [{
            type: 'slider',
            startValue: 0,
            handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '100%',
            height:20,
            start:0,
            end: this.computedPosition(1,this.cityLength),
            handleStyle: {
              color: '#0B3C6F',
              shadowBlur: 3,
              shadowColor: 'rgba(0, 0, 0, 0.6)',
              shadowOffsetX: 2,
              shadowOffsetY: 2
            },
            bottom: '10px',
          }],
          xAxis: {
            data: xData,
            axisLabel: {
              // show: true,
              textStyle: {
                color: "#87BAF8",
              },
            },
          },
          yAxis: {
            type:'log',
            minInterval:1,
            axisLabel: {
              show: true,
              textStyle: {
                color: "#87BAF8",
              },
            },
          },
          series: [
            {
              type: "bar",
              barWidth: 5,
              itemStyle: {
                normal: {
                  borderWidth: 1,
                  borderColor: "#18CEE2",
                  barBorderRadius: 28,
                  color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                    { offset: 0, color: "#2dc3db" },
                    { offset: 1, color: "#0f88c0" },
                  ]),
                },
                emphasis: {
                  barBorderRadius: 13,
                  shadowBlur: 5,
                  shadowColor: "rgba(218,170, 58, 0.7)",
                },
              },
              data:yData,
            },
            //pictorialBar留着会出现bug
            // {
            //   name: "a",
            //   tooltip: {
            //     show: false,
            //   },
            //   type: "pictorialBar",
            //   itemStyle: {
            //     normal: {
            //       color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            //         { offset: 0, color: "#2bc6dd" },
            //         { offset: 1, color: "#18cde1" },
            //       ]),
            //       borderWidth: 1,
            //       borderColor: "#18CEE2",
            //     },
            //   },
            //   symbol: "circle",
            //   symbolSize: ["5", "10"],
            //   symbolPosition: "end",
            //   data: yData,
            //   z: 3,
            // },
          ],
        });
      },
      computedPosition(length,xArraylength) {
        if (xArraylength >= 10) {
          return length <= 10 ? this.end = 35 : this.end = (100 - Math.floor(35 / length * 100));
        } else {
          return 100;//小于十条数据显示全部
        }
      },
     async mechanismTrue(data) {
       this.tableData =
         [
         { name: "累计治愈", value: 0 },
         { name: "累计死亡", value: 0 },
         { name: "累计确诊", value: 0 },
         { name: "现有确诊", value: 0 },
       ]
       this.dataArr = [0,0,0,0]
       const {adcode,name,cityCode,cityName,code} = data
        let allData = [],sum = 0
        if (adcode===100000 || cityCode===100000 || code===100000){
          await getAllData({
          }).then(res=>{
            allData = res.content
          })
        }else {
          let city = cityName || name
          let spec = false
          //后端数据查询时，不需要携带省/自治区，但是高德地图的geo数据有这些文字，需要去掉
          if (city.indexOf('省')!==-1){
            city = city.replace('省', '')
          }else if (city.indexOf('自治区')!==-1){
            if (city==='广西壮族自治区'){
              city = '广西'
            }else city = city.replace('自治区', '')
          }else if (city.indexOf('特别行政区')!==-1){
            city = city.replace('特别行政区', '')
            spec = true
          }

          if (city=='新疆维吾尔'){
            city = '新疆'
          }
          if (city=='宁夏回族'){
            city = '宁夏'
          }
          if (city=='重庆市'){
            city = '重庆'
          }
          if (city=='上海市'){
            city = '上海'
          }
          if (city=='天津市'){
            city = '天津'
          }
          if (city=='北京市'){
            city = '北京'
          }
          await getAllData({area:city}).then(res=>{
            allData = spec ? res.content[0] : res.content[0].subList
          })
        }

       allData.forEach(item=>{
         this.tableData[0].value += Number(item.crued)
         this.tableData[1].value += Number(item.died)
         this.tableData[2].value += Number(item.confirmed)
         this.tableData[3].value += Number(item.curConfirm)
         sum += Number(item.crued)+Number(item.died)+Number(item.confirmed)+Number(item.curConfirm)
       })
       //计算百分比
       this.tableData.forEach((item,index)=>{
         this.dataArr[index] = (item.value/sum)*100
       })
        //给元素动态添加id  由于数据渲染的原因，for循环的执行时间比dom生成的时间长，导致拿不到dom 使用定时器延迟加载
        setTimeout(() => {
          let progress = document.getElementsByClassName(
            "tablePersonMsg_progress"
          );
          this.setId(progress, "progress");
          //根据动态添加的id绑定echarts
          let arr = [];
          for (let i = 0; i < progress.length; i++) {
            arr.push(document.getElementById(`progress${i + 1}`));
          }
          arr.forEach((item, index) => {
            this.setChart(arr[index], this.getProgressOption(this.dataArr[index]));
          });
        }, 500);
      },
     async calculate(data){
        let arr =  [0,0,0,0]
      await data.forEach(item=>{
          arr[0]+=Number(item.crued)
          arr[1]+=Number(item.died)
          arr[2]+=Number(item.confirmed)
          arr[3]+=Number(item.curConfirm)
        })
       return arr
      },
      getProgressOption(data) {
        let list = [{
          value: data
        }
        ];
        let curr = [];
        let option = {
          xAxis: {
            max: 10,
            splitLine: {
              show: false
            },
            axisLabel: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            }
          },
          grid: {
            containLabel: true,
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
          },
          yAxis: [{
            data: curr,
            inverse: true,
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false,
              margin: 10,
              textStyle: {
                fontSize: 14,
                color: '#fff'
              }
            }
          }],
          series: [
            { //内
              type: 'bar',
              barWidth: 10,
              legendHoverLink: false,
              symbolRepeat: true,
              silent: true,
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 1,
                  y2: 0,
                  colorStops: [{
                    offset: 0,
                    color: '#12272A' // 0% 处的颜色
                  }, {
                    offset: 1,
                    color: '#62E6F6' // 100% 处的颜色
                  }]
                }
              },
              data: list,
              z: 1,
              animationEasing: 'elasticOut'
            },

            { //分隔
              type: 'pictorialBar',
              itemStyle: {
                color: '#090C1F'
              },
              symbolRepeat: 'fixed',
              symbolMargin: 2,
              symbol: 'roundRect',
              symbolClip: true,
              symbolSize: [1, 10],
              symbolPosition: 'start',
              symbolOffset: [0, 0],
              symbolBoundingData: 10,
              data: list,
              z: 2,
              animationEasing: 'elasticOut'
            }
          ]
        }
        return option
      },
      changeCate(item,index){
        switch (item.name) {
          case '累计治愈':
           this.currentChoose = '累计治愈'
            this.currentValue = 'crued'
            break;
          case '累计死亡':
            this.currentChoose = '累计死亡'
            this.currentValue = 'died'
            break;
          case '累计确诊':
            this.currentChoose = '累计确诊'
            this.currentValue = 'confirmed'
            break;
          case '现有确诊':
            this.currentChoose = '现有确诊'
            this.currentValue = 'curConfirm'
            break;
          default:
            break;
        }
      }
    },
    mounted() {
      getAllData({}).then(res=>{
        res.content.forEach(item=>{

        })
        this.$nextTick(() => {
          this.drawLine({
            adcode:100000,
            name:'全国'
          });
          this.mechanismTrue(
            {
              adcode:100000,
              name:'全国'
            }
          )
        });
      })
      
      this.getGeoJson({
        adcode:100000,
        name:'全国'
      });
    },
    watch:{
      currentValue(newValue,oldValue){
        this.getGeoJson(this.getGeoData)
        this.drawLine(this.drawData)
      }
    }
  }
</script>


<style type="text/css" scoped>
  .category{
    width: 100%;
    height: 30px;
    text-align: center;
    line-height: 30px;
    margin-bottom: 5px;
    font-size: 16px;
    color: #ffffff;
    background-color: rgba(147, 235, 248, .3);
  }
  .active{
    width: 100%;
    height: 30px;
    text-align: center;
    line-height: 30px;
    margin-bottom: 5px;
    font-size: 16px;
    color: #ffffff;
    background-color: rgba(147, 235, 248, .8);
  }
  .echarts {
    width: 100%;
    min-height: 800px;
    position: relative;
    background: url("../assets/image/bg1.jpg") no-repeat;
    background-size: 100% 100%;
    display: flex;
    flex-direction: row;
  }
  .mapChoose {
    position: absolute;
    left: 20px;
    top: 55px;
    color: #eee;
  }
  .title {
    padding: 5px;
    border-top: 1px solid rgba(147, 235, 248, .8);
    border-bottom: 1px solid rgba(147, 235, 248, .8);
    cursor: pointer;
  }
  .icon{
    font-family: "simsun";
    font-size: 25px;
    margin: 0 11px;
  }
  .dataChart{
    width:20%;
    position: relative;
    flex-direction: column;
  }
</style>

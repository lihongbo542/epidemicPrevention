<template>
  <div id="vmcentercontainer">
	  <div class="bg-container">
			<div class="bg1"></div>
			<div class="bg2"></div>
			<div class="bg3"></div>
		</div>
	  <div class="btn">
		  <button @click = 'btnclick1' :class='{click:ifclick1}'>累计确诊</button>
		  <button @click = 'btnclick2' :class='{click:ifclick2}'>现存确诊</button>
	  </div>
	  <div class="worldmap"></div>
  </div>
</template>

<script>
	import '../../commonfun/world.js'
	import {nameMap} from '../../commonfun/nameMap'
	import {worldMapOption} from '../../commonfun/options'
	import {getMapData} from '../../commonfun/charts'
	
	export default {
		name:'vmcentercontainer',
		data(){
			return{
				confirmData:[],
				confirmNowData:[],
				worldMapOption:{},
				chart:{},
				ifclick1:true,
				ifclick2:false
			}
		},
		methods:{
			btnclick1(){
				if(this.ifclick1){
					return
				}else{
				this.ifclick2 =false;
				this.ifclick1 =true;
				this.worldMapOption.series[0].data = this.confirmData;
				this.chart.setOption(this.worldMapOption)
				}
			},
			btnclick2(){
				if(this.ifclick2){
					return
				}else{
				this.ifclick1 =false;
				this.ifclick2 =true;
				this.worldMapOption.series[0].data = this.confirmNowData;
				this.chart.setOption(this.worldMapOption)
				}
			},
			
		},
		mounted(){
			let option = worldMapOption();
			// console.log(option);
			this.worldMapOption = option;
			this.worldMapOption.series[0].nameMap = nameMap;
			let that = this;
			getMapData().then(res=>{
			let name = res[1].name;
			let confirm = res[1].confirm;
			let nowConfirm = res[1].nowConfirm;
			res[0].confirmData.push({name,value:confirm})
			res[0].nowConfirmData.push({name,value:nowConfirm})	
			that.confirmData = res[0].confirmData;
			that.confirmNowData = res[0].nowConfirmData;
			that.worldMapOption.series[0].data = that.confirmData;
			let worldmap = document.querySelector('.worldmap');
			that.chart=this.setChart(worldmap, that.worldMapOption);
			})						
		},
	}
</script>
<style scoped>
	#vmcentercontainer{
		position: relative;
		height:800px;
		overflow: hidden; /* 下面的图片太大,一直旋转带来了宽度撑高 */
	}
	.bg-container{
		position: relative;
		top: 300px;
	}
	.bg1{
		height: 400px;
		width: 400px;
		background: url('../../../assets/image/map.png');
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-size: 100% 100%;
		opacity: 0.3;
	}
	
	.bg2{
		height: 400px ;
		width: 400px ;
		background: url('../../../assets/image/lbx.png');
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-size: 100% 100%;
		opacity: 0.6;
		animation: rotate1 15s linear infinite;
	}
	.bg3{
		height: 400px;
		width: 400px;
		background: url('../../../assets/image/jt.png');
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-size: 100% 100%;
		opacity: 0.8;
		animation: rotate2 15s linear infinite;
	}
	.btn{
		width:810px;
		position: absolute;
		top:40px;
		display: flex;
		justify-content: space-around;
	}
	.btn button{
		height:60px;
		width: 200px;
		font-size:25px;
		z-index: 10;
		border-radius: 30px;
		background-color: #62b6ff3d;
		border:none;
		color:white;
		cursor: pointer;
	}
	.btn .click{
		color:#ffe14d
	}
	
	.btn button:focus{
		outline: none;
	}
	
	.worldmap{
		    position: absolute;
		    top: 30px;
		    left: 30px;
		    z-index: 5;
		    height: 600px;
		    width: 100%;
	}
	
	@keyframes rotate1{
		from{transform: translate(-50%, -50%) rotate(0deg);}
		to{transform: translate(-50%, -50%) rotate(360deg);}
	}
	@keyframes rotate2{
		from{transform: translate(-50%, -50%) rotate(0deg);}
		to{transform: translate(-50%, -50%) rotate(-360deg);}
	}
</style>

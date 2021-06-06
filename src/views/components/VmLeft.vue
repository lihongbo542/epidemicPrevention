<template>
	<div id="vmleft">
		<VmPanel>
			<div slot='panelcontent'>
				<h2>新增确诊TOP10</h2>
				<div class="chart topteninfected"></div>
			</div>
		</VmPanel>
		<VmPanel>
			<div slot='panelcontent'>
				<h2>大洲感染总人数趋势图</h2>
				<div class="chart infectedstates"></div>
			</div>
		</VmPanel>
		<VmPanel>
			<div slot='panelcontent'>
				<h2>大洲感染人数饼状图</h2>
				<div class="chart infectedstatesPie"></div>
			</div>
		</VmPanel>
	</div>
</template>

<script>
	import VmPanel from './common/VmPanel.vue'

	import {
		addChart,
	} from '../commonfun/charts'

	export default {
		name: 'vmleft',
		props: {
			option1:{},
			option3:{},
			option5:{}
		},
		components: {
			VmPanel
		},
		watch:{
			option1(){
				let topteninfected = document.querySelector('.topteninfected');
				this.setChart(topteninfected, this.option1);
			},
			option3(){
				let infectedstates = document.querySelector('.infectedstates');
				this.setChart(infectedstates, this.option3);
			},
			option5(){
				let infectedstatesPie = document.querySelector('.infectedstatesPie');
				this.setChart(infectedstatesPie, this.option5);
			},
		}
	}
</script>
<style scoped>
</style>

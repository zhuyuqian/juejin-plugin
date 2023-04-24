<template>
	<el-card shadow="never" class="user-dynamic" v-loading="loading">
		<template #header>
			<span class="title-box">{{ year }}｜社区活跃度</span>
			<div class="rt">
				<el-select class="change-year" v-model="year" size="mini" @change="drawChart">
					<el-option v-for="y of years" :key="y" :label="y" :value="y"/>
				</el-select>
				<el-tooltip effect="dark" placement="top" :content="`最近更新：${$dayjs(dynamicInfo.time).fromNow() }`">
					<el-icon class="refresh-button" size="20" color="#999" @click="load(true)">
						<Refresh/>
					</el-icon>
				</el-tooltip>
			</div>
		</template>
		<div class="chart-warp" ref="chart"></div>
	</el-card>
</template>
<script setup>
import { onMounted, ref, getCurrentInstance } from 'vue';
import { ajax, EVENT_MAP } from "@/pages/content/api";
import { getDynamicActionsCount, getDynamicScoreByActions } from "@/tool";

const { proxy } = getCurrentInstance();
const loading = ref(false);
const chart = ref(null);
const years = ref([]); // 年份列表
const year = ref(null); // 当前年份

let dynamicInfo = ref({ info: {}, time: null })
let chartDynamic = {}; // 画图的数据
let dynamicChart = null;

// 画图
const drawChart = () => {
	if (!dynamicChart) {
		dynamicChart = echarts.init(chart.value);
	}
	dynamicChart.setOption({
		tooltip: {
			enterable: true,
			confine: true,
			padding: [4, 4, 2],
			textStyle: { fontSize: 10 },
			formatter({ data }) {
				let [date, score] = data;
				let [year, month, day] = date.split('-');
				let actionCount = getDynamicActionsCount(dynamicInfo.value.info[year][`${month}-${day}`] || [])
				let actionMsgArr = [];
				let actionNameMap = { 0: '发布文章', 1: '点赞文章', 2: '发布沸点', 3: '点赞沸点', 4: '关注用户', 5: '关注标签' }
				for (let key in actionCount) {
					actionMsgArr.push(`${actionNameMap[key]}：${actionCount[key]}`)
				}
				return `${year}年${month}月${day}日 </br>${actionMsgArr.join('</br>')}`
			}
		},
		visualMap: {
			type: "piecewise", min: 0, max: 100, orient: 'horizontal', left: 'right', bottom: 0,
			inRange: { color: ['#f2f5f9', '#93c5fd', '#2563ea'] },
			controller: { inRange: { symbolSize: [10, 100] } },
			pieces: [{ lt: 1, }, { gte: 1, lt: 20 }, { gte: 20, lt: 60 }, { gte: 60, lt: 80 }, { gte: 80 }],
			text: ['沸物', '卷王'],
			itemGap: 5, itemWidth: 12, itemHeight: 12,
			textStyle: { fontSize: 10, color: '#ced8e3' },
			selectedMode: false
		},
		calendar: {
			top: 30, left: 30, right: 10, bottom: 24, cellSize: ['auto', 12],
			range: year.value,
			splitLine: { show: false },
			itemStyle: { borderWidth: 2, borderColor: "transparent", },
			dayLabel: { show: true, nameMap: "ZH", color: '#9caabd', fontSize: 10, },
			monthLabel: { show: true, nameMap: 'ZH', color: '#9caabd', align: "left", fontSize: 10 },
			yearLabel: { show: false }
		},
		series: {
			type: 'heatmap',
			coordinateSystem: 'calendar',
			data: chartDynamic[year.value],
			emphasis: { itemStyle: { borderColor: '#7ed3fc', borderWidth: 3 } },
			itemStyle: { borderRadius: 2 },
			select: { itemStyle: { borderColor: '#7ed3fc', borderWidth: 3 } },
			selectedMode: "single"
		}
	})
}

// 处理动态
const handleDynamics = () => {
	for (let year in dynamicInfo.value.info) {
		years.value.push(year);
		let start = `${year}-01-01`;
		let end = `${Number(year) + 1}-01-01`;
		let yearList = [];
		while (start !== end) {
			let actions = dynamicInfo.value.info[year][proxy.$dayjs(start).format('MM-DD')] || [];
			let count = getDynamicScoreByActions(actions);
			yearList.push([start, count]);
			start = proxy.$dayjs(start).add(1, 'day').format('YYYY-MM-DD');
		}
		chartDynamic[year] = yearList;
	}
	year.value = years.value[years.value.length - 1];
	drawChart();
}

// 获取数据
const load = async (isRefresh = false) => {
	loading.value = true;
	let userId = proxy.$url.info.userId;
	dynamicInfo.value = await ajax(EVENT_MAP.GET_YEAR_DYNAMIC, { userId, isRefresh });
	handleDynamics();
	loading.value = false;
}

onMounted(() => {
	load();
})
</script>
<style scoped lang="less">
.user-dynamic {
	margin-top: 10px;

	.rt {
		display: flex;
		align-items: center;
	}

	/deep/ .change-year {
		width: 120px;

		.el-input__inner {
			border: none;
		}
	}

	.chart-warp {
		height: 140px;
	}
}
</style>
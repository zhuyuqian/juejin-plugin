<!--任务列表-->
<template>
	<a class="task-list" href="https://juejin.cn/user/center/growth" target="_blank">
		<div class="title-warp">今日成长｜{{ taskInfo.todayScore }}</div>
		<div class="progress-warp">
			<div class="current-box" :style="{width: taskInfo.todayPercent}"></div>
		</div>
		<div class="title-warp">
			{{ taskInfo.currentLevelSpec.level_title }}｜LV{{ taskInfo.currentLevel }}｜{{ taskInfo.currentScore }}
		</div>
		<div class="progress-warp">
			<div class="current-box" :style="{width: taskInfo.currentPercent}"></div>
		</div>
	</a>
</template>
<script setup>
import {ref, onMounted} from "vue";
import {ajax, EVENT_MAP} from "@/pages/content/api";

let loading = ref(false);
let taskInfo = ref({todayPercent: 0, currentPercent: 0, currentLevelSpec: {}});

const load = async () => {
	loading.value = true;
	let res = await ajax(EVENT_MAP.GET_SELF_TASK_INFO);
	taskInfo.value = res;
	loading.value = false;
};

onMounted(async () => {
	await load();
});
</script>
<style scoped lang="less">
.task-list {
	position: fixed;
	width: 250px;
	bottom: 10px;
	left: 10px;
	padding: 8px 8px 0 8px;
	border-radius: 4px;
	border: 1px solid var(--juejin-gray-1-1);
	background-color: var(--juejin-layer-1);
	box-sizing: border-box;
	.title-warp {
		font-size: 12px;
		color: var(--juejin-font-2);
	}
	.progress-warp {
		width: 100%;
		height: 6px;
		border-radius: 6px;
		background-color: var(--juejin-gray-1-1);
		margin-top: 2px;
		margin-bottom: 10px;
		position: relative;
		overflow: hidden;
		.current-box {
			position: absolute;
			left: 0;
			top: 0;
			height: 6px;
			border-radius: 6px;
			background-color: var(--el-color-primary);
		}
	}
}
</style>

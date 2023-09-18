<!--任务列表-->
<template>
	<a class="task-list" href="/user/center/growth" target="_blank">
		<div class="success" :style="{width: taskInfo.persenScore}"></div>
		<span class="text">今日成长 {{ taskInfo.successScore }}</span>
	</a>
</template>
<script setup>
import {ref, onMounted} from "vue";
import {ajax, EVENT_MAP} from "@/pages/content/api";

let loading = ref(false);
let taskInfo = ref({persenScore: 0});

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
	left: 90px;
	bottom: 30px;
	width: 220px;
	height: 20px;
	background-color: var(--juejin-layer-1);
	border-radius: 4px;
	overflow: hidden;
	cursor: pointer;
	.success {
		position: absolute;
		left: 0;
		top: 0;
		height: 20px;
		background-color: var(--el-color-primary);
	}
	.text {
		position: absolute;
		top: 0;
		right: 10px;
		line-height: 20px;
		font-size: 12px;
		color: var(--el-color-primary-light-3);
	}
}
</style>

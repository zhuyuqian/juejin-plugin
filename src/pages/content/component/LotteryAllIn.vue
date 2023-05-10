<!--梭哈抽奖｜未做功能-->
<template>
	<span class="soha-button" @click="soha">梭哈</span>
</template>
<script setup>
const soha = () => {
	alert('功能暂未开发')
}
</script>
<style scoped lang="less">
.soha-button {
	border-radius: 10px;
	padding: 6px 16px;
	margin-left: 10px;
	cursor: pointer;
	font-size: 14px;
	background: linear-gradient(180deg, #ffb46f 15.1%, #ef7d13);
	box-shadow: 0 4px 0 #d25f00;
	color: #fff;
}
</style>
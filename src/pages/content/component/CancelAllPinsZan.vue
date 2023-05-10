<!--取消我的赞-->
<template>
	<el-button class="cancel-all-pins-zan" type="primary"
						 :loading="buttonLoading" :disabled="!pins.length || !count" @click="cancelAllPins">
		{{ buttonText }}
	</el-button>
</template>
<script setup>
import { ref, onMounted, computed, getCurrentInstance } from 'vue';
import { ajax, EVENT_MAP } from "@/pages/content/api";
import { sleep } from "@/tool";

let { proxy } = getCurrentInstance();
let loading = ref(false);
let remove = ref(null);
let pins = ref([]);
let count = ref(0);
let removeCount = ref(0);
// 按钮禁用
let buttonLoading = computed(() => {
	return loading.value || !!remove.value;
});
// 按钮文字
let buttonText = computed(() => {
	if (remove.value) return `正在取消点赞：${remove.value.msg_Info.content.slice(0, 20)}...已完成${removeCount.value}个`;
	if (loading.value) return `正在获取沸点数据`;
	if (!pins.value.length) return "已取消全部点赞沸点";
	return `取消全部点赞沸点（共${count.value}条）`;
})
const cancelAllPins = () => {
	const cancel = async () => {
		if (!pins.value.length) return;
		while (pins.value.length) {
			remove.value = pins.value.shift();
			await sleep(0.1);
			let success = await ajax(EVENT_MAP.CANCEL_ZAN_PIN, remove.value);
			if (success) {
				removeCount.value++;
				await sleep(1);
			} else {
				pins.value.unshift(remove.value);
				removeCount.value = 0;
				break;
			}
		}
		remove.value = null;
		// 如果还有，说明有没删完的情况，就不做任何处理
		if (pins.value.length) return;
		// 如果没有，就再次获取
		await load();
		cancel()
	}
	if (confirm("你确定要取消点赞全部沸点么？")) {
		cancel();
	}
}
const load = async () => {
	loading.value = true;
	let userId = proxy.$url.info.userId;
	let res = await ajax(EVENT_MAP.GET_USER_ZAN_PINS, userId);
	count.value = res.count;
	pins.value = res.pins;
	loading.value = false;
}
onMounted(async () => {
	await load();
})
</script>
<style scoped lang="less">
.cancel-all-pins-zan {
	width: 100%;
	margin-top: 10px;
}
</style>
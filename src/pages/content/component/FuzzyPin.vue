<template>
	<span class="plugin-pin-button" @click="visible=true">屏蔽<br/>沸点</span>
	<el-dialog v-model="visible" title="屏蔽沸点" width="500px" class="plugin-dialog"
						 :close-on-press-escape="false" :close-on-click-modal="false" :show-close="false">
		<el-form label-position="top">
			<el-form-item label="指定用户ID">
				<el-select v-model="hiddenUserIds" multiple filterable allow-create default-first-option :reserve-keyword="false" placeholder="请输入用户id">
					<el-option v-for="userId in hiddenUserIds" :key="userId" :label="userId" :value="userId"/>
				</el-select>
			</el-form-item>
			<el-form-item label="指定关键字">
				<el-select v-model="hiddenKeywords" multiple filterable allow-create default-first-option :reserve-keyword="false" placeholder="请输入关键字">
					<el-option v-for="keyword in hiddenKeywords" :key="keyword" :label="keyword" :value="keyword"/>
				</el-select>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button type="primary" @click="save">保存</el-button>
			<el-button @click="visible=false">取消</el-button>
		</template>
	</el-dialog>
</template>
<script setup>
import { ref } from "vue";

let visible = ref(false);

const hiddenUserIds = ref(JSON.parse(localStorage.getItem('pluginHiddenUserIds') || '[]'));
const hiddenKeywords = ref(JSON.parse(localStorage.getItem('pluginHiddenKeywords') || '[]'));

const save = () => {
	localStorage.setItem('pluginHiddenUserIds', JSON.stringify(hiddenUserIds.value));
	localStorage.setItem('pluginHiddenKeywords', JSON.stringify(hiddenKeywords.value));
	visible.value = false;
	handle();
}

const handle = () => {
	end();
	let pins = $('.pin');
	for (let pin of pins) {
		let auth = $(pin).find('.pin-header-row')[0];
		if (!auth) continue;
		if (pin.querySelector('.plugin-pin-shadow')) continue;
		let authUserId = $(auth).attr('data-author-id');
		let contentText = pin.querySelector('.content').innerText;
		let html = ''
		if (hiddenUserIds.value.includes(authUserId)) { // 隐藏指定用户
			html = `<div class='plugin-pin-shadow'><span>已屏蔽用户</span></div>`
		}
		let targetHiddenKeywords = hiddenKeywords.value.filter(keyword => contentText.includes(keyword));
		if (targetHiddenKeywords.length) { // 隐藏指定内容
			html = `<div class='plugin-pin-shadow'><span>已屏蔽关键字</span></div>`
		}
		if (html) {
			$(pin).append($(html));
		}
	}
	start();
}

let timeOut = null;
const handleDOMNodeInserted = (e) => {
	if (timeOut) clearTimeout(timeOut);
	timeOut = setTimeout(() => {
		handle();
	}, 50)
}
const start = () => {
	$("#juejin").bind('DOMNodeInserted', handleDOMNodeInserted);
}
const end = () => {
	$("#juejin").unbind('DOMNodeInserted', handleDOMNodeInserted);
}

start();
</script>
<style scoped lang="less">
.plugin-pin-button {
	position: fixed;
	right: 20px;
	bottom: 150px;
	width: 50px;
	height: 50px;
	text-align: center;
	border-radius: 50%;
	background-color: var(--plugin-hover-background);
	color: var(--plugin-text-color);
	padding-top: 8px;
	box-sizing: border-box;
	cursor: pointer;

	&:hover {
		color: var(--plugin-title-color);
	}
}
</style>
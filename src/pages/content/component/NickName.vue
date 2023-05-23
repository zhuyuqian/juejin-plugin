<template>
	<el-dialog v-model="visible" title="设置别名" width="500px" class="plugin-dialog"
						 :close-on-press-escape="false" :close-on-click-modal="false" :show-close="false">
		<el-form label-position="top">
			<el-form-item label="用户Id">
				<el-input v-model="currentNickName.userId" placeholder="请输入用户id" disabled/>
			</el-form-item>
			<el-form-item label="配置昵称">
				<el-input v-model="currentNickName.nickName" placeholder="请输入备注名称"/>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button type="primary" @click="save">保存</el-button>
			<el-button @click="visible=false">取消</el-button>
		</template>
	</el-dialog>
</template>
<script setup>
import { ref, onUnmounted, getCurrentInstance } from "vue";

let { proxy } = getCurrentInstance();
let visible = ref(false);

const nickNameMap = ref(JSON.parse(localStorage.getItem('pluginNickNameMap') || '{}'));
const currentNickName = ref({ userId: null, nickName: '' });

const open = (e) => {
	let userId = $(e.currentTarget).attr('data-user-id');
	if (!userId) return;
	currentNickName.value = { userId, nickName: nickNameMap.value[userId] || '' }
	visible.value = true;
}

const save = () => {
	nickNameMap.value[currentNickName.value.userId] = currentNickName.value.nickName;
	for (let userId in nickNameMap.value) {
		if (!nickNameMap.value[userId]) delete nickNameMap.value[userId];
	}
	localStorage.setItem('pluginNickNameMap', JSON.stringify(nickNameMap.value));
	visible.value = false;
	handleDomChange();
}

const handleInsertNickName = () => {
	for (let username of $('a.username')) {
		let userId = $(username).attr('href').split('/user/')[1];
		let nick = $(username).find('.plugin-nick');
		if (!nick.length) {
			nick = $('<span class="plugin-nick"></span>');
			$(username).append(nick)
		}
		nick.text(nickNameMap.value[userId] || '');
	}
	let homeUser = $('.user-info-block');
	if (homeUser.length) {
		let userId = proxy.$url.info.userId;
		let nick = homeUser.find('.plugin-nick');
		if (!nick.length) {
			nick = $('<span class="plugin-nick"></span>');
			homeUser.find('.user-name').append(nick)
		}
		nick.text(nickNameMap.value[userId] || '');
	}
}


const handleInsertButton = () => {
	// 弹出框
	let popover = $('.popover-content')
	if (popover.html() && popover.html().includes('operate-btn')) {
		let userId = popover.find('.username').attr('href').split('/user/')[1];
		popover.find('.operate-btn').append(`<span class="plugin-set-nickname" data-user-id="${userId}">别名</span>`)
	}
	// 用户首页｜用户控制区
	let user = $('.user-info-block');
	if (user.length && !user.find('.plugin-set-nickname').length) {
		let userId = proxy.$url.info.userId;
		user.find('.introduction .right').append(`<span class="plugin-set-nickname" data-user-id="${userId}">别名</span>`)
	}
}

// 当页面dom发生变化后的处理函数
const handleDomChange = () => {
	unBind();
	handleInsertNickName();
	handleInsertButton();
	bind();
}

let timeOut = null;
// 绑定的函数
const handleDOMNodeInserted = () => {
	if (timeOut) clearTimeout(timeOut);
	timeOut = setTimeout(() => {
		handleDomChange();
		timeOut = null
	}, 50)
}

const bind = () => {
	$("#juejin").on('DOMNodeInserted', handleDOMNodeInserted);
	$(".plugin-set-nickname").on('click', open)
}
const unBind = () => {
	$("#juejin").off('DOMNodeInserted', handleDOMNodeInserted);
	$(".plugin-set-nickname").off('click')
}

bind();

onUnmounted(() => {
	unBind();
})
</script>
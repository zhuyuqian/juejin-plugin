<!--特别关注-->
<template>
	<span class="plugin-fixed-left special-attention" :class="{active:showList}" @click="showList = !showList">
		特<br/>别<br/>关<br/>注
	</span>
	<div class="special-attention-warp" :class="{active:showList}">
		<div class="attention-box" v-for="attention of attentionList">
			<a class="info" target="_blank" :href="`/user/${attention.userId}`">
				<img class="avatar" :src="attention.userAvatar"/>
				<div class="name">
					{{ attention.userName }}<span class="nick">{{ nickNameMap[attention.userId] || '' }}</span>
				</div>
			</a>
			<span class="cancel" @click.stop="cancel(attention)">取关</span>
		</div>
	</div>
</template>
<script setup>
import { ref, onUnmounted, getCurrentInstance } from 'vue';

let { proxy } = getCurrentInstance();
const showList = ref(false);
const attentionList = ref(JSON.parse(localStorage.getItem('pluginSpecialAttention') || '[]'));
const nickNameMap = ref(JSON.parse(localStorage.getItem('pluginNickNameMap') || '{}'));


const findAttentionIndex = (userId) => {
	return attentionList.value.findIndex(attention => attention.userId === userId);
}

// 直接取关
const cancel = (attention) => {
	let attentionIndex = findAttentionIndex(attention.userId);
	attentionList.value.splice(attentionIndex, 1);
	localStorage.setItem('pluginSpecialAttention', JSON.stringify(attentionList.value));
}

// 保存
const save = (e) => {
	let userStr = $(e.currentTarget).attr('data-user-json');
	let user = JSON.parse(userStr);
	let attentionIndex = findAttentionIndex(user.userId);
	if (attentionIndex !== -1) { // 存在，取关
		attentionList.value.splice(attentionIndex, 1);
		$('.plugin-set-attention').text('特关')
	} else { // 不存在，前面新增
		user.addTime = new Date().getTime();
		attentionList.value.unshift(user);
		$('.plugin-set-attention').text('取关')
	}
	localStorage.setItem('pluginSpecialAttention', JSON.stringify(attentionList.value));
}


// 在用户名前面插入特别关注的符号
const handleInsertButton = () => {
	// 弹出框
	let popover = $('.popover-content')
	let button = $(`<span class="popover-button plugin-set-attention" title="特别关注"></span>`);
	if (popover.html() && popover.html().includes('operate-btn') && !popover.find('.plugin-set-attention').length) {
		let user = {
			userId: popover.find('.username').attr('href').split('/user/')[1],
			userName: popover.find('.username').text().trim(),
			userAvatar: popover.find('img').attr('src')
		}
		let attentionIndex = findAttentionIndex(user.userId);
		button.text(attentionIndex !== -1 ? '取关' : '特关')
		button.attr('data-user-json', JSON.stringify(user))
		popover.find('.operate-btn').append(button);
	}
	// 用户首页｜用户控制区
	let userBlock = $('.user-info-block');
	if (userBlock.length && !userBlock.find('.plugin-set-attention').length) {
		let user = {
			userId: proxy.$url.info.userId,
			userName: userBlock.find('.user-name').text().trim(),
			userAvatar: userBlock.find('.avatar').attr('src')
		}
		let attentionIndex = findAttentionIndex(user.userId);
		button.text(attentionIndex !== -1 ? '取关' : '特关')
		button.attr('data-user-json', JSON.stringify(user));
		userBlock.find('.introduction .right').append(button)
	}
	button.on('click', save)
}

// 当页面dom发生变化后的处理函数
const handleDomChange = () => {
	unBind();
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

}
const unBind = () => {
	$("#juejin").off('DOMNodeInserted', handleDOMNodeInserted);
}

bind();

onUnmounted(() => {
	unBind();
})
</script>
<style scoped lang="less">
.special-attention {
	top: 210px;
}

.special-attention-warp {
	z-index: 0;
	left: -300px;
	transition: left 0.5s;
	position: fixed;
	top: 100px;
	width: 250px;
	bottom: 100px;
	border-radius: 4px;
	overflow-y: auto;
	background-color: var(--juejin-layer-1);
	padding: 10px;
	box-sizing: border-box;

	&.active {
		left: 50px;
	}

	.attention-box {
		margin-top: 10px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		cursor: pointer;

		.info {
			flex: 1;
			display: flex;
			align-items: center;

			.avatar {
				width: 30px;
				height: 30px;
				border-radius: 4px;
			}

			.name {
				font-size: 14px;
				margin-left: 10px;
				color: var(--juejin-font-1);
				font-weight: bold;

				.nick {
					margin-left: 4px;
					font-size: 12px;
					color: var(--juejin-font-3);
				}
			}
		}

		.cancel {
			font-size: 12px;
			display: none;
			cursor: pointer;
			color: var(--juejin-font-3);
		}

		&:hover {
			.name {
				color: var(--el-color-primary);
			}

			.cancel {
				display: block;
				color: var(--el-color-primary);
			}
		}

		&:first-child {
			margin-top: 0;
		}
	}
}
</style>
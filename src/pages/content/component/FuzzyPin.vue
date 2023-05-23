<!--屏蔽沸点-->
<template>
	<span class="plugin-pin-button" @click="visible=true">屏<br/>蔽<br/>沸<br/>点</span>
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
import { ref, onUnmounted } from "vue";

let visible = ref(false);

const hiddenUserIds = ref(JSON.parse(localStorage.getItem('pluginHiddenUserIds') || '[]'));
const hiddenKeywords = ref(JSON.parse(localStorage.getItem('pluginHiddenKeywords') || '[]'));

// 保存屏蔽内容
const save = () => {
	localStorage.setItem('pluginHiddenUserIds', JSON.stringify(hiddenUserIds.value));
	localStorage.setItem('pluginHiddenKeywords', JSON.stringify(hiddenKeywords.value));
	visible.value = false;
	handleDomChange();
}

// 获取命中的关键字
const getTargetKeywordStr = content => {
	let targets = hiddenKeywords.value.filter(keyword => content.includes(keyword));
	return targets.length ? targets.join(';') : '';
}

// 处理上级回复
const handleParentReplys = () => {
	let replys = [];
	for (let reply of $('.sub-comment .parent-wrapper .parent-content')) {
		if (!$(reply).attr('data-pin-hidden')) {
			replys.push(reply)
		}
	}
	for (let reply of replys) {
		let replyContent = reply.innerText;
		// 需要替换的文本内容
		let hitContent = '';
		// 命中内容
		let hitKeyword = getTargetKeywordStr(replyContent);
		if (hitKeyword) hitContent = `${new Array(replyContent.length).fill('*').join('')}（命中关键字：${hitKeyword}）`

		if (hitContent) {
			// 给节点标记一个属性
			$(reply).attr('data-pin-hidden', 1);
			reply.innerText = hitContent;
		}
	}
}

// 处理回复
const handleReplys = () => {
	let replys = [];
	for (let reply of $('.sub-comment')) {
		if ($(reply).attr('data-jj-helper-comment-id') && !$(reply).attr('data-pin-hidden')) {
			replys.push(reply)
		}
	}
	for (let reply of replys) {
		// 回复的用户
		let replyUserId = $(reply.querySelector('.user-link')).attr('href').split('/user/')[1];
		// 回复的内容
		let replyDom = reply.querySelector('.content-wrapper .content');

		let replyContent = replyDom.innerText;
		// 需要替换的文本内容
		let hitContent = '';
		// 命中用户
		if (hiddenUserIds.value.includes(replyUserId)) hitContent = `${new Array(replyContent.length).fill('*').join('')}（命中掘友ID）`
		// 命中内容
		let hitKeyword = getTargetKeywordStr(replyContent);
		if (hitKeyword) hitContent = `${new Array(replyContent.length).fill('*').join('')}（命中关键字：${hitKeyword}）`

		if (hitContent) {
			// 给节点标记一个属性
			$(reply).attr('data-pin-hidden', 1);
			replyDom.innerText = hitContent;
		}
	}
}

// 处理热评
const handleHotComments = () => {
	let comments = [];
	for (let comment of $('.hot-comment-row .desc')) {
		if (!$(comment).attr('data-pin-hidden')) {
			comments.push(comment);
		}
	}
	for (let comment of comments) {
		// 评论的内容
		let commentContent = comment.innerText;
		// 需要替换的文本内容
		let hitContent = '';
		// 命中内容
		let hitKeyword = getTargetKeywordStr(comment.innerText);
		if (hitKeyword) {
			hitContent = `${new Array(commentContent.length).fill('*').join('')}（命中关键字：${hitKeyword}）`
		}
		if (hitContent) {
			// 给节点标记一个属性
			$(comment).attr('data-pin-hidden', 1);
			comment.innerText = hitContent;
		}
	}
}

// 处理评论
const handleComments = () => {
	let comments = [];
	for (let comment of $('.comment')) {
		if ($(comment).attr('data-jj-helper-comment-id') && !$(comment).attr('data-pin-hidden')) {
			comments.push(comment);
		}
	}
	for (let comment of comments) {
		// 评论的用户
		let commentUserId = $(comment.querySelector('.user-link')).attr('href').split('/user/')[1];
		// 评论的内容
		let commentDom = comment.querySelector('.comment-main .content');
		let commentContent = commentDom.innerText;
		// 需要替换的文本内容
		let hitContent = '';
		// 命中用户
		if (hiddenUserIds.value.includes(commentUserId)) {
			hitContent = `${new Array(commentContent.length).fill('*').join('')}（命中掘友ID）`
		}
		// 命中内容
		let hitKeyword = getTargetKeywordStr(commentDom.innerText);
		if (hitKeyword) {
			hitContent = `${new Array(commentContent.length).fill('*').join('')}（命中关键字：${hitKeyword}）`
		}
		if (hitContent) {
			// 给节点标记一个属性
			$(comment).attr('data-pin-hidden', 1);
			commentDom.innerText = hitContent;
		}
	}
}

// 处理沸点
const handlePins = () => {
	let pins = [];
	for (let pin of $('.pin')) {
		if ($(pin).attr('data-pin-id') && !$(pin).attr('data-pin-hidden')) {
			pins.push(pin);
		}
	}
	for (let pin of pins) {
		// 如果有展开按钮，则自动展开
		// let limitButton = pin.querySelector('.limit-btn');
		// if (limitButton && limitButton.innerText.trim() === '展开') limitButton.click();

		// 取出作者id
		let authUserId = $(pin).find('.pin-header-row').attr('data-author-id');
		// 取出沸点内容
		let contentText = pin.querySelector('.content').innerText;

		let html = ''

		// 隐藏指定用户
		if (hiddenUserIds.value.includes(authUserId)) {
			html = `<div class='plugin-pin-shadow'>
								<span class="plugin-pin-shadow-text">命中掘友ID</span>
								<span class="plugin-pin-shadow-desc">${authUserId}</span>
							</div>`
		}
		// 隐藏指定内容
		let hitKeyword = getTargetKeywordStr(contentText);
		if (hitKeyword) {
			html = `<div class='plugin-pin-shadow'>
								<span class="plugin-pin-shadow-text">命中关键字</span>
								<span class="plugin-pin-shadow-desc">${hitKeyword}</span>
							</div>`
		}

		// 如果需要整个屏蔽
		if (html) {
			// 给节点标记一个属性
			$(pin).attr('data-pin-hidden', 1);
			$(pin).append($(html));
		}
	}
}

// 当页面dom发生变化后的处理函数
const handleDomChange = () => {
	unBind();
	handlePins();
	handleComments();
	handleReplys();
	handleHotComments();
	handleParentReplys();
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
<style lang="less">
.plugin-pin-button {
	position: fixed;
	left: 0;
	top: 100px;
	width: 40px;
	padding: 16px 0;
	cursor: pointer;
	font-size: 12px;
	text-align: center;
	box-sizing: border-box;
	border-radius: 0 4px 4px 0;
	background-color: var(--juejin-layer-1);
	color: var(--juejin-font-1);

	&:hover {
		color: var(--juejin-font-brand2-hover);
	}
}

.pin[data-pin-hidden='1'] {
	height: 200px;
	overflow: hidden;
}

.plugin-pin-shadow {
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 1;
	background-color: rgba(0, 0, 0, 0.8);
	backdrop-filter: blur(10px);
	display: flex;
	flex-direction: column;
	align-content: center;
	text-align: center;

	.plugin-pin-shadow-text {
		margin-top: 90px;
		font-size: 26px;
		color: var(--juejin-font-2);
	}

	.plugin-pin-shadow-desc {
		margin-top: 4px;
		font-size: 12px;
		color: var(--juejin-font-3);
	}
}
</style>
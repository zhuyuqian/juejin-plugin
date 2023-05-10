<!--生成随机沸点-->
<template>
	<el-button type="primary" @click="getRandomText()" :loading="loading">生成沸点</el-button>
</template>
<script setup>
import { ref, nextTick } from 'vue';
import { ajax, EVENT_MAP } from "@/pages/content/api";

const loading = ref(false);

let inputEvt = document.createEvent('HTMLEvents')
inputEvt.initEvent('input', true, true)

function pasteHtmlAtCaret(html) {
	var sel, range;
	if (window.getSelection) {
		sel = window.getSelection();
		if (sel.getRangeAt && sel.rangeCount) {
			range = sel.getRangeAt(0);
			range.deleteContents();
			var el = document.createElement("div");
			el.innerHTML = html;
			var frag = document.createDocumentFragment(), node, lastNode;
			while ((node = el.firstChild)) {
				lastNode = frag.appendChild(node);
			}
			;
			range.insertNode(frag);
			if (lastNode) {
				range = range.cloneRange();
				range.setStartAfter(lastNode);
				range.collapse(true);
				sel.removeAllRanges();
				sel.addRange(range);
			}
			;
		}
		;
	} else if (document.selection && document.selection.type != "Control") {
		// IE9以下
		document.selection.createRange().pasteHTML(html);
	}
	;
};

const getRandomText = async () => {
	loading.value = true
	let { success, data } = await ajax(EVENT_MAP.GET_RANDOM_TEXT, $('.new_topic').text().trim());
	loading.value = false
	if (!success) return;
	let editor = document.querySelector('.rich-editor');
	editor.click();
	nextTick(() => {
		editor.innerHTML = data;
		// pasteHtmlAtCaret(data);
		editor.dispatchEvent(inputEvt);
	})
}
</script>
<style scoped>
</style>
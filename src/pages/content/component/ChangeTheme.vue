<template>
	<div class="change-theme">
		<div class="title">主题设置</div>
		<div class="desc">插件修改部分主题色，请和官方页面设置搭配使用</div>
		<el-select class="select-theme" placeholder="请选择主题" v-model="theme" @change="save">
			<el-option v-for="item of [{label:'默认',value:'default'},{label:'黑金',value:'ph'}]" :key="item" :label="item.label" :value="item.value"/>
		</el-select>
	</div>
</template>
<script setup>
import { ref } from "vue";

const theme = ref(localStorage.getItem('pluginTheme') || 'default');

const save = () => {
	localStorage.setItem('pluginTheme', theme.value);
	$('body').attr('data-plugin-theme', theme.value);
}
</script>
<style scoped lang="less">
.change-theme {
	.title {
		font-size: 16px;
		color: var(--juejin-font-1);
		font-weight: bold;
	}

	.desc {
		font-size: 13px;
		line-height: 22px;
		color: var(--juejin-font-3);
		margin: 4px 0;
	}

	.select-theme {

	}
}
</style>
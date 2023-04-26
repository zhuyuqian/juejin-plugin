<template>
	<el-switch v-model="isDark" inline-prompt active-text="黑" inactive-text="白" @change="changeTheme"/>
</template>
<script setup>
import { ref } from 'vue';

let isDark = ref(localStorage.getItem('is-dark') === '1' ? true : false);

const changeClassName = () => {
	if (isDark.value) {
		document.querySelector('html').setAttribute('data-theme', 'dark')
	} else {
		document.querySelector('html').removeAttribute('data-theme')
	}
}

const changeTheme = () => {
	localStorage.setItem('is-dark', isDark.value ? '1' : '0');
	changeClassName();
}

changeClassName();
</script>
<style scoped>
</style>
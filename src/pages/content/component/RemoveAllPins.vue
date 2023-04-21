<template>
  <el-button class="remove-all-pins" type="primary"
             :loading="buttonLoading" :disabled="!pins.length" @click="removeAllPins">{{ buttonText }}
  </el-button>
</template>
<script setup>
import { onMounted, ref, computed } from "vue";
import { getSelfPins, removePin } from "@/pages/background/pins";
import { sleep } from "@/pages/background/tool";

let pins = ref([]);
let remove = ref(null);
let loading = ref(true);

// 按钮禁用
let buttonLoading = computed(() => {
  return loading.value || !!remove.value;
});
// 按钮文字
let buttonText = computed(() => {
  if (remove.value) return `正在删除：${remove.value.msg_Info.content.slice(0, 20)}...剩余${pins.value.length}条`;
  if (loading.value) return `正在获取沸点数据`;
  if (!pins.value.length) return "已清空全部沸点";
  return `删除全部沸点（共${pins.value.length}条）`;
});

const removeAllPins = async () => {
  if (confirm("你确定要删除全部沸点么？")) {
    while (pins.value.length) {
      remove.value = pins.value.shift();
      await sleep(0.1);
      let { success, err_msg } = await removePin(remove);
      if (success) {
        await sleep(1);
      } else {
        pins.value.unshift(remove.value);
        alert(err_msg);
        break;
      }
    }
    remove.value = null;
  }
};

onMounted(async () => {
  loading.value = true;
  pins.value = await getSelfPins();
  loading.value = false;
});
</script>
<style scoped lang="less">
.remove-all-pins {
  width: 100%;
  margin-bottom: 10px;
}
</style>

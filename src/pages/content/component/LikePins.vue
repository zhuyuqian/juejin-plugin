<template>
  <div class="plugin-like-pins">
    <img src="../images/zan.png" @click="startZan"/>
  </div>
</template>
<script setup>
import {ref} from 'vue';
import {sleep} from "@/tool";

let zanIng = ref(false);

// 获取当前所有未获得点赞的沸点
const getNotZanPins = () => {
  let pins = [];
  for (let pin of $('.pin')) {
    if ($(pin).attr('data-pin-id') && !$(pin).find('.like-action.active').length) {
      pins.push(pin)
    }
  }
  return pins;
}

const startZan = async () => {
  if (zanIng.value) return;
  zanIng.value = true;
  let pins = getNotZanPins();
  for (let pin of pins) {
    $("html, body").animate({scrollTop: $(pin).offset().top - 50}, "slow");
    $(pin).find('.like-action').click();
    await sleep(1);
  }
  zanIng.value = false;
}
</script>

<style scoped lang="less">
.plugin-like-pins {
  position: fixed;
  left: 20px;
  bottom: 20px;


  img {
    padding: 10px;
    background: var(--juejin-layer-1);
    display: block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    object-fit: cover;
    cursor: pointer;
    opacity: 0.6;

    &:hover {
      opacity: 1;
    }
  }
}
</style>
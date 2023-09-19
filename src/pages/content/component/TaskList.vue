<!--任务列表-->
<template>
  <div class="task-list" v-loading="loading">
    <div class="click-box" @click="showDetail = !showDetail">
      <div class="title-warp">今日成长｜{{ taskInfo.todayScore }}</div>
      <div class="progress-warp">
        <div class="current-box" :style="{width: taskInfo.todayPercent}"></div>
      </div>
      <div class="title-warp">
        {{ taskInfo.currentLevelSpec.level_title }}｜LV{{ taskInfo.currentLevel }}｜{{ taskInfo.currentScore }}
      </div>
      <div class="progress-warp">
        <div class="current-box" :style="{width: taskInfo.currentPercent}"></div>
      </div>
    </div>
    <div class="detail-title" v-if="showDetail">-详情-</div>
    <div class="detail-warp" :style="{height:showDetail?'':0}">
      <template v-for="group of taskInfo.taskGroup">
        <template v-for="task of group.tasks">
          <div class="task-warp" v-if="task.limitCount>0">
            <a class="task-title" :href="task.origin.web_jump_url" target="_blank">
              {{ task.title }} {{ task.successCount }}/{{ task.limitCount }}
            </a>
            <div class="task-box">
              <div class="current-box" :style="{width: (task.successScore / task.allScore) * 100 +'%'}"></div>
            </div>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>
<script setup>
import {ref, onMounted} from "vue";
import {ajax, EVENT_MAP} from "@/pages/content/api";

let showDetail = ref(false);
let loading = ref(false);
let taskInfo = ref({todayPercent: 0, currentPercent: 0, currentLevelSpec: {}, taskGroup: []});

const load = async () => {
  loading.value = true;
  let res = await ajax(EVENT_MAP.GET_SELF_TASK_INFO);
  taskInfo.value = res;
  loading.value = false;
};

onMounted(async () => {
  await load();
});
</script>
<style scoped lang="less">
.task-list {
  position: fixed;
  width: 250px;
  bottom: 10px;
  left: 10px;
  padding: 8px 8px 0 8px;
  border-radius: 4px;
  border: 1px solid var(--juejin-gray-1-1);
  background-color: var(--juejin-layer-1);
  box-sizing: border-box;
  z-index: 9999;
  font-size: 12px;

  .click-box {
    cursor: pointer;

    .title-warp {
      color: var(--juejin-font-1);
    }

    .progress-warp {
      width: 100%;
      height: 6px;
      border-radius: 6px;
      background-color: var(--juejin-gray-1-1);
      margin-top: 2px;
      margin-bottom: 10px;
      position: relative;
      overflow: hidden;

      .current-box {
        position: absolute;
        left: 0;
        top: 0;
        height: 6px;
        border-radius: 6px;
        background-color: var(--el-color-primary);
      }
    }
  }


  .detail-title {
    text-align: center;
    margin: 4px auto;
    color: var(--juejin-font-4);
  }

  .detail-warp {
    transition: height 0.3s;
    height: 300px;
    overflow-y: auto;

    .task-warp {
      .task-title {
        color: var(--juejin-font-2);

        &:hover {
          color: var(--el-color-primary);
        }
      }

      .task-box {
        height: 6px;
        border-radius: 6px;
        background-color: var(--juejin-gray-1-1);
        margin-top: 2px;
        margin-bottom: 10px;
        position: relative;
        overflow: hidden;

        .current-box {
          position: absolute;
          left: 0;
          top: 0;
          height: 6px;
          border-radius: 6px;
          background-color: var(--el-color-primary-light-3);
        }
      }
    }
  }
}
</style>

<!--删除我的全部沸点-->
<template>
  <el-button class="remove-all-pins" type="primary" @click="openListVisible">
    我的全部沸点
  </el-button>
  <el-dialog v-model="listVisible" title="我发布的沸点" width="50%" class="plugin-dialog"
             :close-on-press-escape="false" :close-on-click-modal="false" :show-close="false">
    <el-table :data="pins" border style="width: 100%" size="small" height="50vh" v-loading="loading"
              @selection-change="selectRemovePins">
      <el-table-column type="selection" width="55" align="center" v-if="!removing"/>
      <el-table-column width="55" align="center" v-if="removing">
        <template #default="scope">
          <el-icon v-if="scope.row.removeStatus===1" size="16">
            <Loading/>
          </el-icon>
          <el-icon v-if="scope.row.removeStatus===2" size="16" color="blue">
            <CircleCheck/>
          </el-icon>
          <el-icon v-if="scope.row.removeStatus===3" size="16" color="red">
            <CircleClose/>
          </el-icon>
        </template>
      </el-table-column>
      <el-table-column label="内容" prop="msg_Info.content" align="center" show-overflow-tooltip/>
      <el-table-column label="评论数" prop="msg_Info.comment_count" width="80" align="center" sortable/>
      <el-table-column label="点赞数" prop="msg_Info.digg_count" width="80" align="center" sortable/>
      <el-table-column label="发布时间" prop="msg_Info.ctime" width="160" align="center" sortable>
        <template #default="scope">
          {{ $dayjs(scope.row.msg_Info.ctime * 1000).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column label="所属圈子" prop="topic.title" width="150" align="center" sortable>
        <template #default="scope">
          <div style="display: inline-flex;align-items: center">
            <el-image :src="scope.row.topic.icon" style="width: 20px; height: 20px;margin-right: 4px" fit="fill"/>
            <span>{{ scope.row.topic.title }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="热度" prop="msg_Info.hot_index" width="80" align="center" sortable show-overflow-tooltip/>
    </el-table>
    <template #footer>
      <el-button type="primary" v-if="removePins.length" @click="removePin">删除</el-button>
      <el-button :disabled="removing" @click="listVisible=false">关闭</el-button>
    </template>
  </el-dialog>
</template>
<script setup>
import {ref, getCurrentInstance} from "vue";
import {ajax, EVENT_MAP} from "@/pages/content/api";
import {sleep} from "@/tool";

let {proxy} = getCurrentInstance();
let pins = ref([]);
let removePins = ref([]);
let loading = ref(true);
let removing = ref(false);
let listVisible = ref(false)

// 点击删除
const removePin = async () => {
  removing.value = true;
  for (let pin of removePins.value) {
    pin.removeStatus = 1
    let {success} = await ajax(EVENT_MAP.REMOVE_PIN, pin);
    await sleep(1)
    if (success) {
      pin.removeStatus = 2
    } else {
      pin.removeStatus = 3
    }
  }
  removing.value = false;
  removePins.value = [];
  await load()
}

// 选择删除的
const selectRemovePins = (removes) => {
  removePins.value = removes;
}


const openListVisible = () => {
  listVisible.value = true;
  load();
}

// 获取数据
const load = async () => {
  let userId = proxy.$self.user_basic.user_id;
  loading.value = true;
  pins.value = await ajax(EVENT_MAP.GET_USER_PINS, userId);
  pins.value.forEach(pin => {
    pin.removeStatus = 0;
  })
  loading.value = false;
}
</script>
<style scoped lang="less">
.remove-all-pins {
  width: 100%;
  margin-bottom: 10px;
}
</style>
<template>
  <el-card class="pin-club-user-rank" :shadow="false" v-loading="loading">
    <template #header>
      <span class="title-box">{{ rankInfo.club.topic.title }}｜本周沸物</span>
      <span class="desc-box">
        最近更新：{{ dayjs(rankInfo.time).format("YYYY-MM-DD HH:mm:ss") }}
      </span>
    </template>
    <div class="rank-warp">
      <div class="rank-box" v-for="(rank,rankIndex) of rankInfo.rank">
        <div class="rank-title">
          <span class="title-box">榜{{ rankIndex + 1 }}</span>
          <span class="count-box">{{ rank.msgCount }}条 / 沸物</span>
        </div>
        <div class="user-warp">
          <div class="user-box" v-for="user of rank.users">
            <el-avatar shape="square" :size="30" :src="user.userInfo.avatar_large" />
            <span class="user-name">{{ user.userInfo.user_name }}</span>
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>
<script setup>
import { onMounted, ref } from "vue";
import dayjs from "dayjs";
import { initUrlInfo } from "@/utils";
import { getPinClubHotRank } from "@/pages/background/pins";

let rankInfo = ref({ time: null, rank: [], club: { topic: {} } });
let loading = ref(true);
onMounted(async () => {
  loading.value = true;
  let urlInfo = await initUrlInfo();
  rankInfo.value = await getPinClubHotRank(urlInfo.info.clubId);
  loading.value = false;
});
</script>
<style scoped lang="less">
.pin-club-user-rank {
  margin-bottom: 10px;
  margin-top: 10px;

  .title-box {
    font-size: 16px;
    font-weight: bold;
    color: #333;
  }

  .desc-box {
    font-size: 12px;
    color: #999;
  }

  .rank-warp {
    display: flex;

    .rank-box {
      flex: 1;

      .rank-title {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .title-box {
          font-size: 14px;
          color: #333;
        }

        .count-box {
          margin-right: 20px;
          font-size: 12px;
          color: #999;
        }
      }

      .user-warp {
        margin-top: 10px;
        max-height: 150px;
        overflow-y: auto;

        .user-box {
          display: flex;
          align-items: center;
          margin-bottom: 10px;

          &:last-child {
            margin-bottom: 0;
          }

          .user-name {
            margin-left: 15px;
            font-size: 13px;
            color: #333;
          }
        }
      }
    }
  }
}
</style>

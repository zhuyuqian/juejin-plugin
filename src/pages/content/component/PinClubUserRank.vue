<template>
	<el-card class="pin-club-user-rank" shadow="never" v-loading="loading">
		<template #header>
			<span class="title-box">{{ clubInfo.topic.title }}｜本周沸物</span>
			<span class="desc-box" v-if="rankInfo.time">
        最近更新：{{ dayjs(rankInfo.time).fromNow() }}
      </span>
		</template>
		<div class="rank-warp">
			<div class="rank-box" v-for="(rank,rankIndex) of rankInfo.rank">
				<div class="rank-title">
					<span class="title-box">榜{{ rankIndex + 1 }}</span>
					<span class="count-box">沸物:{{ rank.users.length }}人｜人均:{{ rank.msgCount }}条</span>
				</div>
				<div class="user-warp">
					<a class="user-box" v-for="user of rank.users" :href="`https://juejin.cn/user/${user.userInfo.user_id}`" target="_blank">
						<el-avatar shape="square" :size="30" :src="user.userInfo.avatar_large"/>
						<span class="user-name">{{ user.userInfo.user_name }}</span>
					</a>
				</div>
			</div>
		</div>
	</el-card>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { initUrlInfo } from "@/pages/content/utils";
import { getPinClubHotRank, getPinClubInfo } from "@/pages/background/pins";

let rankInfo = ref({ time: null, rank: [] });
let clubInfo = ref({ topic: { title: '' } });
let loading = ref(true);

onMounted(async () => {
	loading.value = true;
	let urlInfo = await initUrlInfo();
	rankInfo.value = await getPinClubHotRank(urlInfo.info.clubId);
	clubInfo.value = await getPinClubInfo(urlInfo.info.clubId);
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
				align-items: center;

				.title-box {
					font-size: 14px;
					color: #333;
				}

				.count-box {
					margin-left: 10px;
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
						margin-left: 6px;
						font-size: 13px;
						color: #333;
					}

					&:hover {
						.user-name {
							color: #1e80ff;
						}
					}
				}
			}
		}
	}
}
</style>

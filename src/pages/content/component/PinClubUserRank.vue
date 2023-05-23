<!--沸点圈子今日沸物-->
<template>
	<el-card class="pin-club-user-rank" shadow="never" v-loading="loading">
		<template #header>
			<span class="title-box">{{ clubInfo.topic.title }}｜今日沸物</span>
			<el-tooltip v-if="rankInfo.time" effect="dark" placement="top" :content="`最近更新：${$dayjs(rankInfo.time).fromNow() }`">
				<el-icon class="refresh-button" size="20" color="#999" @click="load(true)">
					<Refresh/>
				</el-icon>
			</el-tooltip>
		</template>
		<div class="rank-warp">
			<div class="rank-box" v-for="(rank,rankIndex) of rankInfo.rank">
				<div class="rank-title">
					<span class="title-box">榜{{ rankIndex + 1 }}</span>
					<span class="count-box">沸物:{{ rank.users.length }}人｜人均:{{ rank.msgCount }}条</span>
				</div>
				<div class="user-warp">
					<template v-for="user of rank.users">
						<a class="user-box" :href="`https://juejin.cn/user/${user.userInfo.user_id}`" target="_blank">
							<el-avatar shape="square" :size="30" :src="user.userInfo.avatar_large"/>
							<span class="user-name">{{ user.userInfo.user_name }}</span>
						</a>
					</template>
				</div>
			</div>
		</div>
	</el-card>
</template>
<script setup>
import { onMounted, ref, getCurrentInstance } from "vue";
import { ajax, EVENT_MAP } from "@/pages/content/api";

let { proxy } = getCurrentInstance();
let rankInfo = ref({ time: null, rank: [] });
let clubInfo = ref({ topic: { title: '' } });
let loading = ref(true);

const load = async (isRefresh = false) => {
	loading.value = true;
	let clubId = proxy.$url.info.clubId;
	clubInfo.value = await ajax(EVENT_MAP.GET_PIN_CLUB_INFO, clubId);
	rankInfo.value = await ajax(EVENT_MAP.GET_PIN_CLUB_DAY_USER_RANK, { clubId: clubId, isRefresh });
	loading.value = false;
}

onMounted(() => {
	load();
});

async function doSendAPin() {
	loading.value = true;
	await sendARandomPin();
	loading.value = false;
	confirm("发送成功");
}
</script>
<style scoped lang="less">
.pin-club-user-rank {
	margin-bottom: 10px;
	margin-top: 10px;

	.title-box {
		font-size: 16px;
		font-weight: bold;
		color: var(--juejin-font-1);
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
					color: var(--juejin-font-1);
				}

				.count-box {
					margin-left: 10px;
					font-size: 12px;
					color: var(--juejin-font-3);
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
						color: var(--juejin-font-1);
					}

					&:hover {
						.user-name {
							color: var(--juejin-font-brand2-hover);
						}
					}
				}
			}
		}
	}
}
</style>

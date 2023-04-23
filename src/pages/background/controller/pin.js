// 沸点相关
import { getShortMsgList, removeShortMsg } from "../../../api/content";
import { queryTopicDetail } from "../../../api/tag";
import { getTopicShortMsgList } from "../../../api/recommend";
import { getStorage, setStorage } from "../chrome";
import { getUserInfo } from "./user";
import { dayjs } from "../../../tool";
import { cancelDigg, diggQueryPage } from "../../../api/interact";

/*
* 获取用户沸点列表
* */
export const getUserPins = async (userId) => {
	// 先获取数量
	let res = await getShortMsgList({ userId, limit: 1 });
	if (!res.success) return [];
	res = await getShortMsgList({ userId, limit: res.count });
	return res.success ? res.data : []
}

/*
* 删除沸点
* */
export const removePin = async (pin) => {
	let { success } = await removeShortMsg(pin.msg_id);
	return success
}

/*
* 获取用户点赞列表
* */
export const getUserZanPins = async (userId) => {
	let { success, data, count } = await diggQueryPage({ user_id: userId, item_type: 4 });
	return success ? { pins: data, count: count } : { pins: [], count: 0 }
}

/*
* 取消点赞
* */
export const cancelZanPin = async (pin) => {
	let { success } = await cancelDigg(pin.msg_id, 4);
	return success;
}

/*
* 获取圈子详情
* 缓存7天
* */
export const getPinClubInfo = async (clubId) => {
	let storageKey = `pin-club-info-${clubId}`;
	let storage = await getStorage(storageKey);
	if (storage) return storage;
	let { success, data } = await queryTopicDetail(clubId);
	if (!success) return null
	await setStorage(storageKey, data, 60 * 24 * 7);
	return data
}

/*
* 获取圈子一周废物榜
* 缓存10分钟
* */
export const getPinClubWeekUserRank = async (clubId) => {
	let storageKey = `pin-club-week-user-rank-${clubId}`;
	let storage = await getStorage(storageKey);
	if (storage) return storage;
	storage = { time: dayjs().format('YYYY-MM-DD HH:mm:ss'), rank: [] }
	let { success, data } = await getTopicShortMsgList({ topic_id: clubId, limit: 1000 })
	if (!success) return storage
	let userMap = {};
	let targetTime = dayjs().startOf('week').valueOf();
	for (let msg of data) {
		if (msg.msg_Info.ctime * 1000 < targetTime) break;
		let { user_id } = msg.msg_Info;
		userMap[user_id] ? userMap[user_id].push(msg) : userMap[user_id] = [msg];
	}
	let users = [];
	for (let userId in userMap) {
		users.push({ userId, msgs: userMap[userId] });
	}
	users.sort((a, b) => b.msgs.length - a.msgs.length);
	let rank = [];
	let userIds = [];
	for (let user of users) {
		if (!rank.length) {
			userIds.push(user.userId);
			rank.push({ msgCount: user.msgs.length, users: [user] });
		} else {
			let { msgCount, users } = rank[rank.length - 1];
			if (user.msgs.length === msgCount) {
				userIds.push(user.userId);
				users.push(user);
			} else {
				if (rank.length < 3) {
					userIds.push(user.userId);
					rank.push({ msgCount: user.msgs.length, users: [user] });
				} else {
					break;
				}
			}
		}
	}
	let userList = await Promise.all(userIds.map(userId => getUserInfo(userId)));
	userMap = {};
	for (let user of userList) {
		userMap[user.user_id] = user;
	}
	rank.forEach(r => {
		r.users.forEach(user => {
			user.userInfo = userMap[user.userId];
		});
	});
	storage.rank = rank;
	await setStorage(storageKey, storage, 10);
	return storage
}
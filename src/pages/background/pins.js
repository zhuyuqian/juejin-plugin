// 更新登录人的沸点信息
import { getStorage, setStorage } from "./storage";
import { getSelfInfoStorage, getUserInfo } from "./auth";
import { handleApiResult, getCurrentWeekFirstTime, sleep } from "./tool";

/*
* 删除单个沸点
* 传入pin对象
* */
export const removePin = async (pin) => {
	let res = await fetch(`https://api.juejin.cn/content_api/v1/short_msg/delete`, {
		credentials: 'include',
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ msg_id: pin.msg_id })
	}).then(res => res.json());
	return handleApiResult(res);
};

/*
* 获取我的沸点列表
* */
export const getSelfPins = async () => {
	let self = await getSelfInfoStorage();
	if (!self) return;
	return await getUserPins(self.user_basic.user_id);
};

/*
* 获取用户的沸点列表
* 传入用户id
* */
export const getUserPins = async (userId) => {
	let res = await fetch('https://api.juejin.cn/content_api/v1/short_msg/query_list', {
		credentials: 'include',
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ cursor: "0", user_id: userId, sort_type: 4, limit: 999 })
	}).then(res => res.json());
	let { success, data } = handleApiResult(res);
	return success ? (data || []) : [];
};

/*
* 获取用户点赞的沸点列表
* */
export const getUserZanPins = async (userId) => {
	let res = await fetch('https://api.juejin.cn/interact_api/v1/digg/query_page', {
		credentials: 'include',
		method: 'POST',
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ cursor: '0', item_type: 4, sort_type: 2, user_id: userId, limit: 20 })
	}).then(res => res.json());
	let { success, data, count } = handleApiResult(res);
	return success ? { pins: data, count: count } : { pins: [], count: 0 }
}

/*
* 取消点赞沸点
* */
export const cancelZanPin = async (pin) => {
	let res = await fetch('https://api.juejin.cn/interact_api/v1/digg/cancel', {
		credentials: 'include',
		method: 'POST',
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ item_id: pin.msg_id, item_type: 4 })
	}).then(res => res.json());
	console.log(res);
	return handleApiResult(res)
}

/*
* 获取圈子详情
* 传入圈子id
* 缓存7天
* */
export const getPinClubInfo = async (clubId) => {
	let nowTime = new Date().getTime();
	let storage = await getStorage(`pinclub-info-${clubId}`);
	// 一周
	if (storage && (nowTime - storage.time) < (1000 * 60 * 60 * 24 * 7)) return storage.info;
	storage = { time: nowTime, info: null };
	let res = await fetch("https://api.juejin.cn/tag_api/v1/query_topic_detail", {
		credentials: 'include',
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ topic_id: clubId })
	}).then(res => res.json());
	let { success, data } = handleApiResult(res);
	if (!success) return storage.info;
	storage.info = data;
	await setStorage(`pinclub-info-${clubId}`, storage);
	return storage.info;
};

/*
* 获取一周内某个圈子沸点的活跃用户榜单
* 传入圈子id
* 缓存10分钟
* */
export const getPinClubHotRank = async (clubId) => {
	let nowTime = new Date().getTime();
	let storage = await getStorage(`pinclub-hot-rank-${clubId}`);
	if (storage && (nowTime - storage.time) < (1000 * 60 * 10)) return storage;
	storage = { time: nowTime, rank: [] };
	// 获取数据
	let res = await fetch("https://api.juejin.cn/recommend_api/v1/short_msg/topic", {
		credentials: 'include',
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ topic_id: clubId, cursor: "0", id_type: 4, limit: 1000, sort_type: 500 })
	}).then(res => res.json());
	let { success, data } = handleApiResult(res);
	if (!success) return storage;
	let userMap = {};
	let targetTime = getCurrentWeekFirstTime();
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
	// 存储数据
	await setStorage(`pinclub-hot-rank-${clubId}`, storage);
	return storage;
};

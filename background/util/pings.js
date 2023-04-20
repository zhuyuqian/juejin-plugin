// 更新登录人的沸点信息
import { getStorage, setStorage } from "./storage.js";
import { getSelfInfoStorage, getUserInfo } from "./auth.js";
import { getCookie, handleApiResult, sleep, getCurrentWeekFirstTime } from "./tool.js";


export const setPingsStorage = async (storage) => {
	if (!storage) {
		storage = { status: 'normal', list: [], remove: { ping: null, count: 0 } }
	}
	await setStorage('self-ping-info', storage)
}
export const getPingsStorage = async () => {
	let storage = await getStorage('self-ping-info');
	return storage || { status: 'normal', list: [], remove: { ping: null, count: 0 } };
}

// 删除登录人的全部沸点
export const removeSelfAllPings = async () => {
	if (!(await getSelfInfoStorage())) return;
	let storage = await getPingsStorage()
	if (storage.status !== 'normal') return;
	storage.status = 'removing';
	await setPingsStorage(storage)
	for (let ping of storage.list) {
		await notifyAllTabMessage();
		// 正在删除
		storage.remove.ping = ping;
		storage.remove.count++;
		// 先保存到里面
		await setPingsStorage(storage)
		let success = await removePing(ping);
		if (!success) break;
		await sleep(1);
	}
	await setPingsStorage(storage)
	await resetSelfPings();
}

// 删除单个沸点
export const removePing = async (ping) => {
	let cookie = await getCookie();
	let url = `https://api.juejin.cn/content_api/v1/short_msg/delete`;
	let res = fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', Cookie: cookie },
		body: JSON.stringify({ msg_id: ping.msg_id })
	}).then(res => res.json());
	let { success } = handleApiResult(res);
	return success
}

export const notifyAllTabMessage = async () => {
	let self = await getSelfInfoStorage();
	if (!self) return;
	let storage = await getPingsStorage();
	let pingsTabs = await chrome.tabs.query({ url: `https://juejin.cn/user/${self.user_basic.user_id}/pins` });
	pingsTabs.forEach(tab => {
		chrome.tabs.sendMessage(tab.id, { from: 'background', event: 'ping-info-change', data: storage });
	})
}

export const pageUpdateComplete = async (page) => {
	let self = await getSelfInfoStorage();
	if (!self || page.url !== `https://juejin.cn/user/${self.user_basic.user_id}/pins`) return;
	let store = await getPingsStorage();
	if (store.status === 'normal') {
		await resetSelfPings();
	}
}

// 重置登录人的沸点信息
export const resetSelfPings = async () => {
	let self = await getSelfInfoStorage();
	if (!self) return;
	let pings = await getUserPings(self.user_basic.user_id);
	await setPingsStorage({
		status: 'normal',
		list: pings,
		remove: { ping: null, count: 0 }
	})
	await notifyAllTabMessage();
}

// 获取用户的全部沸点
export const getUserPings = async (userId) => {
	let url = `https://api.juejin.cn/content_api/v1/short_msg/query_list`;
	let res = await fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ cursor: '0', user_id: userId, sort_type: 4, limit: 999 })
	}).then(res => res.json());
	let { success, data } = handleApiResult(res);
	return success ? (data || []) : []
}

// 获取圈子详情
export const getPingClubInfo = async (clubId) => {
	let nowTime = new Date().getTime();
	let storage = await getStorage(`pinclub-info-${clubId}`);
	// 一周
	if (storage && (nowTime - storage.time) < (10 * 1000 * 60 * 6 * 24 * 7)) return storage.info;
	storage = { time: nowTime, info: null }
	let cookie = await getCookie();
	let res = await fetch('https://api.juejin.cn/tag_api/v1/query_topic_detail', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', Cookie: cookie },
		body: JSON.stringify({ topic_id: clubId })
	}).then(res => res.json());
	let { success, data } = handleApiResult(res);
	if (!success) return storage.info;
	storage.info = data;
	await setStorage(`pinclub-info-${clubId}`, storage);
	return storage.info;
}

// 获取某个圈子下面沸点的活跃用户榜单
// 十分钟内不重新调用接口
export const getPinClubHotRank = async (clubId) => {
	let nowTime = new Date().getTime();
	let storage = await getStorage(`pinclub-hot-rank-${clubId}`);
	// 十分钟
	if (storage && (nowTime - storage.time) < (10 * 1000 * 60) && storage.club) return storage;
	storage = { time: nowTime, rank: [], club: null }
	// 获取数据
	let cookie = await getCookie();
	let res = await fetch('https://api.juejin.cn/recommend_api/v1/short_msg/topic', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', Cookie: cookie },
		body: JSON.stringify({ topic_id: clubId, cursor: '0', id_type: 4, limit: 1000, sort_type: 500 })
	}).then(res => res.json());
	let { success, data } = handleApiResult(res);
	if (!success) return storage;
	let userMap = {};
	let targetTime = getCurrentWeekFirstTime();
	for (let msg of data) {
		if (msg.msg_Info.ctime * 1000 < targetTime) break;
		let { user_id } = msg.msg_Info;
		userMap[user_id] ? userMap[user_id].push(msg) : userMap[user_id] = [msg]
	}
	let users = [];
	for (let userId in userMap) {
		users.push({ userId, msgs: userMap[userId] })
	}
	users.sort((a, b) => b.msgs.length - a.msgs.length);
	let rank = [];
	let userIds = [];
	for (let user of users) {
		if (!rank.length) {
			userIds.push(user.userId)
			rank.push({ msgCount: user.msgs.length, users: [user] })
		} else {
			let { msgCount, users } = rank[rank.length - 1];
			if (user.msgs.length === msgCount) {
				userIds.push(user.userId)
				users.push(user)
			} else {
				if (rank.length < 3) {
					userIds.push(user.userId)
					rank.push({ msgCount: user.msgs.length, users: [user] })
				} else {
					break
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
		})
	})
	storage.rank = rank;
	storage.club = await getPingClubInfo(clubId);
	// 存储数据
	await setStorage(`pinclub-hot-rank-${clubId}`, storage);
	return storage
}

// 初始化pin个相关的
export const initPings = async () => {
	await resetSelfPings();
}

// 沸点相关
import { getShortMsgList, removeShortMsg, getRandomText as apiGetRandomText } from "../api/content";
import { queryTopicDetail } from "../api/tag";
import { getTopicShortMsgList } from "../api/recommend";
import { getStorage, setStorage } from "../chrome";
import { getUserInfo } from "./user";
import { dayjs, sleep, uuid } from "../../../tool";
import { cancelDigg, diggQueryPage } from "../api/interact";

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
	return await removeShortMsg(pin.msg_id);
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
* 获取圈子当日废物榜
* @param clubId 圈子id
* @param isRefresh 是否需要更新缓存
* */
export const getPinClubDayUserRank = async ({ clubId, isRefresh }) => {
	let storageKey = `pin-club-day-user-rank-${clubId}`;
	let storage = await getStorage(storageKey);
	if (storage && !isRefresh) return storage;
	storage = { time: dayjs().format('YYYY-MM-DD HH:mm:ss'), rank: [] };
	let topicList = [];
	for (let i = 0; i < 10; i++) {
		let { success, data } = await getTopicShortMsgList({ topic_id: clubId, limit: 100, cursor: 100 * i })
		await sleep(0.5)
		if (!success) break;
		let next = true;
		for (let msg of data) {
			if (msg.msg_Info.ctime * 1000 < dayjs().startOf('day').valueOf()) {
				next = false;
				break;
			} else {
				topicList.push(msg)
			}
		}
		if (!next) break;
	}
	let userMsgMap = {};
	let userInfoMap = {};
	for (let msg of topicList) {
		let { user_id } = msg.msg_Info;
		userMsgMap[user_id] ? userMsgMap[user_id].push(msg) : userMsgMap[user_id] = [msg];
		userInfoMap[user_id] = msg.author_user_info;
	}
	let users = [];
	for (let userId in userMsgMap) {
		users.push({ userId, userInfo: userInfoMap[userId], msgCount: userMsgMap[userId].length });
	}
	users.sort((a, b) => b.msgCount - a.msgCount);
	let rank = [];
	for (let user of users) {
		if (!rank.length) {
			rank.push({ msgCount: user.msgCount, users: [user] });
		} else {
			let { msgCount, users } = rank[rank.length - 1];
			if (user.msgCount === msgCount) {
				users.push(user);
			} else {
				if (rank.length < 3) {
					rank.push({ msgCount: user.msgCount, users: [user] });
				} else {
					break;
				}
			}
		}
	}
	storage.rank = rank;
	let endTime = (dayjs().endOf('day').valueOf() - dayjs().valueOf()) / 1000 / 60;
	await setStorage(storageKey, storage, endTime);
	return storage
}


/*
* 获取随机文本
* */
export const getRandomText = async () => {
	let res = await fetch(
		`https://www.mxnzp.com/api/holiday/single/${dayjs().format('YYYYMMDD')}?ignoreHoliday=false&app_id=nhhhdemgpmhixsnv&app_secret=Y296dDlVdVVhRnhucmJmUnhvRVY2UT09`,
		{
			credentials: "include",
			method: "GET",
			crossorigin: true,
		}).then(res => res.json())
	if (res.code !== 1) return { success: false, data: '', err_msg: res.msg };
	let weekdayTranslateMap = { 1: "周一", 2: "周二", 3: "周三", 4: "周四", 5: "周五", 6: "周六", 7: "周日" };
	let todayInfo = res.data;
	let todayStr =
		`${todayInfo.date}｜${weekdayTranslateMap[todayInfo.weekDay]}｜${todayInfo.typeDes}｜阴历: ${todayInfo.lunarCalendar}\n宜: ${todayInfo.suit}\n忌: ${todayInfo.avoid}`;
	await sleep(1);
	res = await fetch('https://www.mxnzp.com/api/daily_word/recommend?count=1&app_id=nhhhdemgpmhixsnv&app_secret=Y296dDlVdVVhRnhucmJmUnhvRVY2UT09', {
		credentials: "include",
		method: "GET",
		crossorigin: true,
	}).then(res => res.json());
	if (res.code !== 1) return { success: false, data: '', err_msg: res.msg };
	let textStr = res.data?.[0].content || "就不给你看~~";
	let resStr = textStr + '\n\n' + todayStr;
	return { success: true, data: resStr, err_msg: '' };
}
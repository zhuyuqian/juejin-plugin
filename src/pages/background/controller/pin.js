// 沸点相关
import { getShortMsgList, removeShortMsg } from "../../../api/content";
import { queryTopicDetail } from "../../../api/tag";
import { getTopicShortMsgList } from "../../../api/recommend";
import { getStorage, sendBasicNotifications, setStorage } from "../chrome";
import { getUserInfo } from "./user";
import { dayjs, uuid } from "../../../tool";
import { cancelDigg, diggQueryPage } from "../../../api/interact";
import { handleApiResult } from "../../../api";

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
* @param clubId 圈子id
* @param isRefresh 是否需要更新缓存
* */
export const getPinClubWeekUserRank = async ({ clubId, isRefresh }) => {
	let storageKey = `pin-club-week-user-rank-${clubId}`;
	let storage = await getStorage(storageKey);
	if (storage && !isRefresh) return storage;
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
	await setStorage(storageKey, storage);
	return storage
}


/**
 * 随机发个沸点
 */
export const sendARandomPin = async () => {
	let todayText = dayjs(new Date()).format("YYYYMMDD");

	let todayInfosResp = await fetch(
		`https://www.mxnzp.com/api/holiday/single/${todayText}?ignoreHoliday=false&app_id=nhhhdemgpmhixsnv&app_secret=Y296dDlVdVVhRnhucmJmUnhvRVY2UT09`,
		{
			credentials: "include",
			method: "GET",
			crossorigin: true,
		}
	);

	let todayInfosBodyJson = await todayInfosResp.json();
	let todayInfoRes = todayInfosBodyJson?.data || {};
	let weekdayTranslateMap = { 1: "周一", 2: "周二", 3: "周三", 4: "周四", 5: "周五", 6: "周六", 7: "周日" };
	let todayInfos = `今日为${weekdayTranslateMap[todayInfoRes.weekDay] + " " + todayInfoRes.typeDes}, 阴历: ${todayInfoRes.lunarCalendar}, 
  	宜: ${todayInfoRes.suit}, 忌: ${todayInfoRes.avoid}`;

	const getWellKnownWords = () => {
		return new Promise((resolve, reject) => {
			///加个延时, 防止接口并发超了
			setTimeout(() => {
				fetch(
					"https://www.mxnzp.com/api/daily_word/recommend?count=1&app_id=nhhhdemgpmhixsnv&app_secret=Y296dDlVdVVhRnhucmJmUnhvRVY2UT09",
					{
						credentials: "include",
						method: "GET",
						crossorigin: true,
					}
				).then((wellKnownWordResp) => {
					wellKnownWordResp.json().then((wellKnownWordBodyJson) => {
						let wellKnownWords = wellKnownWordBodyJson?.data?.[0].content || "就不给你看~~";
						resolve(wellKnownWords);
					});
				});
			}, 3000);
		});
	};

	let wellKnownWords = await getWellKnownWords();
	let pinContent = wellKnownWords + "\n\n" + todayInfos;

	/// topic id默认指向 '摸鱼一下' 话题
	let topicId = window.location.pathname.match(/\d+/g)?.[0] || '6824710203301167112';
	let res = await fetch(
		`https://api.juejin.cn/content_api/v1/short_msg/publish?aid=2608&uuid=${uuid()}&spider=0`,
		{
			credentials: "include",
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				content: pinContent,
				sync_to_org: false,
				topic_id: topicId,
			}),
		}
	).then((res) => res.json());

//   let { success, data, err_msg } = handleApiResult(res);
//   sendBasicNotifications("发个沸点：" + (success ? "成功" : "失败"), "^_^");
};
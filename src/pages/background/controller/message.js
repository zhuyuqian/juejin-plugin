// 消息相关

import { getSelfStorage, getYearDynamic } from "./user";
import { getPinClubInfo, getUserPins, removePin, getPinClubWeekUserRank, getUserZanPins, cancelZanPin } from "./pin";

// 事件处理map
const eventHandleMap = {
	'get-self-info': () => getSelfStorage(),	// 获取个人信息
	'get-user-pins': (userId) => getUserPins(userId), // 获取用户沸点列表
	'remove-pin': (pin) => removePin(pin), // 删除沸点
	'get-pin-club-info': (clubId) => getPinClubInfo(clubId),	// 获取沸点圈子详情
	'get-pin-club-week-user-rank': (clubId) => getPinClubWeekUserRank(clubId), //获取圈子一周废物榜
	'get-user-zan-pins': (userId) => getUserZanPins(userId), // 获取用户点赞列表
	'cancel-zan-pin': (pin) => cancelZanPin(pin), // 取消沸点点赞
	'get-year-dynamic': (userId) => getYearDynamic(userId)
}

const handleOnMessage = async (event, data, callback) => {
	callback(await eventHandleMap[event](data));
}

/*
* 当页面发来了消息
* */
export const runtimeOnMessage = (request, sender, sendResponse) => {
	let { to, event, data } = request;
	if (to !== 'background') return;
	handleOnMessage(event, data, sendResponse)
	return true
}
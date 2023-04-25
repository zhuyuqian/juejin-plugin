// 消息相关

import { getSelfStorage, getYearDynamic } from "./user";
import {
	getPinClubInfo,
	getUserPins,
	removePin,
	getPinClubDayUserRank,
	getUserZanPins,
	cancelZanPin,
	getRandomText
} from "./pin";

// 事件处理map
const eventHandleMap = {
	'get-self-info': () => getSelfStorage(),	// 获取个人信息
	'get-user-pins': (data) => getUserPins(data), // 获取用户沸点列表
	'remove-pin': (data) => removePin(data), // 删除沸点
	'get-pin-club-info': (data) => getPinClubInfo(data),	// 获取沸点圈子详情
	'get-pin-club-day-user-rank': (data) => getPinClubDayUserRank(data), //获取圈子一周废物榜
	'get-user-zan-pins': (data) => getUserZanPins(data), // 获取用户点赞列表
	'cancel-zan-pin': (data) => cancelZanPin(data), // 取消沸点点赞
	'get-year-dynamic': (data) => getYearDynamic(data), // 获取年度动态
	'get-random-text': () => getRandomText()
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
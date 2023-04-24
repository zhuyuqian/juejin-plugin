// 用户相关
import {
	checkIn,
	collectBug,
	drawLottery,
	getLotteryConfig,
	getNotCollectBug, getSelfInfo,
	logout as apiLogout,
	getUserInfo as apiGetUserInfo, getDynamic,
} from "../api/user";
import { getStorage, queryTabs, sendBasicNotifications, setStorage, updateTab } from "../chrome";
import { resetContextMenus } from "./contextMenus";
import { getNotReadMessageCount } from "../api/message";
import { dayjs } from "../../../tool";

/*
* 获取登录用户缓存
* */
export const getSelfStorage = async () => {
	return await getStorage('self-info')
}

/*
* 设置登录用户缓存
* */
export const setSelfStorage = async (storage) => {
	await setStorage('self-info', storage)
}

/*重置用户信息*/
export const resetSelf = async () => {
	let { success, data } = await getSelfInfo();
	if (!success) return setSelfStorage(null);
	await setSelfStorage(data);
	return data
}

/*
* 获取用户信息
* 缓存7天
* */
export const getUserInfo = async (userId) => {
	let storageKey = `user-info-${userId}`
	let storage = await getStorage(storageKey);
	if (storage) return storage;
	let { success, data } = await apiGetUserInfo(userId);
	if (!success) return null;
	await setStorage(storageKey, data, 60 * 24 * 7);
	return data;
}

/*
* 获取年度用户动态列表
* @param userId 用户id
* @param isRefresh 是否获取最新，如果为否永远获取缓存
* */
export const getYearDynamic = async ({ userId, isRefresh }) => {
	let storageKey = `year-dynamic-${userId}`;
	// 获取缓存
	let storage = await getStorage(storageKey);
	if (storage && !isRefresh) return storage;
	storage = { count: 0, time: dayjs().format('YYYY-MM-DD HH:mm:ss'), info: {} };
	// 先获取总数
	let { success, data } = await getDynamic(userId, 0);
	if (!success) return storage
	// count是动态总数
	let { count, list } = data;
	storage.count = count;
	let dynamics = [...list];
	// 每份20个
	let cursors = new Array(Math.ceil(count / 20)).fill(null).map((item, index) => 20 * index);
	// 第一个已经获取过，移除
	cursors.shift();
	// 取出前30个
	cursors = cursors.splice(0, 20);
	// 开始并发请求
	let dynamicsRes = await Promise.all(cursors.map(cursor => getDynamic(userId, cursor)));
	dynamicsRes.forEach(dynamicRes => {
		if (dynamicRes.success) {
			dynamics.push(...dynamicRes.data.list);
		}
	})
	// 开始处理数据
	for (let dynamic of dynamics) {
		let year = dayjs(dynamic.time * 1000).format('YYYY')
		let date = dayjs(dynamic.time * 1000).format('MM-DD');
		if (storage.info[year]) {
			if (storage.info[year][date]) {
				storage.info[year][date].push(dynamic.action)
			} else {
				storage.info[year][date] = [dynamic.action]
			}
		} else {
			storage.info[year] = { [date]: [dynamic.action] }
		}
	}
	await setStorage(storageKey, storage);
	return storage;
}

/*
* 开始循环获取未读消息数
* */
export const loopNotReadMessageCount = () => {
	setInterval(async () => {
		if (await getSelfStorage()) {
			let { success, data } = await getNotReadMessageCount();
			if (!success) return;
			// count[1]：点赞和收藏  count[3]：评论
			let { count, total } = data;
			let items = [];
			if (count[1]) items.push(`点赞和收藏：${count[1]}条`);
			if (count[3]) items.push(`评论：${count[3]}条`);
			let notReadStrStorage = await getStorage("message-not-read");
			// 有未读且详情文字不相同
			if (total && notReadStrStorage !== JSON.stringify(items)) {
				sendBasicNotifications(`您有${total}条掘金未读消息，以下为详细内容`, `${items.join('\n')}`);
			}
			await setStorage("message-not-read", JSON.stringify(items));
		}
	}, 1000 * 10)
}

/*
* 用户登出
* 登出后刷新所有相关页面
* */
export const logout = async () => {
	apiLogout();
	// 获取所有掘金相关页面
	let tabs = await queryTabs({ url: 'https://juejin.cn/*' });
	// 将登录用户缓存清空
	await setSelfStorage(null);
	// 重置菜单
	await resetContextMenus();
	// 刷新页面
	for (let tab of tabs) {
		updateTab(tab.id, { url: tab.url });
	}
}

/*
* 用户签到
* */
export const signin = async () => {
	let { success, data, err_msg } = await checkIn();
	sendBasicNotifications("掘金签到：" + (success ? "成功" : "失败"), success ? `本次新增矿石：${data.incr_point}，当前矿石：${data.sum_point}` : err_msg)
}

/*
* 修复bug
* */
export const bugfix = async () => {
	// 获取未修复bug
	let { success, data, err_msg } = await getNotCollectBug();
	sendBasicNotifications("掘金BugFix：" + (success ? "成功" : "失败"), success ? `今日掘金bugfix：${data.length}` : err_msg)
	if (!success) return;
	// 开始修复bug
	data.forEach(bug => collectBug(bug))
}

/*
* 抽奖
* */
export const freeLucky = async () => {
	// 获取今日免费抽奖次数
	let res = await getLotteryConfig()
	if (!res.success) return sendBasicNotifications('今日免费抽奖失败', res.err_msg);
	if (!res.data.free_count) return sendBasicNotifications('今日免费抽奖失败', '今日免费抽奖次数已经用完');
	// 开始抽奖
	res = await drawLottery()
	if (!res.success) return sendBasicNotifications('今日免费抽奖失败', res.err_msg);
	sendBasicNotifications('今日免费抽奖成功', `恭喜抽到：${res.data.lottery_name}`);
}
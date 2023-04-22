import { resetContextMenus } from "./contextMenus";
import { handleApiResult, getAllJueJinTabs, sleep } from "./tool";
import { getStorage, setStorage } from "./storage";
import { sendBasicNotifications } from "./message";

// 获取个人信息缓存
export const getSelfInfoStorage = async () => {
	return await getStorage("juejin-self");
};

// 设置个人信息缓存
export const setSelfInfoStorage = async (selfInfo) => {
	await setStorage("juejin-self", selfInfo);
};

// 登出
export const logout = async () => {
	await fetch("https://juejin.cn/passport/web/logout/", {
		credentials: 'include',
	});
	// 取出所有打开的掘金tab
	let tabs = await getAllJueJinTabs();
	for (let tab of tabs) {   // 刷新当前页
		await chrome.tabs.update(tab.id, { url: tab.url });
	}
	await setSelfInfoStorage(null);
	await resetContextMenus();
};

/*
* 获取用户信息
* 传入用户id
* 缓存1天
* */
export const getUserInfo = async (userId) => {
	let nowTime = new Date().getTime();
	let storage = await getStorage(`userinfo-${userId}`);
	if (storage && (nowTime - storage.time) < (1000 * 60 * 60 * 24)) return storage.info;
	storage = { time: nowTime, info: null }
	let res = await fetch(`https://api.juejin.cn/user_api/v1/user/get?user_id=${userId}`, {
		credentials: 'include',
	}).then(res => res.json());
	let { success, data } = handleApiResult(res);
	if (!success) return storage.info;
	storage.info = data;
	await setStorage(`userinfo-${userId}`, storage);
	return storage.info;
};

// 更新登录人信息
export const resetSelfInfo = async () => {
	let res = await fetch("https://api.juejin.cn/user_api/v1/user/get_info_pack",
		{
			credentials: 'include',
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ "pack_req": { "user_counter": true, "user_growth_info": true, "user": true } })
		}).then(res => res.json());
	let { data: userInfo } = handleApiResult(res);
	if (!userInfo) return await setSelfInfoStorage(null);
	await setSelfInfoStorage(userInfo);
	return userInfo;
};

// 签到
export const signin = async () => {
	let res = await fetch("https://api.juejin.cn/growth_api/v1/check_in", {
		credentials: 'include',
		method: "POST"
	}).then(res => res.json());
	let { success, data, err_msg } = handleApiResult(res);
	sendBasicNotifications("掘金签到：" + (success ? "成功" : "失败"), success ? `本次新增矿石：${data.incr_point}，当前矿石：${data.sum_point}` : err_msg)
};

// 收集bug
export const bugfix = async () => {
	let res = await fetch("https://api.juejin.cn/user_api/v1/bugfix/not_collect", {
		credentials: 'include',
		method: "POST"
	}).then(res => res.json());
	let { success, data, err_msg } = handleApiResult(res);
	sendBasicNotifications("掘金BugFix：" + (success ? "成功" : "失败"), success ? `今日掘金bugfix：${data.length}` : err_msg)
	if (!success) return;
	data.forEach(bug => {
		fetch("https://api.juejin.cn/user_api/v1/bugfix/collect", {
			credentials: 'include',
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(bug)
		});
	});
};

// 免费抽奖
export const freeLuckyDraw = async () => {
	let res = await fetch('https://api.juejin.cn/growth_api/v1/lottery_config/get', {
		credentials: 'include',
	}).then(res => res.json());
	res = handleApiResult(res);
	if (!res.success) return sendBasicNotifications('今日免费抽奖失败', res.err_msg);
	if (!res.data.free_count) return sendBasicNotifications('今日免费抽奖失败', '今日免费抽奖次数已经用完');
	res = await fetch('https://api.juejin.cn/growth_api/v1/lottery/draw', {
		credentials: 'include',
		method: 'POST'
	}).then(res => res.json());
	res = handleApiResult(res);
	if (!res.success) return sendBasicNotifications('今日免费抽奖失败', res.err_msg);
	sendBasicNotifications('今日免费抽奖成功', `恭喜抽到：${res.data.lottery_name}`);
}

// 获取未读消息数
export const loopMessageNotReadCount = async () => {
	if (await getSelfInfoStorage()) {
		let res = await fetch("https://api.juejin.cn/interact_api/v1/message/count", {
			credentials: 'include',
		}).then(res => res.json());
		let { success, data } = handleApiResult(res);
		if (success) {
			// count[1]：点赞和收藏  count[3]：评论
			let { count, total } = data;
			let items = [];
			if (count[1]) items.push(`点赞和收藏：${count[1]}条`)
			if (count[3]) items.push(`评论：${count[3]}条`)
			let notReadStrStorage = await getStorage("message-not-read");
			// 有未读且详情文字不相同
			if (total && notReadStrStorage !== JSON.stringify(items)) {
				sendBasicNotifications(`您有${total}条掘金未读消息，以下为详细内容`, `${items.join('\n')}`);
				await setStorage("message-not-read", JSON.stringify(items));
			}
		}
	}
	setTimeout(() => {
		loopMessageNotReadCount();
	}, 10 * 1000)
};

export const initAuth = async () => {
	await resetSelfInfo();
	await loopMessageNotReadCount()
};

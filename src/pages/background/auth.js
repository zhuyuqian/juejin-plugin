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

// 获取未读消息数
export const loopMessageNotReadCount = async () => {
	if (await getSelfInfoStorage()) {
		let res = await fetch("https://api.juejin.cn/interact_api/v1/message/count", {
			credentials: 'include',
		}).then(res => res.json());
		let { success, data } = handleApiResult(res);
		if (success) {
			// count[1]：点赞和收藏
			let { count, total } = data;
			let countStorage = await getStorage("message-not-read-count");
			// 有未读
			if (total && total !== countStorage) {
				sendBasicNotifications("掘金未读消息通知", `您有${total}条新消息，快去掘金查看吧`)
			}
			await setStorage("message-not-read-count", total);
		}
	}
	await sleep(10);
	loopMessageNotReadCount();
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

// 获取用户信息
export const getUserInfo = async (userId) => {
	let res = await fetch(`https://api.juejin.cn/user_api/v1/user/get?user_id=${userId}`, {
		credentials: 'include',
	}).then(res => res.json());
	let { success, data } = handleApiResult(res);
	return success ? data : null;
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

export const initAuth = async () => {
	await resetSelfInfo();
	loopMessageNotReadCount();
};

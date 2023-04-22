import { getSelfInfoStorage, logout, signin, bugfix, freeLuckyDraw } from "./auth";

export const initContentMenus = async () => {
	await resetContextMenus();
};


let resetContextMenusIng = false;

export const resetContextMenus = async () => {
	if (resetContextMenusIng) return;
	resetContextMenusIng = true;
	// 移除所有菜单先
	await chrome.contextMenus.removeAll();
	// 获取用户信息
	let self = await getSelfInfoStorage();
	// 已登录
	if (self) {
		await chrome.contextMenus.create({
			id: "MENU_PARENT",
			title: `${self.user_basic.user_name}的掘金`,
			contexts: ["all"]
		});
		await chrome.contextMenus.create({
			id: "SELF_HOME",
			title: "我的主页",
			parentId: "MENU_PARENT",
			contexts: ["all"]
		});
		await chrome.contextMenus.create({
			id: "SELF_NOTIFICATION",
			title: "我的消息",
			parentId: "MENU_PARENT",
			contexts: ["all"]
		});
		await chrome.contextMenus.create({
			id: "separator1",
			type: "separator",
			parentId: "MENU_PARENT",
			contexts: ["all"]
		});
		await chrome.contextMenus.create({ id: "SIGN_IN", title: "快速签到", parentId: "MENU_PARENT", contexts: ["all"] });
		await chrome.contextMenus.create({ id: "BUG_FIX", title: "收集BUG", parentId: "MENU_PARENT", contexts: ["all"] });
		await chrome.contextMenus.create({
			id: 'FREE_LUCKY_DRAW',
			title: "免费抽奖",
			parentId: "MENU_PARENT",
			contexts: ["all"]
		})
		await chrome.contextMenus.create({
			id: "separator2",
			type: "separator",
			parentId: "MENU_PARENT",
			contexts: ["all"]
		});
		await chrome.contextMenus.create({ id: "LOGOUT", title: "登出", parentId: "MENU_PARENT", contexts: ["all"] });
	} else {
		await chrome.contextMenus.create({ id: "OPEN_JUEJIN", type: "normal", title: `掘金首页`, contexts: ["all"] });
	}
	resetContextMenusIng = false;
};

export const onClick = async (info, tab) => {
	let self = await getSelfInfoStorage();
	let { windowId } = tab;
	let { menuItemId } = info;
	if (menuItemId === "OPEN_JUEJIN") { // 打开掘金
		await chrome.tabs.create({ url: `https://juejin.cn/`, selected: true, windowId });
	}
	if (menuItemId === "SELF_HOME") { // 我的主页
		await chrome.tabs.create({
			url: `https://juejin.cn/user/${self.user_basic.user_id}`,
			selected: true,
			windowId
		});
	}
	if (menuItemId === "SELF_NOTIFICATION") { // 我的消息
		await chrome.tabs.create({ url: `https://juejin.cn/notification`, selected: true, windowId });
	}
	if (menuItemId === "LOGOUT") { // 登出
		await logout();
	}
	if (menuItemId === "SIGN_IN") { // 签到
		await signin();
	}
	if (menuItemId === "BUG_FIX") { // 收集bug
		await bugfix();
	}
	if (menuItemId === 'FREE_LUCKY_DRAW') { // 免费抽奖
		await freeLuckyDraw()
	}
};
import { getSelfStorage, logout, signin, bugfix, freeLucky } from "./user";
import { createContextMenu, createTab, removeAllContextMenus } from "../chrome";


let resetContextMenusIng = false;

/*
* 重置所有右键菜单
* */
export const resetContextMenus = async () => {
	if (resetContextMenusIng) return;
	resetContextMenusIng = true;
	// 移除所有菜单
	await removeAllContextMenus()
	// 获取用户信息
	let user = await getSelfStorage();
	// 已登录
	if (user) {
		await createContextMenu({ id: "MENU_PARENT", title: `${user.user_basic.user_name}的掘金`, contexts: ["all"] })
		await createContextMenu({ id: "SELF_HOME", title: "我的主页", parentId: "MENU_PARENT", contexts: ["all"] })
		await createContextMenu({ id: "SELF_NOTIFICATION", title: "我的消息", parentId: "MENU_PARENT", contexts: ["all"] })
		await createContextMenu({ id: "separator1", type: "separator", parentId: "MENU_PARENT", contexts: ["all"] })
		await createContextMenu({ id: "SIGN_IN", title: "快速签到", parentId: "MENU_PARENT", contexts: ["all"] });
		// await createContextMenu({ id: "BUG_FIX", title: "收集BUG", parentId: "MENU_PARENT", contexts: ["all"] });
		await createContextMenu({ id: 'FREE_LUCKY_DRAW', title: "免费抽奖", parentId: "MENU_PARENT", contexts: ["all"] })
		await createContextMenu({ id: "separator2", type: "separator", parentId: "MENU_PARENT", contexts: ["all"] });
		await createContextMenu({ id: "LOGOUT", title: "登出", parentId: "MENU_PARENT", contexts: ["all"] });
	} else {
		await createContextMenu({ id: "OPEN_JUEJIN", type: "normal", title: `掘金首页`, contexts: ["all"] });
	}
	resetContextMenusIng = false;
};

/*
*  菜单被点击
* */
export const contextMenusOnClick = async (info, tab) => {
	let user = await getSelfStorage();
	let { menuItemId } = info;
	let { windowId } = tab;
	if (menuItemId === "OPEN_JUEJIN") { // 打开掘金
		createTab({ url: `https://juejin.cn/`, selected: true, windowId })
	}
	if (menuItemId === "SELF_HOME") { // 我的主页
		await createTab({ url: `https://juejin.cn/user/${user.user_basic.user_id}`, selected: true, windowId })
	}
	if (menuItemId === "SELF_NOTIFICATION") { // 我的消息
		await createTab({ url: `https://juejin.cn/notification`, selected: true, windowId })
	}
	if (menuItemId === "LOGOUT") { // 登出
		await logout();
	}
	if (menuItemId === "SIGN_IN") { // 签到
		await signin();
	}
	// if (menuItemId === "BUG_FIX") { // fixbug
	// 	await bugfix();
	// }
	if (menuItemId === 'FREE_LUCKY_DRAW') { // 免费抽奖
		await freeLucky()
	}
};
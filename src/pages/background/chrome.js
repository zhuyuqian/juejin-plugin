import dayjs from 'dayjs';
import config from "../../config";
import { uuid } from "../../tool";

/*
* 设置缓存
* @param key 名称
* @param value 数据
* @param minute 缓存多少分钟，如果没有则永久缓存
* */
export const setStorage = async (key, value, minute) => {
	let setTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
	let overdueTime = minute !== undefined ? dayjs(setTime).add(minute, 'minute').format('YYYY-MM-DD HH:mm:ss') : null;
	let storage = { [key]: { value, setTime, overdueTime } }
	await chrome.storage.local.set(storage);
}

/*
* 获取缓存
* @param key 名称
* */
export const getStorage = async (key) => {
	let storage = (await chrome.storage.local.get())[key];
	if (!storage) return null;
	// 如果结束时间存在 && 当前时间不在结束之间之前
	if (storage.overdueTime && !dayjs().isBefore(storage.overdueTime)) return null;
	return storage.value;
}

/*
* 发送桌面通知
* @param title 标题
* @param message 内容
* */
export const sendBasicNotifications = (title, message) => {
	chrome.notifications.getPermissionLevel(level => {
		if (level === 'granted') {
			chrome.notifications.create(uuid(), {
				type: 'basic',
				title,
				message,
				iconUrl: config.iconUrl,
			})
		}
	})
}

/*
* 创建tab
* @param tab 标签信息
* */
export const createTab = (tab) => {
	return chrome.tabs.create(tab);
}

/*
* 查询tabs
* @param search 需要查询的条件
* */
export const queryTabs = (search = {}) => {
	return chrome.tabs.query(search)
}

/*
* 修改tab
* @param tabId 标签id
* @param tab 标签信息
* */
export const updateTab = (tabId, tab) => {
	return chrome.tabs.update(tabId, tab);
}

/*
* 给标签页发信息
* */
export const sendMessageToTab = (tabId, info) => {
	return chrome.tabs.sendMessage(tabId, Object.assign(info, { from: 'background' }))
}

/*
* 创建菜单
* @param menu 按钮信息
* */
export const createContextMenu = (menu) => {
	console.log(menu);
	return chrome.contextMenus.create(menu);
}

/*
* 删除全部菜单
* */
export const removeAllContextMenus = () => {
	return chrome.contextMenus.removeAll();
}
import { loopNotReadMessageCount, resetSelf } from "./user";
import { resetContextMenus } from "./contextMenus";
import { sendMessageToTab } from "../chrome";

/*
* 当标签页发生变化
* */
export const tabOnUpdate = async (tabId, changeInfo, tab) => {
	// 是否完毕
	if (changeInfo.status !== "complete") return;
	// 调用未读消息循环
	loopNotReadMessageCount();
	// 是否是掘金的标签页
	let isJueJin = tab.url.includes('juejin.cn');
	if (isJueJin) await resetSelf()
	await resetContextMenus();
	if (isJueJin) sendMessageToTab(tabId, { event: "page-change-complete" })
}
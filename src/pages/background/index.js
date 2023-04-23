import { resetSelf, loopNotReadMessageCount } from "./controller/user";
import { contextMenusOnClick, resetContextMenus } from "./controller/contextMenus";
import { tabOnUpdate } from "./controller/tabs";
import { runtimeOnMessage } from "./controller/message";

// chrome.storage.local.clear();
chrome.contextMenus.onClicked.addListener(contextMenusOnClick);
chrome.tabs.onUpdated.addListener(tabOnUpdate);
chrome.runtime.onMessage.addListener(runtimeOnMessage)

const init = async () => {
	// 重新获取用户信息
	await resetSelf()
	// 重置按钮组
	await resetContextMenus();
	// 开始循环获取未读消息数量
	loopNotReadMessageCount();
};

init();

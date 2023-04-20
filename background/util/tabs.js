import {resetContextMenus} from "./contextMenus.js";
import {pageUpdateComplete} from "./pings.js";

export const onActivatedAndRemoved = async () => {
    await resetContextMenus()
}

export const onUpdated = async (tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url.includes('juejin.cn')) { // 加载完成
        await pageUpdateComplete(tab);
        await chrome.tabs.sendMessage(tab.id, {from: 'background', event: 'page-change-complete'});
    }
}
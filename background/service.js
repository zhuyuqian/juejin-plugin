import { initAuth } from "./util/auth.js";
import { initContentMenus, onClick } from "./util/contextMenus.js";
import { onMessage } from "./util/message.js";
import { onUpdated } from "./util/tabs.js";


chrome.contextMenus.onClicked.addListener(onClick);
chrome.runtime.onMessage.addListener(onMessage);
chrome.tabs.onUpdated.addListener(onUpdated)

const init = async () => {
	await initAuth();
	await initContentMenus();
}

init();

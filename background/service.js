import {initAuth} from "./util/auth.js";
import {initPings} from "./util/pings.js";
import {initContentMenus, onClick} from "./util/contextMenus.js";
import {onMessage} from "./util/message.js";
import {onActivatedAndRemoved, onUpdated} from "./util/tabs.js";


chrome.contextMenus.onClicked.addListener(onClick);
chrome.runtime.onMessage.addListener(onMessage);
chrome.tabs.onActivated.addListener(onActivatedAndRemoved);
chrome.tabs.onRemoved.addListener(onActivatedAndRemoved);
chrome.tabs.onUpdated.addListener(onUpdated)

const init = async () => {
    await initAuth();
    await initPings();
    await initContentMenus();
}

init();

import { initAuth } from "./auth.js";
import { initContentMenus, onClick } from "./contextMenus.js";
import { onUpdated } from "./tabs.js";


chrome.contextMenus.onClicked.addListener(onClick);
chrome.tabs.onUpdated.addListener(onUpdated);

const init = async () => {
  await initAuth();
  await initContentMenus();
};

init();

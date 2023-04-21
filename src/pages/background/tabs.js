import { resetContextMenus } from "./contextMenus";
import { resetSelfInfo } from "./auth";
import { isJueJinByTab } from "./tool";

export const onUpdated = async (tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete") return;
  let isJueJin = isJueJinByTab(tab);
  if (isJueJin) await resetSelfInfo();
  await resetContextMenus();
  if (isJueJin) await chrome.tabs.sendMessage(tab.id, { from: "background", event: "page-change-complete" });
};

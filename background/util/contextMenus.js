import {getSelfInfo} from "./storage.js";
import {logout} from "./auth.js";

export const initContentMenus = async () => {
    await resetContextMenus();
}


let resetContextMenusIng = false;

export const resetContextMenus = async () => {
    if (resetContextMenusIng) return;
    resetContextMenusIng = true
    // 移除所有菜单先
    await chrome.contextMenus.removeAll();
    // 获取用户信息
    let userInfo = await getSelfInfo()
    // 未登录
    if (!userInfo) {
        await chrome.contextMenus.create({id: 'OPEN_JUEJIN', title: `打开掘金`, contexts: ['page']});
    } else {
        // 已登录
        await chrome.contextMenus.create({
            id: 'MENU_PARENT',
            title: `${userInfo.user_basic.user_name}的掘金`,
            contexts: ['page']
        });
        await chrome.contextMenus.create({id: 'SELF_HOME', title: '我的主页', parentId: 'MENU_PARENT'})
        await chrome.contextMenus.create({id: 'SELF_NOTIFICATION', title: '我的消息', parentId: 'MENU_PARENT'})
        await chrome.contextMenus.create({id: 'LOGOUT', title: '登出', parentId: 'MENU_PARENT'})
    }
    resetContextMenusIng = false;
}

export const onClick = async (info, tab) => {
    let userInfo = await getSelfInfo();
    let {windowId} = tab;
    let {menuItemId} = info;
    if (menuItemId === 'OPEN_JUEJIN') { // 打开掘金
        await chrome.tabs.create({url: `https://juejin.cn/`, selected: true, windowId})
    }
    if (menuItemId === 'SELF_HOME') { // 我的主页
        await chrome.tabs.create({
            url: `https://juejin.cn/user/${userInfo.user_basic.user_id}`,
            selected: true,
            windowId
        });
    }
    if (menuItemId === 'SELF_NOTIFICATION') { // 我的消息
        await chrome.tabs.create({url: `https://juejin.cn/notification`, selected: true, windowId})
    }
    if (menuItemId === 'LOGOUT') { // 登出
        await logout();
    }
}
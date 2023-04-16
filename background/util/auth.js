import {resetContextMenus} from "./contextMenus.js";
import {getCookie, handleApiResult, getAllJueJinTabs} from "./tool.js";
import {setSelfInfo} from "./storage.js";

export const initAuth = async () => {
    await resetSelfInfo();
}

// 登出
export const logout = async () => {
    let cookie = await getCookie();
    await fetch('https://juejin.cn/passport/web/logout/', {
        headers: {Cookie: cookie}
    })
    // 取出所有打开的掘金tab
    let tabs = await getAllJueJinTabs();
    for (let tab of tabs) {   // 刷新当前页
        await chrome.tabs.update(tab.id, {url: tab.url});
    }
    await setSelfInfo(null);
    await resetContextMenus();
}

// 更新登录人信息
export const resetSelfInfo = async () => {
    let cookie = await getCookie()
    let data = await fetch('https://api.juejin.cn/user_api/v1/user/get_info_pack',
        {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Cookie': cookie},
            body: JSON.stringify({"pack_req": {"user_counter": true, "user_growth_info": true, "user": true}})
        }).then(res => res.json());
    let {data: userInfo} = handleApiResult(data);
    if (!userInfo) return await setSelfInfo(null)
    await setSelfInfo(userInfo);
    return userInfo;
}
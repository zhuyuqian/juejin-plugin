import {resetContextMenus} from "./contextMenus.js";
import {getCookie, handleApiResult, getAllJueJinTabs, uuid} from "./tool.js";
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

// 签到
export const signin = async () => {
    let cookie = await getCookie();
    let res = await fetch('https://api.juejin.cn/growth_api/v1/check_in', {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Cookie': cookie},
    }).then(res => res.json());
    let {success, data, err_msg} = handleApiResult(res);
    await chrome.notifications.create(uuid(), {
        type: 'basic',
        title: '掘金签到结果',
        message: success ? '成功' : '失败',
        contextMessage: success ? `本次新增矿石：${data.incr_point}，当前矿石：${data.sum_point}` : err_msg,
        iconUrl: '/icons/logo.png'
    });
}
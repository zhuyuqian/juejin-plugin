import { resetContextMenus } from "./contextMenus.js";
import { getCookie, handleApiResult, getAllJueJinTabs, uuid, sleep } from "./tool.js";
import { getStorage, setStorage } from "./storage.js";

// 获取个人信息缓存
export const getSelfInfoStorage = async () => {
    return await getStorage('juejin-self');
}

// 设置个人信息缓存
export const setSelfInfoStorage = async (selfInfo) => {
    await setStorage('juejin-self', selfInfo);
}

// 获取未读消息数
export const getMessageNotReadCount = async () => {
    let self = await getSelfInfoStorage();
    if (!self) return;
    let cookie = await getCookie();
    let res = await fetch('https://api.juejin.cn/interact_api/v1/message/count', {
        headers: { Cookie: cookie }
    }).then(res => res.json());
    let { success, data } = handleApiResult(res);
    if (!success) return;
    // count[1]：点赞和收藏
    let { count, total } = data;
    let countStorage = await getStorage('message-not-read-count');
    // 有未读
    if (total && total !== countStorage) {
        chrome.notifications.create(uuid(), {
            type: 'basic',
            title: "掘金未读消息通知",
            message: `您有${total}条新消息，快去掘金查看吧`,
            iconUrl: '/icons/logo.png'
        });
    }
    await setStorage('message-not-read-count', total);
    await sleep(10);
    getMessageNotReadCount()
}

// 登出
export const logout = async () => {
    let cookie = await getCookie();
    await fetch('https://juejin.cn/passport/web/logout/', {
        headers: { Cookie: cookie }
    })
    // 取出所有打开的掘金tab
    let tabs = await getAllJueJinTabs();
    for (let tab of tabs) {   // 刷新当前页
        await chrome.tabs.update(tab.id, { url: tab.url });
    }
    await setSelfInfoStorage(null);
    await resetContextMenus();
}

// 获取用户信息
export const getUserInfo = async (userId) => {
    let res = await fetch(`https://api.juejin.cn/user_api/v1/user/get?user_id=${userId}`).then(res => res.json());
    let { success, data } = handleApiResult(res);
    return success ? data : null;
}

// 更新登录人信息
export const resetSelfInfo = async () => {
    let cookie = await getCookie()
    let data = await fetch('https://api.juejin.cn/user_api/v1/user/get_info_pack',
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
            body: JSON.stringify({ "pack_req": { "user_counter": true, "user_growth_info": true, "user": true } })
        }).then(res => res.json());
    let { data: userInfo } = handleApiResult(data);
    if (!userInfo) return await setSelfInfo(null)
    await setSelfInfoStorage(userInfo);
    return userInfo;
}

// 签到
export const signin = async () => {
    let cookie = await getCookie();
    let res = await fetch('https://api.juejin.cn/growth_api/v1/check_in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
    }).then(res => res.json());
    let { success, data, err_msg } = handleApiResult(res);
    chrome.notifications.create(uuid(), {
        type: 'basic',
        title: '掘金签到：' + (success ? '成功' : '失败'),
        message: success ? `本次新增矿石：${data.incr_point}，当前矿石：${data.sum_point}` : err_msg,
        iconUrl: '/icons/logo.png'
    });
}

// 收集bug
export const bugfix = async () => {
    let cookie = await getCookie();
    let res = await fetch('https://api.juejin.cn/user_api/v1/bugfix/not_collect', {
        method: 'POST',
        headers: { 'Cookie': cookie },
    }).then(res => res.json());
    let { success, data, err_msg } = handleApiResult(res);
    chrome.notifications.create(uuid(), {
        type: 'basic',
        title: '掘金BugFix：' + (success ? '成功' : '失败'),
        message: success ? `今日掘金bugfix：${data.length}` : err_msg,
        iconUrl: '/icons/logo.png'
    });
    if (!success) return;
    data.forEach(bug => {
        fetch('https://api.juejin.cn/user_api/v1/bugfix/collect', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
            body: JSON.stringify(bug)
        })
    })
}

export const initAuth = async () => {
    await resetSelfInfo();
    await getMessageNotReadCount();
}
// 更新登录人的沸点信息
import { getStorage, setStorage } from "./storage.js";
import { getSelfInfoStorage } from "./auth.js";
import { getCookie, handleApiResult, sleep } from "./tool.js";


export const setPingsStorage = async (storage) => {
    if (!storage) {
        storage = { status: 'normal', list: [], remove: { ping: null, count: 0 } }
    }
    await setStorage('self-ping-info', storage)
}
export const getPingsStorage = async () => {
    let storage = await getStorage('self-ping-info');
    return storage || { status: 'normal', list: [], remove: { ping: null, count: 0 } };
}

// 删除登录人的全部沸点
export const removeSelfAllPings = async () => {
    if (!(await getSelfInfoStorage())) return;
    let storage = await getPingsStorage()
    if (storage.status !== 'normal') return;
    storage.status = 'removing';
    await setPingsStorage(storage)
    for (let ping of storage.list) {
        await notifyAllTabMessage();
        // 正在删除
        storage.remove.ping = ping;
        storage.remove.count++;
        // 先保存到里面
        await setPingsStorage(storage)
        let success = await removePing(ping);
        if (!success) break;
        await sleep(1);
    }
    await setPingsStorage(storage)
    await resetSelfPings();
}

// 删除单个沸点
export const removePing = async (ping) => {
    let cookie = await getCookie();
    let url = `https://api.juejin.cn/content_api/v1/short_msg/delete`;
    let res = fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Cookie: cookie },
        body: JSON.stringify({ msg_id: ping.msg_id })
    }).then(res => res.json());
    let { success } = handleApiResult(res);
    return success
}

export const notifyAllTabMessage = async () => {
    let self = await getSelfInfoStorage();
    if (!self) return;
    let storage = await getPingsStorage();
    let pingsTabs = await chrome.tabs.query({ url: `https://juejin.cn/user/${self.user_basic.user_id}/pins` });
    pingsTabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, { from: 'background', event: 'ping-info-change', data: storage });
    })
}

export const pageUpdateComplete = async (page) => {
    let self = await getSelfInfoStorage();
    if (!self || page.url !== `https://juejin.cn/user/${self.user_basic.user_id}/pins`) return;
    let store = await getPingsStorage();
    if (store.status === 'normal') {
        await resetSelfPings();
    }
}

// 重置登录人的沸点信息
export const resetSelfPings = async () => {
    let self = await getSelfInfoStorage();
    if (!self) return;
    let pings = await getUserPings(self.user_basic.user_id);
    await setPingsStorage({
        status: 'normal',
        list: pings,
        remove: { ping: null, count: 0 }
    })
    await notifyAllTabMessage();
}

// 获取用户的全部沸点
export const getUserPings = async (userId) => {
    let url = `https://api.juejin.cn/content_api/v1/short_msg/query_list`;
    let res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cursor: '0', user_id: userId, sort_type: 4, limit: 999 })
    }).then(res => res.json());
    let { success, data } = handleApiResult(res);
    return success ? (data || []) : []
}

export const initPings = async () => {
    await resetSelfPings();
}

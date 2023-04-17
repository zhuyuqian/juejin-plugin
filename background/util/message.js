import {resetSelfInfo} from "./auth.js";
import {getSelfInfo} from "./storage.js";
import {getPingsStorage, removeSelfAllPings} from "./pings.js";

const onMessageSync = async (request, sender, callback) => {
    let {to, event, data} = request;
    if (to !== 'background') return;
    if (event === 'get-self-info') { // 获取我的信息
        await resetSelfInfo();
        callback((await getSelfInfo()));
    }
    if (event === 'dom-insert-complete') { // dom插入完毕
        if (data.key === 'REMOVE_ALL_PINGS') {
            callback((await getPingsStorage()))
        }
    }
    if (event === 'remove-all-ping') { // 删除全部我的沸点
        await removeSelfAllPings()
    }
}

export const onMessage = (request, sender, callback) => {
    onMessageSync(request, sender, callback);
    return true
}
import { resetSelfInfo } from "./auth.js";
import { getPinClubHotRank, getPingsStorage, removeSelfAllPings } from "./pings.js";
import { getSpecialFocusUsers } from "./specialFocus.js";

const onMessageSync = async (request, sender, callback) => {
    let { to, event, data } = request;
    if (to !== 'background') return;
    if (event === 'get-self-info') { // 获取我的信息
        callback((await resetSelfInfo()));
    }
    if (event === 'dom-insert-complete') { // dom插入完毕
        if (data.key === 'REMOVE_ALL_PINGS') {
            callback((await getPingsStorage()))
        }
        if (data.key === 'SPECIAL_FOCUS_USERS') {
            callback((await getSpecialFocusUsers()))
        }
        if (data.key === 'CLUB_HOT_USER') {
            callback((await getPinClubHotRank(data.clubId)))
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
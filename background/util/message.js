import {resetContextMenus} from "./contextMenus.js";
import {resetSelfInfo} from "./auth.js";
import {getSelfInfo, setSelfInfo} from "./storage.js";
import {removeSelfAllPings} from "./pings.js";

export const onMessage = async (request, sender, callback) => {
    let {to, event, data} = request;
    if (to !== 'background') return;
    if (event === 'page-init') { // 页面准备完成
        if (!data.login) { // 未登录
            await setSelfInfo(null);
        } else {
            // 获取缓存登录用户
            let selfInfo = await getSelfInfo();
            // 如果没有，就从接口重新获取
            if (!selfInfo) await resetSelfInfo();
        }
        // 重置按钮
        await resetContextMenus()
    }
    if (event === 'remove-all-pings') { // 删除全部我的沸点
        await removeSelfAllPings()
    }
}
// 内容相关
import {ajax} from "./index";

/*
* 删除沸点
* */
export const removeShortMsg = (msgId) => ajax({
    url: `https://api.juejin.cn/content_api/v1/short_msg/delete`,
    method: 'POST',
    data: {msg_id: msgId},
    isInclude: true,
})

/*
* 获取用户沸点列表
* */
export const getShortMsgList = ({userId, cursor = 0, sortType = 4, limit = 999}) => ajax({
    url: `https://api.juejin.cn/content_api/v1/short_msg/query_list`,
    method: 'POST',
    data: {user_id: userId, cursor: cursor.toString(), sort_type: sortType, limit: limit}
})

/*
* 获取沸点详情
* */
export const getShortMsgDetail = (msgId) => ajax({
    url: `https://api.juejin.cn/content_api/v1/short_msg/detail`,
    method: 'POST',
    data: {msg_id: msgId}
})

/*
* 发布沸点
* @param msg 发布的对象
* */
export const publishShortMsg = (msg) => ajax({
    url: `https://api.juejin.cn/content_api/v1/short_msg/publish`,
    method: "POST",
    data: msg,
    isInclude: true,
})
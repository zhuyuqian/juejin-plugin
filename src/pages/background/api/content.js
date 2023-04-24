// 内容相关
import { ajax } from "./index";

/*
* 删除沸点
* */
export const removeShortMsg = (msgId) => ajax({
	url: `https://api.juejin.cn/content_api/v1/short_msg/delete`,
	method: 'POST',
	data: { msg_id: msgId },
	isInclude: true,
})

/*
* 获取用户沸点列表
* */
export const getShortMsgList = ({ userId, cursor = 0, sortType = 4, limit = 999 }) => ajax({
	url: `https://api.juejin.cn/content_api/v1/short_msg/query_list`,
	method: 'POST',
	data: { user_id: userId, cursor: cursor.toString(), sort_type: sortType, limit: limit }
})

/*
* 发布沸点
* @param content 内容
* @param topicId 圈子id
* */
export const publishShortMsg = (content, topicId = null) => ajax({
	url: `https://api.juejin.cn/content_api/v1/short_msg/publish`,
	method: "POST",
	data: { content, topicId, sync_to_org: false },
	isInclude: true,
})
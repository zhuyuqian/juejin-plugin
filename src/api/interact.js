import { ajax } from "./index";


/*
* 获取点赞列表
* @param item_type 4：沸点
* @param sort_type 2：时间倒序
* */
export const diggQueryPage = ({ cursor = 0, item_type = 4, sort_type = 2, user_id }) => ajax({
	url: `https://api.juejin.cn/interact_api/v1/digg/query_page`,
	method: 'POST',
	data: { cursor: cursor.toString(), item_type, sort_type, user_id }
})

/*
* 取消点赞
* @param itemId id
* @param itemType 4：沸点
* */
export const cancelDigg = (itemId, itemType) => ajax({
	url: `https://api.juejin.cn/interact_api/v1/digg/cancel`,
	method: 'POST',
	data: { item_id: itemId, item_type: itemType }
})
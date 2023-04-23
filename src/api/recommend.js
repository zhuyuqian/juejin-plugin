import { ajax } from "./index";

export const getTopicShortMsgList = ({ topic_id, cursor = 0, id_type = 4, limit = 10, sort_type = 500 }) => ajax({
	url: `https://api.juejin.cn/recommend_api/v1/short_msg/topic`,
	method: "POST",
	data: { topic_id, cursor: cursor.toString(), id_type, limit, sort_type }
})
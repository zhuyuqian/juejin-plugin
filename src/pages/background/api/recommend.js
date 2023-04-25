import { ajax } from "./index";
import { encode } from 'js-base64';


/*
* 获取沸点列表
* */
export const getTopicShortMsgList = ({ topic_id, cursor = 0, id_type = 4, limit = 459, sort_type = 500 }) => ajax({
	url: `https://api.juejin.cn/recommend_api/v1/short_msg/topic`,
	method: "POST",
	data: { topic_id, cursor: encode(JSON.stringify({ v: "", i: cursor })), id_type, limit, sort_type }
})
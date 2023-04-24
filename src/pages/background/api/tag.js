import { ajax } from "./index";

/*
* 获取沸点圈子详情
* */

export const queryTopicDetail = (topicId) => ajax({
	url: `https://api.juejin.cn/tag_api/v1/query_topic_detail`,
	method: 'POST',
	data: { topic_id: topicId }
})
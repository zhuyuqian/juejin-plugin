// 消息相关
import { ajax } from "./index";

export const getNotReadMessageCount = () => ajax({
	url: `https://api.juejin.cn/interact_api/v1/message/count`,
	isInclude: true,
})
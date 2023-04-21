import { getSelfInfoStorage } from "./auth.js";
import { getPinClubHotRank, getSelfPings, removePing } from "./pings.js";
import { getSpecialFocusUsers } from "./specialFocus.js";

const onMessageSync = async (request, sender, callback) => {
	let { to, event, data } = request;
	if (to !== 'background') return;
	if (event === 'get-self-info') { // 获取我的信息
		callback((await getSelfInfoStorage()));
	}
	if (event === 'remove-ping') { // 删除我的沸点
		callback((await removePing(data)))
	}
	if (event === 'dom-insert-complete') { // dom插入完毕
		if (data.key === 'REMOVE_ALL_PINGS') {
			callback((await getSelfPings())) // 获取我的全部沸点
		}
		if (data.key === 'SPECIAL_FOCUS_USERS') {
			callback((await getSpecialFocusUsers())) // 获取我的特别关注
		}
		if (data.key === 'PING_CLUB_USER_RANK') {
			callback((await getPinClubHotRank(data.clubId))) // 获取掘金沸点圈子一周沸物榜单
		}
	}
}

export const onMessage = (request, sender, callback) => {
	onMessageSync(request, sender, callback);
	return true
}
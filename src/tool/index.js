import Dayjs from 'dayjs';
import weekday from "dayjs/plugin/weekday";
import relativeTime from 'dayjs/plugin/relativeTime';
import "dayjs/locale/zh-cn";

Dayjs.extend(weekday);
Dayjs.extend(relativeTime);
Dayjs.locale('zh-cn')

export const dayjs = Dayjs;

/*
* 获取uuid
* */
export const uuid = () => {
	var s = [];
	var hexDigits = "0123456789abcdef";
	for (var i = 0; i < 36; i++) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	}
	s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
	s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
	s[8] = s[13] = s[18] = s[23] = "-";

	var uuid = s.join("");
	return uuid;
}

/*
* 睡眠函数
* */
export const sleep = (x) => {
	return new Promise(res => {
		setTimeout(() => {
			res();
		}, x * 1000)
	})
}

/*
* 获取掘金动态分数计算
* 0：发布文章
* 1：点赞文章
* 2：发布沸点
* 3：点赞沸点
* 4、关注用户
* 5、关注标签
* */
export const getDynamicScoreByActions = (actions) => {
	if (!actions.length) return 0
	let score = 0;
	actions.forEach(action => {
		if (action === 0) score += 70;
		if (action === 1) score += 20;
		if (action === 2) score += 10;
		if (action === 3) score += 5;
		if (action === 4) score += 10;
	})
	// 活跃度等级
	// Lv0 —— 活跃度 0
	// Lv1 —— 活跃度 [1, 20)
	// Lv2 —— 活跃度 [20, 60)
	// Lv3 —— 活跃度 [60, 80)
	// Lv4 —— 活跃度 [80, 100)
	return Math.min(score, 100);
}

export const getDynamicActionsCount = actions => {
	if (!actions.length) return {};
	let count = {};
	actions.forEach(action => {
		count[action] ? count[action]++ : count[action] = 1;
	})
	return count;
}

/**
 * 生成指定范围的随机整数
 * @param min
 * @param max
 * @param type
 * @returns int
 */
export const getRandInt = (min, max, type) => {
	type = type || 3;
	min = Math.ceil(min);
	max = Math.floor(max);
	switch (type) {
		case 1: //得到一个两数之间的随机整数,这个值不小于min（如果min不是整数的话，得到一个向上取整的 min），并且小于（但不等于）max  [min,max)
			return Math.floor(Math.random() * (max - min)) + min;
		case 2: //得到一个两数之间的随机整数，包括两个数在内,这个值比min大（如果min不是整数，那就不小于比min大的整数），但小于（但不等于）max [min,max]
			return Math.floor(Math.random() * (max - min + 1)) + min;
		case 3: //得到一个两数之间的随机整数， (min,max)
			return Math.floor(Math.random() * (max - min - 1)) + min + 1;
	}
}

export const openLink = (link, target = '_black') => {
	let a = document.createElement("a");
	a.style.display = 'none'
	if (target == '_black') target += ('_' + new Date().getTime());
	a.target = target;
	a.href = link;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
}



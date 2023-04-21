// 获取cookie
export const getCookie = async () => {
	let cookies = await chrome.cookies.getAll({})
	let arr = cookies.map(cookie => `${cookie.name}=${cookie.value}`);
	return arr.join(';');
}

export const handleApiResult = (apiRes) => {
	return Object.assign({}, apiRes, { success: apiRes.err_no === 0 })
}

export const getAllJueJinTabs = async () => {
	return await chrome.tabs.query({ url: 'https://juejin.cn/*' });
}

export const isJueJinByTab = (tab) => {
return tab.url.includes('juejin.cn');
}

export const sleep = (s) => {
	return new Promise(res => {
		setTimeout(res, s * 1000)
	})
}

// 获取本月月初时间戳
export const getCurrentMonthFirstTime = () => {
	var data = new Date();
	data.setDate(1);
	data.setHours(0);
	data.setSeconds(0);
	data.setMinutes(0);
	return data.getTime();
}

// 获取本周一时间戳
export const getCurrentWeekFirstTime = () => {
	const now = new Date()
	const nowTime = now.getTime()
	// getDay()返回0-6，其中0表示周日，需特殊处理
	const day = now.getDay() > 0 ? now.getDay() : 7 // 表示当前是周几
	const oneDayTime = 24 * 60 * 60 * 1000 // 一天的总ms
	// 本周一时间戳
	const MondayTime = nowTime - (day - 1) * oneDayTime
	// 格式化时间
	const monday = new Date(MondayTime);
	monday.setHours(0);
	monday.setSeconds(0);
	monday.setMinutes(0);
	return monday.getTime();
}


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
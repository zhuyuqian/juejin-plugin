import { createApp } from "vue";
import RemoveAllPins from "./component/RemoveAllPins.vue";
import PinClubUserRank from "./component/PinClubUserRank.vue";
import CancelAllPinsZan from "./component/CancelAllPinsZan.vue";
import UserYearDynamic from "./component/UserYearDynamic.vue";
import LotteryAllIn from "./component/LotteryAllIn.vue";
import FuzzyPin from "./component/FuzzyPin.vue";
import NickName from "./component/NickName.vue";
import ChangeTheme from "./component/ChangeTheme.vue";
import SpecialAttention from "./component/SpecialAttention.vue";

import * as ElementPlusIconsVue from '@element-plus/icons-vue'


import { dayjs } from "../../tool";
import { ajax, EVENT_MAP } from "./api";
import RandomPin from "./component/RandomPin.vue";

let self = null;
let url = { methods: [], url: "", info: {} };

const insertPlugin = (app) => {
	app.config.globalProperties.$dayjs = dayjs;
	app.config.globalProperties.$self = self;
	app.config.globalProperties.$url = url;
	for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
		app.component(key, component)
	}
}

/*
* 初始化当前URL信息
* url：不含任何参数的当前链接
* methods：最终需要做的哪些事情
* */
const initUrlInfo = async () => {
	self = await ajax(EVENT_MAP.GET_SELF_INFO);
	url.url = window.location.origin + window.location.pathname;
	url.methods = ["FUZZY_PIN", "NICK_NAME", "SPECIAL_ATTENTION"];
	let urlArr = url.url.split("/");
	// 个人主页
	if (urlArr[3] === 'user') {
		// 幸运抽奖
		if (urlArr[4] === 'center' && urlArr[5] === 'lottery') {
			url.methods.push('LOTTERY_ALL_IN');
		} else {
			// 个人页
			url.info = { userId: urlArr[4] };
			let isSelf = !!(self && self.user_basic.user_id === url.info.userId);
			if (urlArr[5] === "pins" && isSelf) {
				url.methods.push("REMOVE_ALL_PINGS");
			}
			if (urlArr[5] === "praise" && isSelf) {
				url.methods.push("CANCEL_ALL_PINS_ZAN");
			}
		}
		// 通用设置
		if (urlArr[4] === 'settings' && urlArr[5] === 'common') {
			url.methods.push("CHANGE_THEME");
		}
	}
	// 网站主页的沸点页面
	if (urlArr[3] === 'pins') {
		url.methods.push("RANDOM_PIN");
	}
	// 首页我的圈子 || 推荐圈子 || 圈子页
	if (urlArr.includes("myclub") || urlArr.includes("club")) {
		url.methods.push("PING_CLUB_USER_RANK");
		url.info = { clubId: urlArr[urlArr.length - 1] };
	}
};

/*
* 初始化页面主题
* */
const initTheme = () => {
	$('body').attr('data-plugin-theme', localStorage.getItem('pluginTheme') || 'default')
}

/*
* 当页面发生变化的时候需要做的事情
* 调用时机：刷新页面 || 页面切换
* 1、判断所有需要的dom是否准备存在，如果不存在，那么500毫秒后重新获取
* 2、dom准备完毕，先移除之前的组件
* 3、执行配置好的insert函数（大部分为创建节点然后插入到dom结构中）
* */
export const pageChange = async () => {
	await initTheme();
	await initUrlInfo();
	let complete = true;
	for (let methodName of url.methods) {
		let method = METHOD_MAP[methodName];
		if (method && !method.target()) {
			complete = false;
			break;
		}
	}
	// 如果需要的dom节点没有准备好，那么500毫秒后继续调用一次
	if (!complete) return setTimeout(() => pageChange(), 500);
	// 需要的dom都准备好了，开始执行配置好的事情
	for (let methodName in METHOD_MAP) {
		let method = METHOD_MAP[methodName];
		method.remove();
		if (url.methods.includes(methodName)) {
			method.insert();
		}
	}
};

const METHOD_MAP = {
	// 切换主题
	CHANGE_THEME: {
		target: () => document.querySelector('.setting-common'),
		insert() {
			$(this.target()).append($(`<div id="CHANGE_THEME"><div>`))
			this.app = createApp(ChangeTheme);
			insertPlugin(this.app)
			this.app.mount("#CHANGE_THEME");
		},
		remove() {
			this.app?.unmount();
			$(`#CHANGE_THEME`).remove();
		}
	},
	// 屏蔽沸点
	FUZZY_PIN: {
		target: () => document.querySelector("#juejin"),
		insert() {
			if (!this.app) {
				$(`<div id="FUZZY_PIN"><div>`).insertAfter(this.target());
				this.app = createApp(FuzzyPin);
				insertPlugin(this.app)
				this.app.mount("#FUZZY_PIN");
			}
		},
		remove() {
		}
	},
	// 昵称（别名）设置
	NICK_NAME: {
		target: () => document.querySelector("#juejin"),
		insert() {
			if (!this.app) {
				$(`<div id="NICK_NAME"><div>`).insertAfter(this.target());
				this.app = createApp(NickName);
				insertPlugin(this.app)
				this.app.mount("#NICK_NAME");
			}
		},
		remove() {
		}
	},
	// 删除我的全部沸点
	REMOVE_ALL_PINGS: {
		target: () => document.querySelector(".list-header"),
		insert() {
			$(`<div id="REMOVE_ALL_PINGS"><div>`).insertBefore(this.target());
			this.app = createApp(RemoveAllPins);
			insertPlugin(this.app)
			this.app.mount("#REMOVE_ALL_PINGS");
		},
		remove() {
			this.app?.unmount();
			$(`#REMOVE_ALL_PINGS`).remove();
		}
	},
	// 沸点圈子今日沸物
	PING_CLUB_USER_RANK: {
		target: () => document.querySelector(".pin-editor") || document.querySelector(".create-pin"),
		insert() {
			$(`<div id="PING_CLUB_USER_RANK"><div>`).insertAfter(this.target());
			this.app = createApp(PinClubUserRank);
			insertPlugin(this.app)
			this.app.mount("#PING_CLUB_USER_RANK");
		},
		remove() {
			this.app?.unmount();
			$(`#PING_CLUB_USER_RANK`).remove();
		}
	},
	// 取消我的赞
	CANCEL_ALL_PINS_ZAN: {
		target: () => document.querySelector('.list-block'),
		insert() {
			$(`<div id="CANCEL_ALL_PINS_ZAN"><div>`).insertBefore(this.target());
			this.app = createApp(CancelAllPinsZan);
			insertPlugin(this.app)
			this.app.mount("#CANCEL_ALL_PINS_ZAN");
		},
		remove() {
			this.app?.unmount();
			$(`#CANCEL_ALL_PINS_ZAN`).remove();
		}
	},
	// 生成随机沸点
	RANDOM_PIN: {
		target: () => document.querySelector('.jcode-picker'),
		insert() {
			$(`<div id="RANDOM_PIN"><div>`).insertAfter(this.target());
			this.app = createApp(RandomPin);
			insertPlugin(this.app);
			this.app.mount("#RANDOM_PIN");
		},
		remove() {
			this.app?.unmount();
			$(`#RANDOM_PIN`).remove();
		}
	},
	// 特别关注
	SPECIAL_ATTENTION: {
		target: () => document.querySelector("#juejin"),
		insert() {
			if (!this.app) {
				$(`<div id="SPECIAL_ATTENTION"><div>`).insertAfter(this.target());
				this.app = createApp(SpecialAttention);
				insertPlugin(this.app)
				this.app.mount("#SPECIAL_ATTENTION");
			}
		},
		remove() {
		}
	},
	// 梭哈抽奖｜未做功能
	LOTTERY_ALL_IN: {
		target: () => document.querySelector('.current_value'),
		insert() {
			$(`<div id="LOTTERY_ALL_IN"><div>`).insertAfter(this.target());
			this.app = createApp(LotteryAllIn);
			insertPlugin(this.app);
			this.app.mount("#LOTTERY_ALL_IN");
		},
		remove() {
			this.app?.unmount();
			$(`#LOTTERY_ALL_IN`).remove();
		}
	},
	// 社区活跃度 | 暂时废弃
	USER_YEAR_DYNAMIC: {
		target: () => document.querySelector('.badge-wall'),
		insert() {
			$(`<div id="USER_YEAR_DYNAMIC"><div>`).insertAfter(this.target());
			this.app = createApp(UserYearDynamic);
			insertPlugin(this.app);
			this.app.mount("#USER_YEAR_DYNAMIC");
		},
		remove() {
			this.app?.unmount();
			$(`#USER_YEAR_DYNAMIC`).remove();
		}
	},
};

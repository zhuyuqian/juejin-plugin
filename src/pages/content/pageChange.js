import { createApp } from "vue";
import RemoveAllPins from "./component/RemoveAllPins.vue";
import PinClubUserRank from "./component/PinClubUserRank.vue";
import CancelAllPinsZan from "./component/CancelAllPinsZan.vue";
import UserYearDynamic from "./component/UserYearDynamic.vue";

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

const METHOD_MAP = {
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
	// 沸点圈子本周沸物
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
	// 用户年度动态
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
	}
};

/*
* 当页面发生变化的时候需要做的事情
* 调用时机：刷新页面 || 页面切换
* 1、判断所有需要的dom是否准备存在，如果不存在，那么500毫秒后重新获取
* 2、如果全部dom都准备完成，那么开始执行配置好的insert函数（大部分为创建节点然后插入到原本的dom结构中）
* 3、执行完成后，通知后端获取该任务对应的数据
* 4、获取到数据之后，调用对应任务的change方法（大部分为将数据渲染到准备好的节点里面）
* 5、如果当前页面不存在配置里面的任务，则调用对应任务的remove函数
* */
export const pageChange = async () => {
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


/*
* 初始化当前URL信息
* url：不含任何参数的当前链接
* methods：最终需要做的哪些事情
* */
const initUrlInfo = async () => {
	self = await ajax(EVENT_MAP.GET_SELF_INFO);
	url.url = window.location.origin + window.location.pathname;
	url.methods = ["SPECIAL_FOCUS_USERS"];
	let urlArr = url.url.split("/");
	if (urlArr[3] === "user") {
		url.info = { userId: urlArr[4] };
		url.methods.push('USER_YEAR_DYNAMIC')
		let isSelf = !!(self && self.user_basic.user_id === url.info.userId);
		if (urlArr[5] === "pins" && isSelf) {
			url.methods.push("REMOVE_ALL_PINGS");
		}
		if (urlArr[5] === "praise" && isSelf) {
			url.methods.push("CANCEL_ALL_PINS_ZAN");
		}
	}
	if (urlArr[3] === 'pins') {
		url.methods.push("RANDOM_PIN");
	}
	// 首页我的圈子 || 推荐圈子 || 圈子页
	if (urlArr.includes("myclub") || urlArr.includes("club")) {
		url.methods.push("PING_CLUB_USER_RANK");
		url.info = { clubId: urlArr[urlArr.length - 1] };
	}
};

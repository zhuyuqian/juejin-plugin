/*
* 1、清空我的全部沸点功能
* */

let selfInfo = null;
let urlInfo = { methods: [], url: '', info: {} };

let METHOD_MAP = {
	REMOVE_ALL_PINGS: { // 删除我的全部沸点
		targetComplete: () => {
			return !!document.querySelector('[type="pins"]');
		},
		create: function () {
			if (this.el) return this.el;
			this.el = document.createElement('div');
			this.el.className = 'plugin-remove-button';
			this.el.onclick = async () => {
				if (this.el.className.includes('disabled')) return;
				if (confirm("删除一旦开始，将不能终止，你确定要进行该操作么？")) {
					await sendMessageToBackground({ to: 'background', event: 'remove-all-ping' });
				}
			}
			return this.el;
		},
		insert: function () {
			if (document.querySelector('.plugin-remove-button')) return;
			document.querySelector('[type="pins"]').insertAdjacentElement('afterbegin', this.create());
		},
		change: function (pingsInfo) {
			if (!this.el) return;
			let { status, list, remove } = pingsInfo;
			if (status === 'normal' && list.length) {
				this.el.className = `plugin-remove-button`;
				this.el.innerHTML = '删除全部沸点';
			} else {
				this.el.className = `plugin-remove-button disabled`;
				if (status === 'removing') this.el.innerHTML = `正在删除${remove?.count}/${list.length}(${remove?.ping?.msg_Info?.content})`;
				if (!list.length) this.el.innerHTML = `沸点已全部清空`;
			}
		},
		remove: function () {
			removeElBySelector('.plugin-remove-button');
		}
	},
	PING_CLUB_USER_RANK: { // 沸点圈子本周沸物
		targetComplete: () => {
			return document.querySelector('.pin-editor') || document.querySelector('.create-pin')
		},
		create: function () {
			if (this.el) return this.el;
			// 最外层节点
			this.el = document.createElement('div');
			this.el.className = 'plugin-card club-user-rank';
			// 标题相关
			let titleDiv = document.createElement('div');
			let descDiv = document.createElement('div');
			let titleNameDiv = document.createElement('div');
			titleDiv.appendChild(titleNameDiv)
			titleDiv.appendChild(descDiv);
			titleDiv.className = 'plugin-card-title';
			titleNameDiv.className = 'plugin-card-name';
			descDiv.className = 'plugin-card-desc'

			// 内容相关
			let contentDiv = document.createElement('div');
			contentDiv.className = 'plugin-card-content';

			this.el.appendChild(titleDiv)
			this.el.appendChild(contentDiv);
			return this.el;
		},
		insert: function () {
			if (document.querySelector('.club-user-rank')) return;
			insertElementAfter(this.create(), document.querySelector('.pin-editor') || document.querySelector('.create-pin'));
		},
		change: function (rankInfo) {
			if (!this.el) return;
			let { rank, time, club } = rankInfo;
			if (rank.length) {
				this.el.querySelector('.plugin-card-name').innerHTML = `${club.topic.title}｜本周沸物`
				this.el.querySelector('.plugin-card-desc').innerText = `最后更新时间：${formatDate(time, 'hh:mm:ss')}`;
				removeElBySelector('.rank-warp', this.el)
				let el = document.createElement('div');
				el.className = 'rank-warp';
				this.el.querySelector('.plugin-card-content').appendChild(el);
				let rankIndex = 1;
				for (let r of rank) {
					let { msgCount, users } = r;
					let rankEl = document.createElement('div');
					let titleEl = document.createElement('div');
					let rankIndexEl = document.createElement('div');
					let msgCountEl = document.createElement('div');
					let usersEl = document.createElement('div');
					rankEl.className = 'rank-box';
					titleEl.className = 'rank-title';
					rankIndexEl.className = 'rank-index';
					msgCountEl.className = 'rank-msg-count';
					usersEl.className = 'rank-user-warp';
					titleEl.appendChild(rankIndexEl);
					titleEl.appendChild(msgCountEl);
					rankEl.appendChild(titleEl);
					rankEl.appendChild(usersEl);
					rankIndexEl.innerText = `榜${rankIndex++}`;
					msgCountEl.innerText = `${msgCount}沸点/沸物`;
					for (let user of users) {
						let userEl = document.createElement('a');
						userEl.setAttribute('href', `https://juejin.cn/user/${user.userId}`);
						userEl.setAttribute('target', '_blank');
						userEl.className = 'rank-user-box';
						let userImageEl = document.createElement('img');
						userImageEl.setAttribute('src', user.userInfo.avatar_large);
						userImageEl.className = 'rank-user-avatar';
						userEl.appendChild(userImageEl);
						let userNameEl = document.createElement('div');
						userNameEl.className = 'rank-user-name';
						userNameEl.innerText = user.userInfo.user_name;
						userEl.appendChild(userNameEl);
						usersEl.appendChild(userEl);
					}
					el.appendChild(rankEl);
				}
				this.el.style.display = 'block'
			} else {
				this.el.style.display = 'none'
			}
		},
		remove: function () {
			removeElBySelector('.club-user-rank')
		}
	},
	SPECIAL_FOCUS_USERS: { // 特别关注
		targetComplete: () => {
			return document.querySelector('#juejin')
		},
		create: function () {
			if (this.el) return this.el;
			this.el = document.createElement('div');
			this.el.className = 'plugin-card plugin-special-focus';
			let titleDiv = document.createElement('div');
			titleDiv.className = 'plugin-card-title';
			titleDiv.innerHTML = '特别关注';
			let contentDiv = document.createElement('div');
			contentDiv.className = 'plugin-card-content';
			this.el.appendChild(titleDiv);
			this.el.appendChild(contentDiv);
			return this.el;
		},
		insert: function () {
			if (document.querySelector('.plugin-special-focus')) return;
			document.querySelector('#juejin').insertAdjacentElement('afterbegin', this.create());
		},
		change: function (users) {
			if (!this.el) return;
			if (!users.length) {
				this.el.style.display = 'none';
			}
		},
		remove: function () {
			removeElBySelector('.plugin-special-focus');
		}
	}
}

// 插入或移除节点到父亲节点
const pageChange = () => {
	let complete = true;
	for (let methodName of urlInfo.methods) {
		let method = METHOD_MAP[methodName];
		if (!method.targetComplete()) {
			complete = false;
			break
		}
	}
	if (complete) {
		for (let methodName in METHOD_MAP) {
			let method = METHOD_MAP[methodName];
			if (urlInfo.methods.includes(methodName)) {
				method.insert();
				sendMessageToBackground({
					to: 'background',
					event: 'dom-insert-complete',
					data: { key: methodName, ...urlInfo.info }
				}).then(res => method.change(res))
			} else {
				method.remove();
			}
		}
	} else {
		setTimeout(() => pageChange(), 500)
	}
}

// 在指定元素的后面插入元素
function insertElementAfter(newElement, targetElement) {
	var parent = targetElement.parentNode;
	if (parent.lastChild == targetElement) {
		parent.appendChild(newElement);
	} else {
		parent.insertBefore(newElement, targetElement.nextSibling);
	}
}

// 通过查询器删除节点
const removeElBySelector = (selector, parent) => {
	let p = parent || document;
	let el = p.querySelector(selector);
	if (!el) return;
	el.parentNode.removeChild(el);
}

// 向后台发送信息
const sendMessageToBackground = (message) => {
	return new Promise(resFun => {
		chrome.runtime.sendMessage(message, res => {
			resFun(res)
			return true;
		});
	})
}

// 初始化登录人信息
const initSelfInfo = async () => {
	if (!selfInfo) {
		selfInfo = await sendMessageToBackground({ to: 'background', event: 'get-self-info' });
	}
}

// 初始化当前url信息
const initUrlInfo = () => {
	urlInfo.url = window.location.origin + window.location.pathname;
	urlInfo.methods = ['SPECIAL_FOCUS_USERS']
	let urlArr = urlInfo.url.split('/');
	if (urlArr[3] === 'user') {
		urlInfo.info = { userId: urlArr[4] }
		if (urlArr[5] === 'pins') {
			if (selfInfo && selfInfo.user_basic.user_id === urlInfo.info.userId) {
				urlInfo.methods.push('REMOVE_ALL_PINGS');
			}
		}
	}
	if (urlArr.includes('myclub') || urlArr.includes('club')) {
		urlInfo.methods.push('PING_CLUB_USER_RANK');
		urlInfo.info = { clubId: urlArr[urlArr.length - 1] }
	}
}


const initOnMessage = async () => {
	chrome.runtime.onMessage.addListener(async (request, sender, callback) => {
		let { from, event, data } = request;
		if (from !== 'background') return;
		if (event === 'page-change-complete') {
			initUrlInfo();
			pageChange();
		}
		if (event === 'ping-info-change') {
			METHOD_MAP.REMOVE_ALL_PINGS.change(data)
		}
	})
}

const formatDate = (date, fmt) => {
	var currentDate = new Date(date);
	var o = {
		"M+": currentDate.getMonth() + 1, //月份
		"d+": currentDate.getDate(), //日
		"h+": currentDate.getHours(), //小时
		"m+": currentDate.getMinutes(), //分
		"s+": currentDate.getSeconds(), //秒
		"q+": Math.floor((currentDate.getMonth() + 3) / 3), //季度
		"S": currentDate.getMilliseconds() //毫秒
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (currentDate.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}

const init = async () => {
	// 初始化登录人信息
	await initSelfInfo();
	// 初始化url信息
	initUrlInfo();
	// 插入节点
	pageChange();
	// 初始化监听函数
	await initOnMessage();
}

init()



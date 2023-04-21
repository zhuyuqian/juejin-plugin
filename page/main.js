let urlInfo = { methods: [], url: '', info: {} }; // 当前url的相关信息
let selfInfo = null; // 登录人个人信息
let selfPings = [] // 登录人的全部沸点

// 需要做的事情的配置
let METHOD_MAP = {
	// 删除我的全部沸点
	REMOVE_ALL_PINGS: {
		targetComplete: () => {
			return document.querySelector('.list-header');
		},
		create: function () {
			if (this.el) return this.el;
			this.el = document.createElement('div');
			this.el.className = 'plugin-remove-button';
			this.el.onclick = async () => {
				if (this.el.className.includes('disabled')) return;
				if (confirm("你确定要删除全部沸点么？")) {
					while (selfPings.length) {
						let removePing = selfPings.shift();
						this.change(selfPings, removePing);
						await sleep(0.1);
						let { success, err_msg } = await sendMessageToBackground({
							to: 'background',
							event: 'remove-ping',
							data: removePing
						});
						if (success) {
							await sleep(1);
						} else {
							selfPings.unshift(removePing);
							alert(err_msg);
							break;
						}
					}
					this.change(selfPings, null)
				}
			}
			return this.el;
		},
		insert: function () {
			if (document.querySelector('.plugin-remove-button')) return;
			insertElementAfter(this.create(), this.targetComplete())
		},
		change: function (pings, removePing) {
			selfPings = pings;
			if (!this.el) return;
			if (removePing) { // 有正在删除的
				this.el.className = `plugin-remove-button disabled`;
				this.el.innerHTML = `正在删除沸点：${removePing.msg_Info.content.slice(0, 20)}...剩余${pings.length}条`;
			} else {
				if (pings.length) {
					this.el.className = `plugin-remove-button`;
					this.el.innerHTML = `删除全部沸点（${pings.length}）`;
				} else {
					this.el.className = `plugin-remove-button disabled`;
					this.el.innerHTML = `沸点已全部清空`;
				}
			}
		},
		remove: function () {
			removeElBySelector('.plugin-remove-button');
		}
	},
	// 沸点圈子本周沸物
	PING_CLUB_USER_RANK: {
		targetComplete: () => {
			return document.querySelector('.pin-editor') || document.querySelector('.create-pin');
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
			insertElementAfter(this.create(), this.targetComplete());
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
	// 特别关注
	SPECIAL_FOCUS_USERS: {
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

/*
* 在指定元素的后面插入一个元素
* */
function insertElementAfter(newElement, targetElement) {
	insertElementBefore(newElement, targetElement.nextElementSibling);
}

/*
* 在指定元素的前面插入一个元素
* */
function insertElementBefore(newElement, targetElement) {
	targetElement.parentNode.insertBefore(newElement, targetElement);
}

/*
* 通过查询器删除节点
* 如果有parent，则在parent中查找，否则在document中查找
* */
const removeElBySelector = (selector, parent) => {
	let p = parent || document;
	let el = p.querySelector(selector);
	if (!el) return;
	el.parentNode.removeChild(el);
}

/*
* 向后台发送信息
* */
const sendMessageToBackground = (message) => {
	return new Promise(resFun => {
		chrome.runtime.sendMessage(message, res => {
			resFun(res)
			return true;
		});
	})
}

/*
* 格式化日期
* */
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

/*
* 睡眠函数
* */
const sleep = (s) => {
	return new Promise(res => {
		setTimeout(res, s * 1000)
	})
}


/*
* 当页面发生变化的时候需要做的事情
* 调用时机：刷新页面 || 页面切换
* 1、判断所有需要的dom是否准备存在，如果不存在，那么500毫秒后重新获取
* 2、如果全部dom都准备完成，那么开始执行配置好的insert函数（大部分为创建节点然后插入到原本的dom结构中）
* 3、执行完成后，通知后端获取该任务对应的数据
* 4、获取到数据之后，调用对应任务的change方法（大部分为将数据渲染到准备好的节点里面）
* 5、如果当前页面不存在配置里面的任务，则调用对应任务的remove函数
* */
const pageChange = () => {
	let complete = true;
	for (let methodName of urlInfo.methods) {
		let method = METHOD_MAP[methodName];
		if (!method.targetComplete()) {
			complete = false;
			break;
		}
	}
	// 如果需要的dom节点没有准备好，那么500毫秒后继续调用一次
	if (!complete) return setTimeout(() => pageChange(), 500);
	// 需要的dom都准备好了，开始执行配置好的事情
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
}

/*
* 初始化当前URL信息
* url：不含任何参数的当前链接
* methods：最终需要做的哪些事情
* */
const initUrlInfo = () => {
	urlInfo.url = window.location.origin + window.location.pathname;
	urlInfo.methods = ['SPECIAL_FOCUS_USERS']
	let urlArr = urlInfo.url.split('/');
	if (urlArr[3] === 'user') {
		urlInfo.info = { userId: urlArr[4] };
		let isSelf = !!(selfInfo && selfInfo.user_basic.user_id === urlInfo.info.userId);
		if (urlArr[5] === 'pins' && isSelf) {
			urlInfo.methods.push('REMOVE_ALL_PINGS');
		}
		if (urlArr[5] === 'praise' && isSelf) {
			urlInfo.methods.push('CANCEL_ALL_PINGS_ZAN');
		}
	}
	if (urlArr.includes('myclub') || urlArr.includes('club')) {
		urlInfo.methods.push('PING_CLUB_USER_RANK');
		urlInfo.info = { clubId: urlArr[urlArr.length - 1] }
	}
}

/*
* 从后台获取当前登录人的信息
* */
const initSelfInfo = async () => {
	selfInfo = await sendMessageToBackground({ to: 'background', event: 'get-self-info' });
}

chrome.runtime.onMessage.addListener(async (request, sender, callback) => {
	let { from, event, data } = request;
	if (from !== 'background') return;
	if (event === 'page-change-complete') {
		await initSelfInfo();
		await initUrlInfo();
		await pageChange();
	}
	if (event === 'ping-info-change') {
		METHOD_MAP.REMOVE_ALL_PINGS.change(data)
	}
})


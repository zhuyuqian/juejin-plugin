/*
* 1、清空我的全部沸点功能
* */

let useElementMap = {
    USER_PINS_SELF: { // 登录人沸点
        REMOVE_ALL_PINGS: {
            mastSelector: '[type="pins"]',
            insert: function () {
                if (document.querySelector('.plugin-remove-button')) return;
                document.querySelector('[type="pins"]').insertAdjacentElement('afterbegin', this.create());
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
            handleInfoChange: function (pingsInfo) {
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
            }
        },
    },
    PINS_CLUB: { // 圈子页面
        CLUB_HOT_USER: {
            mastSelector: '.pin-editor',
            create: function () {
                if (this.el) return this.el;
                this.el = document.createElement('div');
                this.el.className = 'plugin-card club-user-rank';
                let titleDiv = document.createElement('div');
                titleDiv.className = 'plugin-card-title';
                titleDiv.innerHTML = '本周沸物';
                let descDiv = document.createElement('div');
                descDiv.className = 'plugin-card-desc'
                titleDiv.appendChild(descDiv);

                let contentDiv = document.createElement('div');
                contentDiv.className = 'plugin-card-content';

                this.el.appendChild(titleDiv)
                this.el.appendChild(contentDiv);
                return this.el;
            },
            insert: function () {
                if (document.querySelector('.club-user-rank')) return;
                insteElementAfter(this.create(), document.querySelector(this.mastSelector));
            },
            handleInfoChange: function (rankInfo) {
                if (!this.el) return;
                let { rank, time } = rankInfo;
                this.el.querySelector('.plugin-card-desc').innerText = `最后更新时间：${formatDate(time, 'hh:mm:ss')}`
                let el = this.el.querySelector('.rank-warp');
                if (el) {
                    el.parentNode.removeChild(el);
                }
                el = document.createElement('div');
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
                    msgCountEl.innerText = `共发布${msgCount}条沸点`;
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

            }
        }
    },
    COMMON: {   // 全局
        SPECIAL_FOCUS_USERS: {
            mastSelector: '#juejin',
            insert: function () {
                if (document.querySelector('.plugin-special-focus')) return;
                document.querySelector('#juejin').insertAdjacentElement('afterbegin', this.create());
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
            handleInfoChange: function (users) {
                if (!this.el) return;
                if (!users.length) {
                    this.el.style.display = 'none';
                }
            }
        }
    }
}

let selfInfo = null;
let urlInfo = { type: [], url: '', info: {} };

// 在指定元素的后面插入元素
function insteElementAfter(newElement, targetElement) {
    var parent = targetElement.parentNode;
    if (parent.lastChild == targetElement) {
        parent.appendChild(newElement);
    }
    else {
        parent.insertBefore(newElement, targetElement.nextSibling);
    }
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
    urlInfo.type = ['COMMON']
    let urlArr = urlInfo.url.split('/');
    if (urlArr[3] === 'user') {
        urlInfo.info = { userId: urlArr[4] }
        if (urlArr[5] === 'pins') {
            urlInfo.type.push('PINS');
            if (selfInfo && selfInfo.user_basic.user_id === urlInfo.info.userId) {
                urlInfo.type.push('USER_PINS_SELF');
            }
        }
    }
    if (urlArr.includes('myclub') || urlArr.includes('club')) {
        urlInfo.type.push('PINS_CLUB');
        urlInfo.info = { clubId: urlArr[urlArr.length - 1] }
    }
}

// 插入或移除节点到父亲节点
const insertOrRemoveElement = () => {
    let currentElementMap = {};
    urlInfo.type.forEach(type => {
        Object.assign(currentElementMap, useElementMap[type]);
    })
    if (!currentElementMap) return;
    let complete = true;
    for (let key in currentElementMap) {
        let currentElement = currentElementMap[key];
        if (!document.querySelector(currentElement.mastSelector)) {
            complete = false;
            break
        }
    }
    if (complete) {
        for (let key in currentElementMap) {
            let currentElement = currentElementMap[key];
            currentElement.insert();
            sendMessageToBackground({ to: 'background', event: 'dom-insert-complete', data: { key: key, ...urlInfo.info } })
                .then(res => currentElement.handleInfoChange(res))
        }
    } else {
        setTimeout(() => insertOrRemoveElement(), 500)
    }
}

const initOnMessage = async () => {
    chrome.runtime.onMessage.addListener(async (request, sender, callback) => {
        let { from, event, data } = request;
        if (from !== 'background') return;
        if (event === 'page-change-complete') {
            initUrlInfo();
            insertOrRemoveElement();
        }
        if (event === 'ping-info-change') {
            useElementMap.USER_PINS_SELF.REMOVE_ALL_PINGS.handleInfoChange(data)
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
    // 插入或删除节点
    insertOrRemoveElement();
    // 初始化监听函数
    await initOnMessage();
}

init()



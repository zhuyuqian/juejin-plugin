/*
* 1、清空我的全部沸点功能
* */

let useElementMap = {
    USER_PINS_SELF: {
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
                        await sendMessageToBackground({to: 'background', event: 'remove-all-ping'});
                    }
                }
                return this.el;
            },
            handleInfoChange: function (pingsInfo) {
                if (!this.el) return;
                let {status, list, remove} = pingsInfo;
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
    COMMON: {
        SPECIAL_FOCUS_USERS: {
            mastSelector: '#juejin',
            insert: function () {
                if (document.querySelector('.plugin-special-focus')) return;
                document.querySelector('#juejin').insertAdjacentElement('afterbegin', this.create());
            },
            create: function () {
                if (this.el) return this.el;
                this.el = document.createElement('div');
                this.el.className = 'plugin-special-focus';
                let titleDiv = document.createElement('div');
                titleDiv.className = 'plugin-special-focus-title';
                titleDiv.innerHTML = '特别关注';
                let contentDiv = document.createElement('div');
                contentDiv.className = 'plugin-special-focus-content';
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
let urlInfo = {type: [], url: '', info: {}};

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
        selfInfo = await sendMessageToBackground({to: 'background', event: 'get-self-info'});
    }
}

// 初始化当前url信息
const initUrlInfo = () => {
    urlInfo.url = window.location.href;
    urlInfo.type = ['COMMON']
    let urlArr = urlInfo.url.split('/');
    if (urlArr[3] === 'user') {
        urlInfo.info = {userId: urlArr[4]}
        if (urlArr[5] === 'pins') {
            urlInfo.type.push('PINS');
            if (selfInfo && selfInfo.user_basic.user_id === urlInfo.info.userId) {
                urlInfo.type.push('USER_PINS_SELF');
            }
        }
    }
    if (urlArr.includes('myclub') || urlArr.includes('club')) {
        urlInfo.type.push('PINS_CLUB');
        urlInfo.info = {clubId: urlArr[urlArr.length - 1]}
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
            sendMessageToBackground({to: 'background', event: 'dom-insert-complete', data: {key: key}})
                .then(res => currentElement.handleInfoChange(res))
        }
    } else {
        setTimeout(() => insertOrRemoveElement(), 500)
    }
}

const initOnMessage = async () => {
    chrome.runtime.onMessage.addListener(async (request, sender, callback) => {
        let {from, event, data} = request;
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



/*
* 1、清空我的全部沸点功能
* */
let useElementMap = {
    USER_HOME_PINS_SELF: {
        REMOVE_ALL_PINGS: {
            parentSelector: '[type="pins"]',
            elSelector: '.plugin-remove-button',
            parent: null,
            el: null,
            create: function () {
                if (this.el) return;
                this.el = document.createElement('div');
                this.el.className = 'plugin-remove-button';
                this.el.onclick = async () => {
                    if (this.el.className.includes('disabled')) return;
                    if (confirm("删除一旦开始，将不能终止，你确定要进行该操作么？")) {
                        await sendMessageToBackground({to: 'background', event: 'remove-all-ping'});
                    }
                }
            },
            handleInfoChange: function (pingsInfo) {
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
        }
    }
}

let selfInfo = null;
let urlInfo = {type: '', url: '', info: {}};

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
    if (urlInfo.url.startsWith('https://juejin.cn/user/')) {
        urlInfo.type = 'USER_HOME';
        let tempUrl = urlInfo.url.split('https://juejin.cn/user/')[1];
        let tempParams = tempUrl.split('/');
        urlInfo.info.userId = tempParams[0];
        if (tempParams[1] === 'pins') {
            urlInfo.type = 'USER_HOME_PINS';
        }

        if (selfInfo && selfInfo.user_basic.user_id === urlInfo.info.userId) {
            urlInfo.type = `${urlInfo.type}_SELF`;
        }
    }
}

// 初始化所有需要用到的dom节点
const initCreateElements = () => {
    let currentElementMap = useElementMap[urlInfo.type];
    for (let key in currentElementMap) {
        let element = currentElementMap[key];
        element.create();
    }
}

// 插入或移除节点到父亲节点
const insertOrRemoveElement = () => {
    let currentElementMap = useElementMap[urlInfo.type];
    if (!currentElementMap) return;
    let complete = true;
    for (let key in currentElementMap) {
        let currentElement = currentElementMap[key];
        currentElement.parent = document.querySelector(currentElement.parentSelector);
        if (!currentElement.el || !currentElement.parent) {
            complete = false;
            break
        }
    }
    if (complete) {
        for (let key in currentElementMap) {
            let currentElement = currentElementMap[key];
            currentElement.parent.insertAdjacentElement('afterbegin', currentElement.el);
            sendMessageToBackground({to: 'background', event: 'dom-insert-complete', info: {key: key}})
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
            useElementMap.USER_HOME_PINS_SELF.REMOVE_ALL_PINGS.handleInfoChange(data)
        }
    })

}

const init = async () => {
    await initSelfInfo();
    initUrlInfo();
    initCreateElements();
    insertOrRemoveElement();
    await initOnMessage();
}

init()



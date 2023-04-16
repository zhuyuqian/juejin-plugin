// 判断是否是登录
const getIsLogin = () => {
    return !document.querySelector('.login-button');
}

const getSelfInfo = async () => {
    return (await chrome.storage.local.get())['juejin-self'];
}


const isSelfHome = async () => {
    let url = window.location.href;
    let isLogin = getIsLogin();
    let selfInfo = await getSelfInfo();
    if (!url.includes('https://juejin.cn/user/') || !isLogin || !selfInfo) return;
    let str = url.split('https://juejin.cn/user/')[1];
    let selfId = str.split('/')[0];
    return selfInfo.user_basic.user_id === selfId
}

let removePingsButton = null;

const handlePingsInfoChange = async (pingsInfo) => {
    let pinsParentEl = document.querySelector('[type=pins]');
    if (!pinsParentEl || !removePingsButton) return;
    let {status, list, remove} = pingsInfo;
    if (status === 'normal' && list.length) {
        removePingsButton.className = `plugin-remove-button`;
        removePingsButton.innerHTML = '删除全部沸点';
    } else {
        removePingsButton.className = `plugin-remove-button disabled`;
        if (status === 'removing') removePingsButton.innerHTML = `正在删除${remove?.count}/${list.length}(${remove?.ping?.msg_Info?.content})`;
        if (!list.length) removePingsButton.innerHTML = `沸点已全部清空`;
    }
}

const addDom = async () => {
    let pinsParentEl = document.querySelector('[type=pins]');
    if (pinsParentEl) { // 我的沸点
        if (removePingsButton) {
            if (!document.querySelector('.plugin-remove-button')) {
                pinsParentEl.insertAdjacentElement('afterbegin', removePingsButton);
            }
        } else {
            removePingsButton = document.createElement('div');
            removePingsButton.className = 'plugin-remove-button';
            removePingsButton.onclick = async () => {
                if (removePingsButton.className.includes('disabled')) return;
                if (confirm("删除一旦开始，将不能终止，你确定要进行该操作么？")) {
                    await chrome.runtime.sendMessage({to: 'background', event: 'remove-all-pings', data: null});
                }
            }
            pinsParentEl.insertAdjacentElement('afterbegin', removePingsButton);
        }
    }
    await handlePingsInfoChange((await chrome.storage.local.get())['self-ping-info']);
}

const initDomChange = async () => {
    if (!(await isSelfHome())) return;
    let el = document.querySelector('.list-body');
    if (!el) {
        setTimeout(() => {
            initDomChange();
        }, 300)
    } else {
        await addDom()
    }
}

window.document.onreadystatechange = async () => {
    if (window.document.readyState === 'complete') {
        await chrome.runtime.sendMessage({to: 'background', event: 'page-init', data: {login: getIsLogin()}});
        await initDomChange();
    }
}
chrome.runtime.onMessage.addListener(async (request, sender, callback) => {
    let {from, event, data} = request;
    if (from !== 'background') return;
    if (event === 'page-change-complete') {
        await initDomChange();
    }
    if (event === 'pings-info-change') {
        await handlePingsInfoChange(data)
    }
})
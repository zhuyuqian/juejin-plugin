// 获取cookie
export const getCookie = async () => {
    let cookies = await chrome.cookies.getAll({})
    let arr = cookies.map(cookie => `${cookie.name}=${cookie.value}`);
    return arr.join(';');
}

export const handleApiResult = (apiRes) => {
    return Object.assign({}, apiRes, {success: apiRes.err_no === 0})
}


export const getAllJueJinTabs = async () => {
    return await chrome.tabs.query({url: 'https://juejin.cn/*'});
}

export const sleep = (s) => {
    return new Promise(res => {
        setTimeout(res, s * 1000)
    })
}
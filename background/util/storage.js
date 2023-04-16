export const getSelfInfo = async () => {
    return await getStorage('juejin-self');
}

// 移除登录人信息
export const setSelfInfo = async (selfInfo) => {
    await setStorage('juejin-self', selfInfo);
}

export const setStorage = async (key, value) => {
    await chrome.storage.local.set({[key]: value})
}

export const getStorage = async (key) => {
    return (await chrome.storage.local.get())[key];
}
export const setStorage = async (key, value) => {
    await chrome.storage.local.set({ [key]: value })
}

export const getStorage = async (key) => {
    return (await chrome.storage.local.get())[key];
}
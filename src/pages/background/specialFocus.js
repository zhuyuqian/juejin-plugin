import {getStorage, setStorage} from "./storage";

export const getSpecialFocusUsers = async () => {
    return await getStorage('my-special-focus-users') || [];
}

export const setSpecialFocusUsers = async (list) => {
    await setStorage('my-special-focus-users', list || [])
}

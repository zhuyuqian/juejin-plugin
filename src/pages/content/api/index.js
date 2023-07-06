// 向后台发请求相关的
export const ajax = (event, data) => chrome.runtime.sendMessage({to: 'background', event, data})

export const EVENT_MAP = {
    GET_SELF_INFO: 'get-self-info',
    GET_USER_PINS: 'get-user-pins',
    REMOVE_PIN: 'remove-pin',
    GET_PIN_CLUB_INFO: 'get-pin-club-info',
    GET_PIN_CLUB_DAY_USER_RANK: 'get-pin-club-day-user-rank',
    GET_USER_ZAN_PINS: 'get-user-zan-pins',
    CANCEL_ZAN_PIN: 'cancel-zan-pin',
    GET_YEAR_DYNAMIC: 'get-year-dynamic',
    GET_RANDOM_TEXT: 'get-random-text',
    COPY_PIN_PUSH: 'copy-pin-push'
}
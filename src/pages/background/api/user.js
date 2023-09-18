// 用户相关
import {ajax} from "./index";

/*
* 用户登出
* */
export const logout = () => ajax({
    url: 'https://juejin.cn/passport/web/logout/',
    isInclude: true
})

/*
* 登录人获取自己的信息
* */
export const getSelfInfo = () => ajax({
    url: `https://api.juejin.cn/user_api/v1/user/get_info_pack`,
    method: 'POST',
    data: {pack_req: {user_counter: true, user_growth_info: true, user: true}},
    isInclude: true
})

/*
* 获取用户信息
* @param userId 用户id
* */
export const getUserInfo = (userId) => ajax({
    url: `https://api.juejin.cn/user_api/v1/user/get?user_id=${userId}`
})

/*
* 用户签到
* */
export const checkIn = () => ajax({
    url: 'https://api.juejin.cn/growth_api/v1/check_in',
    method: 'POST',
    isInclude: true
})

/*
* 获取未收集的bug
* */
export const getNotCollectBug = () => ajax({
    url: `https://api.juejin.cn/user_api/v1/bugfix/not_collect`,
    method: 'POST',
    headers: {},
    isInclude: true,
})

/*
* 收集bug
* @param bug bug对象
* */
export const collectBug = (bug) => ajax({
    url: `https://api.juejin.cn/user_api/v1/bugfix/collect`,
    method: 'POST',
    data: bug,
    isInclude: true,
})

/*
* 获取今日免费抽奖次数
* */
export const getLotteryConfig = () => ajax({
    url: `https://api.juejin.cn/growth_api/v1/lottery_config/get`,
    isInclude: true,
})

/*
* 抽奖
* */
export const drawLottery = () => ajax({
    url: `https://api.juejin.cn/growth_api/v1/lottery/draw`,
    method: 'POST',
    isInclude: true,
})


/*
* 获取用户动态
* @param userId 用户id
* @param cursor 偏移数
* */
export const getDynamic = (userId, cursor) => ajax({
    url: `https://api.juejin.cn/user_api/v1/user/dynamic?user_id=${userId}&cursor=${cursor}`
})

/*
* 获取任务列表
* @param userId 用户id
* @param growthType 类型
* */
export const getTaskList = (userId, growthType = 1) => ajax({
    url: `https://api.juejin.cn/growth_api/v1/user_growth/task_list?uuid=${userId}`,
    method: 'POST',
    data: {growth_type: growthType},
    isInclude: true,
})
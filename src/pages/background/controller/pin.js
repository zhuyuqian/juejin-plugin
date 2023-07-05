// 沸点相关
import {getShortMsgList, removeShortMsg} from "../api/content";
import {queryTopicDetail} from "../api/tag";
import {getTopicShortMsgList} from "../api/recommend";
import {getStorage, setStorage} from "../chrome";
import {dayjs, getRandInt, sleep} from "../../../tool";
import {cancelDigg, diggQueryPage} from "../api/interact";

/*
* 获取用户沸点列表
* */
export const getUserPins = async (userId) => {
    // 先获取数量
    let res = await getShortMsgList({userId, limit: 1});
    if (!res.success) return [];
    res = await getShortMsgList({userId, limit: res.count});
    return res.success ? res.data : []
}

/*
* 删除沸点
* */
export const removePin = async (pin) => {
    return await removeShortMsg(pin.msg_id);
}

/*
* 获取用户点赞列表
* */
export const getUserZanPins = async (userId) => {
    let {success, data, count} = await diggQueryPage({user_id: userId, item_type: 4});
    return success ? {pins: data, count: count} : {pins: [], count: 0}
}

/*
* 取消点赞
* */
export const cancelZanPin = async (pin) => {
    let {success} = await cancelDigg(pin.msg_id, 4);
    return success;
}

/*
* 获取圈子详情
* 缓存7天
* */
export const getPinClubInfo = async (clubId) => {
    let storageKey = `pin-club-info-${clubId}`;
    let storage = await getStorage(storageKey);
    if (storage) return storage;
    let {success, data} = await queryTopicDetail(clubId);
    if (!success) return null
    await setStorage(storageKey, data, 60 * 24 * 7);
    return data
}

/*
* 获取圈子当日废物榜
* @param clubId 圈子id
* @param isRefresh 是否需要更新缓存
* */
export const getPinClubDayUserRank = async ({clubId, isRefresh}) => {
    let storageKey = `pin-club-day-user-rank-${clubId}`;
    let storage = await getStorage(storageKey);
    if (storage && !isRefresh) return storage;
    storage = {time: dayjs().format('YYYY-MM-DD HH:mm:ss'), rank: []};
    let topicList = [];
    for (let i = 0; i < 10; i++) {
        let {success, data} = await getTopicShortMsgList({topic_id: clubId, limit: 100, cursor: 100 * i})
        await sleep(0.5)
        if (!success) break;
        let next = true;
        for (let msg of data) {
            if (msg.msg_Info.ctime * 1000 < dayjs().startOf('day').valueOf()) {
                next = false;
                break;
            } else {
                topicList.push(msg)
            }
        }
        if (!next) break;
    }
    let userMsgMap = {};
    let userInfoMap = {};
    for (let msg of topicList) {
        let {user_id} = msg.msg_Info;
        userMsgMap[user_id] ? userMsgMap[user_id].push(msg) : userMsgMap[user_id] = [msg];
        userInfoMap[user_id] = msg.author_user_info;
    }
    let users = [];
    for (let userId in userMsgMap) {
        users.push({userId, userInfo: userInfoMap[userId], msgCount: userMsgMap[userId].length});
    }
    users.sort((a, b) => b.msgCount - a.msgCount);
    let rank = [];
    for (let user of users) {
        if (!rank.length) {
            rank.push({msgCount: user.msgCount, users: [user]});
        } else {
            let {msgCount, users} = rank[rank.length - 1];
            if (user.msgCount === msgCount) {
                users.push(user);
            } else {
                if (rank.length < 3) {
                    rank.push({msgCount: user.msgCount, users: [user]});
                } else {
                    break;
                }
            }
        }
    }
    storage.rank = rank;
    let endTime = (dayjs().endOf('day').valueOf() - dayjs().valueOf()) / 1000 / 60;
    await setStorage(storageKey, storage, endTime);
    return storage
}


/*
* 获取随机文本
* */
export const getRandomText = async (clubName) => {
    const appId = 'nhhhdemgpmhixsnv';
    const appSecret = 'Y296dDlVdVVhRnhucmJmUnhvRVY2UT09'
    let resStr = '';
    try {
        if (clubName.includes('搞笑')) { // 获取每日搞笑段子
            let {data: jokeInfo} = await fetch(`https://www.mxnzp.com/api/jokes/list?page=${getRandInt(1, 8715)}&app_id=${appId}&app_secret=${appSecret}`).then(res => res.json());
            if (jokeInfo && jokeInfo.list.length) {
                resStr += `${jokeInfo.list[getRandInt(0, jokeInfo.list.length - 1)].content}`;
            }
        } else if (clubName.includes('今日新鲜事')) { // 今日新鲜事
            // 先获取列表
            await sleep(1);
            let {data: typeList} = await fetch(`https://www.mxnzp.com/api/news/types?app_id=${appId}&app_secret=${appSecret}`).then(res => res.json());
            if (typeList && typeList.length) {
                let currentType = typeList[getRandInt(0, typeList.length - 1)];
                await sleep(1);
                // 获取详情
                let {data: newList} = await fetch(`https://www.mxnzp.com/api/news/list?typeId=${currentType.typeId}&page=1&app_id=${appId}&app_secret=${appSecret}`).then(res => res.json());
                if (newList && newList.length) {
                    let currentNew = newList[getRandInt(0, newList.length - 1)];
                    resStr += `${currentType.typeName}｜${currentNew.title}`;
                }
            }
        } else { // 其他
            await sleep(1);
            let {data: contentList} = await fetch(`https://www.mxnzp.com/api/daily_word/recommend?count=20&app_id=${appId}&app_secret=${appSecret}`).then(res => res.json());
            if (contentList && contentList.length) {
                resStr += `${contentList[0, contentList.length - 1].content}`
            }
        }

        // 获取ip信息
        await sleep(1);
        let {data: ipInfo} = await fetch(`https://www.mxnzp.com/api/ip/self?app_id=${appId}&app_secret=${appSecret}`).then(res => res.json());
        if (ipInfo) {
            let {province, city} = ipInfo;
            await sleep(1);
            // 获取天气信息
            let {data: weatherInfo} = await fetch(` https://www.mxnzp.com/api/weather/current/${city}?app_id=${appId}&app_secret=${appSecret}`).then(res => res.json());
            if (weatherInfo) {
                resStr += `\n\n${weatherInfo.address}｜${weatherInfo.temp}｜${weatherInfo.weather}｜风向${weatherInfo.windDirection}｜风力${weatherInfo.windPower}｜湿度${weatherInfo.humidity}`
            }
        }
        // 获取当日万年历
        // await sleep(1);
        // let { data: dayInfo } = await fetch(
        // 	`https://www.mxnzp.com/api/holiday/single/${dayjs().format('YYYYMMDD')}?app_id=${appId}&app_secret=${appSecret}`).then(res => res.json())
        // if (dayInfo) {
        // 	resStr += `\n${dayInfo.date}｜${dayInfo.yearTips}年｜${dayInfo.typeDes}｜农历${dayInfo.lunarCalendar}｜${dayInfo.solarTerms}`;
        // }
    } catch (e) {
    }
    return {success: true, data: resStr, err_msg: ''};

}
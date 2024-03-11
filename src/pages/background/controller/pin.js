// 沸点相关
import {getShortMsgDetail, getShortMsgList, publishShortMsg, removeShortMsg} from "../api/content";
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
        } else if (clubName.includes('上班摸鱼')) {
            const holidayList = [
                {'date': '2024-1-1', 'name': '元旦'},
                {'date': '2024-2-09', 'name': '除夕'},
                {'date': '2024-2-10', 'name': '春节'},
                {'date': '2024-4-5', 'name': '清明节'},
                {'date': '2024-5-1', 'name': '劳动节'},
                {'date': '2024-6-10', 'name': '端午节'},
                {'date': '2024-9-17', 'name': '中秋节'},
                {'date': '2024-10-01', 'name': '国庆节'}
            ]
            const moYuTextList = [
                '偶尔摸鱼有害健康，常常摸鱼收获满满。',
                '人生就是浑水，你不去趟，怎么能摸鱼呢？',
                '上班摸鱼就是要发扬死猪不怕开水烫的精神！',
                '“懒”是我养的宠物，再忙都要花点时间摸摸才行！',
                '有一条深海鱼在往深处游，游着游着它就哭了，因为它觉得压力好大。',
                '人类的终极目标是闲情逸致，而不是工作！',
                '摸鱼也是一种对生活的抵抗。',
                '也许工作比无所事事，对世界的危害更大！',
                '感觉有什么东西在扒拉我，以为是爱情的魔爪，没想到是你的鱼钩！',
                '本来摸鱼的时候，内心还是有点愧疚的，但是你“摸鱼的时候多想想你的工资”从此摸鱼就安心多了！'
            ]
            resStr += `【摸鱼办】提醒您：工作再累，一定不要忘记摸鱼哦！\n有事没事起身去茶水间，去厕所，去廊道走走别总在工位上坐着，钱是老板的，但命是自己的。\n`;
            // 周末
            let weekend = new Date().getDay() //获取当前星期X(0-6,0代表星期天)
            if (weekend !== 0 && weekend !== 6) {
                resStr += `\n距离【周末】还有：${6 - weekend}天`
            }
            holidayList.forEach(holiday => {
                let diff = dayjs(holiday.date).diff(dayjs(), 'day');
                if (diff > 0) {
                    resStr += `\n距离【${holiday.name}】还有：${diff + 1}天`
                }
            })
            resStr += '\n' + moYuTextList[getRandInt(0, moYuTextList.length - 1)];
            resStr += '\n' + '上班是帮老板赚钱，摸鱼是赚老板的钱！最后，祝愿天下所有摸鱼人，都能愉快渡过每一天...';
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
        // // 获取当日万年历
        // await sleep(1);
        // let {data: dayInfo} = await fetch(
        //     `https://www.mxnzp.com/api/holiday/single/${dayjs().format('YYYYMMDD')}?app_id=${appId}&app_secret=${appSecret}`).then(res => res.json())
        // if (dayInfo) {
        //     resStr = `${dayInfo.date}｜${dayInfo.yearTips}年｜${dayInfo.typeDes}｜农历${dayInfo.lunarCalendar}｜${dayInfo.solarTerms}\n\n${resStr}`;
        // }
    } catch (e) {
    }
    return {success: true, data: resStr, err_msg: ''};

}

/*
* 复制并发布沸点
* */
export const copyPinPush = async (pinId) => {
    let {success, data} = await getShortMsgDetail(pinId);
    if (!success) return null;
    let pushInfo = {
        sync_to_org: false,
        content: data.msg_Info.content,
        pic_list: data.msg_Info.pic_list,
        topic_id: data.msg_Info.topic_id,
        theme_id: data.msg_Info.theme_id,
        jcode_id: data.msg_Info.jcode_id,
        url: data.msg_Info.url,
        url_pic: data.msg_Info.url_pic,
        url_title: data.msg_Info.url_title,
    };
    let publishRes = await publishShortMsg(pushInfo);
    if (!publishRes.success) return null;
    return publishRes.data;
}
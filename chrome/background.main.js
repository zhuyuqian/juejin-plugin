/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/pages/background/api/content.js":
/*!*********************************************!*\
  !*** ./src/pages/background/api/content.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getShortMsgList": () => (/* binding */ getShortMsgList),
/* harmony export */   "publishShortMsg": () => (/* binding */ publishShortMsg),
/* harmony export */   "removeShortMsg": () => (/* binding */ removeShortMsg)
/* harmony export */ });
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index */ "./src/pages/background/api/index.js");
// 内容相关


/*
* 删除沸点
* */
const removeShortMsg = msgId => (0,_index__WEBPACK_IMPORTED_MODULE_0__.ajax)({
  url: `https://api.juejin.cn/content_api/v1/short_msg/delete`,
  method: 'POST',
  data: {
    msg_id: msgId
  },
  isInclude: true
});

/*
* 获取用户沸点列表
* */
const getShortMsgList = ({
  userId,
  cursor = 0,
  sortType = 4,
  limit = 999
}) => (0,_index__WEBPACK_IMPORTED_MODULE_0__.ajax)({
  url: `https://api.juejin.cn/content_api/v1/short_msg/query_list`,
  method: 'POST',
  data: {
    user_id: userId,
    cursor: cursor.toString(),
    sort_type: sortType,
    limit: limit
  }
});

/*
* 发布沸点
* @param content 内容
* @param topicId 圈子id
* */
const publishShortMsg = (content, topicId = null) => (0,_index__WEBPACK_IMPORTED_MODULE_0__.ajax)({
  url: `https://api.juejin.cn/content_api/v1/short_msg/publish`,
  method: "POST",
  data: {
    content,
    topicId,
    sync_to_org: false
  },
  isInclude: true
});

/***/ }),

/***/ "./src/pages/background/api/index.js":
/*!*******************************************!*\
  !*** ./src/pages/background/api/index.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ajax": () => (/* binding */ ajax),
/* harmony export */   "handleApiResult": () => (/* binding */ handleApiResult)
/* harmony export */ });
const ajax = async ({
  url,
  method = 'GET',
  data,
  isInclude = false,
  headers = {
    "Content-Type": "application/json"
  }
}) => {
  let credentials = isInclude ? 'include' : 'omit';
  let res = await fetch(url, {
    method,
    credentials,
    headers,
    body: JSON.stringify(data)
  }).then(res => res.json()).catch(e => ({
    err_no: 1,
    err_msg: '接口出错'
  }));
  return handleApiResult(res);
};
const handleApiResult = apiRes => {
  return Object.assign({}, apiRes, {
    success: apiRes.err_no === 0
  });
};

/***/ }),

/***/ "./src/pages/background/api/interact.js":
/*!**********************************************!*\
  !*** ./src/pages/background/api/interact.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "cancelDigg": () => (/* binding */ cancelDigg),
/* harmony export */   "diggQueryPage": () => (/* binding */ diggQueryPage)
/* harmony export */ });
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index */ "./src/pages/background/api/index.js");


/*
* 获取点赞列表
* @param item_type 4：沸点
* @param sort_type 2：时间倒序
* */
const diggQueryPage = ({
  cursor = 0,
  item_type = 4,
  sort_type = 2,
  user_id
}) => (0,_index__WEBPACK_IMPORTED_MODULE_0__.ajax)({
  url: `https://api.juejin.cn/interact_api/v1/digg/query_page`,
  method: 'POST',
  data: {
    cursor: cursor.toString(),
    item_type,
    sort_type,
    user_id
  }
});

/*
* 取消点赞
* @param itemId id
* @param itemType 4：沸点
* */
const cancelDigg = (itemId, itemType) => (0,_index__WEBPACK_IMPORTED_MODULE_0__.ajax)({
  url: `https://api.juejin.cn/interact_api/v1/digg/cancel`,
  method: 'POST',
  data: {
    item_id: itemId,
    item_type: itemType
  },
  isInclude: true
});

/***/ }),

/***/ "./src/pages/background/api/message.js":
/*!*********************************************!*\
  !*** ./src/pages/background/api/message.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getNotReadMessageCount": () => (/* binding */ getNotReadMessageCount)
/* harmony export */ });
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index */ "./src/pages/background/api/index.js");
// 消息相关

const getNotReadMessageCount = () => (0,_index__WEBPACK_IMPORTED_MODULE_0__.ajax)({
  url: `https://api.juejin.cn/interact_api/v1/message/count`,
  isInclude: true
});

/***/ }),

/***/ "./src/pages/background/api/recommend.js":
/*!***********************************************!*\
  !*** ./src/pages/background/api/recommend.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getTopicShortMsgList": () => (/* binding */ getTopicShortMsgList)
/* harmony export */ });
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index */ "./src/pages/background/api/index.js");
/* harmony import */ var js_base64__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! js-base64 */ "./node_modules/_js-base64@3.7.5@js-base64/base64.mjs");



/*
* 获取沸点列表
* */
const getTopicShortMsgList = ({
  topic_id,
  cursor = 0,
  id_type = 4,
  limit = 459,
  sort_type = 500
}) => (0,_index__WEBPACK_IMPORTED_MODULE_0__.ajax)({
  url: `https://api.juejin.cn/recommend_api/v1/short_msg/topic`,
  method: "POST",
  data: {
    topic_id,
    cursor: (0,js_base64__WEBPACK_IMPORTED_MODULE_1__.encode)(JSON.stringify({
      v: "",
      i: cursor
    })),
    id_type,
    limit,
    sort_type
  }
});

/***/ }),

/***/ "./src/pages/background/api/tag.js":
/*!*****************************************!*\
  !*** ./src/pages/background/api/tag.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "queryTopicDetail": () => (/* binding */ queryTopicDetail)
/* harmony export */ });
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index */ "./src/pages/background/api/index.js");


/*
* 获取沸点圈子详情
* */

const queryTopicDetail = topicId => (0,_index__WEBPACK_IMPORTED_MODULE_0__.ajax)({
  url: `https://api.juejin.cn/tag_api/v1/query_topic_detail`,
  method: 'POST',
  data: {
    topic_id: topicId
  }
});

/***/ }),

/***/ "./src/pages/background/api/user.js":
/*!******************************************!*\
  !*** ./src/pages/background/api/user.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "checkIn": () => (/* binding */ checkIn),
/* harmony export */   "collectBug": () => (/* binding */ collectBug),
/* harmony export */   "drawLottery": () => (/* binding */ drawLottery),
/* harmony export */   "getDynamic": () => (/* binding */ getDynamic),
/* harmony export */   "getLotteryConfig": () => (/* binding */ getLotteryConfig),
/* harmony export */   "getNotCollectBug": () => (/* binding */ getNotCollectBug),
/* harmony export */   "getSelfInfo": () => (/* binding */ getSelfInfo),
/* harmony export */   "getUserInfo": () => (/* binding */ getUserInfo),
/* harmony export */   "logout": () => (/* binding */ logout)
/* harmony export */ });
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index */ "./src/pages/background/api/index.js");
// 用户相关


/*
* 用户登出
* */
const logout = () => (0,_index__WEBPACK_IMPORTED_MODULE_0__.ajax)({
  url: 'https://juejin.cn/passport/web/logout/',
  isInclude: true
});

/*
* 登录人获取自己的信息
* */
const getSelfInfo = () => (0,_index__WEBPACK_IMPORTED_MODULE_0__.ajax)({
  url: `https://api.juejin.cn/user_api/v1/user/get_info_pack`,
  method: 'POST',
  data: {
    pack_req: {
      user_counter: true,
      user_growth_info: true,
      user: true
    }
  },
  isInclude: true
});

/*
* 获取用户信息
* @param userId 用户id
* */
const getUserInfo = userId => (0,_index__WEBPACK_IMPORTED_MODULE_0__.ajax)({
  url: `https://api.juejin.cn/user_api/v1/user/get?user_id=${userId}`
});

/*
* 用户签到
* */
const checkIn = () => (0,_index__WEBPACK_IMPORTED_MODULE_0__.ajax)({
  url: 'https://api.juejin.cn/growth_api/v1/check_in',
  method: 'POST',
  isInclude: true
});

/*
* 获取未收集的bug
* */
const getNotCollectBug = () => (0,_index__WEBPACK_IMPORTED_MODULE_0__.ajax)({
  url: `https://api.juejin.cn/user_api/v1/bugfix/not_collect`,
  method: 'POST',
  headers: {},
  isInclude: true
});

/*
* 收集bug
* @param bug bug对象
* */
const collectBug = bug => (0,_index__WEBPACK_IMPORTED_MODULE_0__.ajax)({
  url: `https://api.juejin.cn/user_api/v1/bugfix/collect`,
  method: 'POST',
  data: bug,
  isInclude: true
});

/*
* 获取今日免费抽奖次数
* */
const getLotteryConfig = () => (0,_index__WEBPACK_IMPORTED_MODULE_0__.ajax)({
  url: `https://api.juejin.cn/growth_api/v1/lottery_config/get`,
  isInclude: true
});

/*
* 抽奖
* */
const drawLottery = () => (0,_index__WEBPACK_IMPORTED_MODULE_0__.ajax)({
  url: `https://api.juejin.cn/growth_api/v1/lottery/draw`,
  method: 'POST',
  isInclude: true
});

/*
* 获取用户动态
* @param userId 用户id
* @param cursor 偏移数
* */
const getDynamic = (userId, cursor) => (0,_index__WEBPACK_IMPORTED_MODULE_0__.ajax)({
  url: `https://api.juejin.cn/user_api/v1/user/dynamic?user_id=${userId}&cursor=${cursor}`
});

/***/ }),

/***/ "./src/pages/background/chrome.js":
/*!****************************************!*\
  !*** ./src/pages/background/chrome.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createContextMenu": () => (/* binding */ createContextMenu),
/* harmony export */   "createTab": () => (/* binding */ createTab),
/* harmony export */   "getStorage": () => (/* binding */ getStorage),
/* harmony export */   "queryTabs": () => (/* binding */ queryTabs),
/* harmony export */   "removeAllContextMenus": () => (/* binding */ removeAllContextMenus),
/* harmony export */   "sendBasicNotifications": () => (/* binding */ sendBasicNotifications),
/* harmony export */   "sendMessageToTab": () => (/* binding */ sendMessageToTab),
/* harmony export */   "setStorage": () => (/* binding */ setStorage),
/* harmony export */   "updateTab": () => (/* binding */ updateTab)
/* harmony export */ });
/* harmony import */ var dayjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! dayjs */ "./node_modules/dayjs/dayjs.min.js");
/* harmony import */ var dayjs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(dayjs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _tool__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../tool */ "./src/tool/index.js");



/*
* 设置缓存
* @param key 名称
* @param value 数据
* @param minute 缓存多少分钟，如果没有则永久缓存
* */
const setStorage = async (key, value, minute) => {
  let setTime = dayjs__WEBPACK_IMPORTED_MODULE_0___default()().format('YYYY-MM-DD HH:mm:ss');
  let overdueTime = minute !== undefined ? dayjs__WEBPACK_IMPORTED_MODULE_0___default()(setTime).add(minute, 'minute').format('YYYY-MM-DD HH:mm:ss') : null;
  let storage = {
    [key]: {
      value,
      setTime,
      overdueTime
    }
  };
  await chrome.storage.local.set(storage);
};

/*
* 获取缓存
* @param key 名称
* */
const getStorage = async key => {
  let storage = (await chrome.storage.local.get())[key];
  if (!storage) return null;
  // 如果结束时间存在 && 当前时间不在结束之间之前
  if (storage.overdueTime && !dayjs__WEBPACK_IMPORTED_MODULE_0___default()().isBefore(storage.overdueTime)) return null;
  return storage.value;
};

/*
* 发送桌面通知
* @param title 标题
* @param message 内容
* */
const sendBasicNotifications = (title, message) => {
  chrome.notifications.create((0,_tool__WEBPACK_IMPORTED_MODULE_1__.uuid)(), {
    type: 'basic',
    title,
    message,
    iconUrl: "static/img/icon.png"
  });
};

/*
* 创建tab
* @param tab 标签信息
* */
const createTab = tab => {
  return chrome.tabs.create(tab);
};

/*
* 查询tabs
* @param search 需要查询的条件
* */
const queryTabs = (search = {}) => {
  return chrome.tabs.query(search);
};

/*
* 修改tab
* @param tabId 标签id
* @param tab 标签信息
* */
const updateTab = (tabId, tab) => {
  return chrome.tabs.update(tabId, tab);
};

/*
* 给标签页发信息
* */
const sendMessageToTab = (tabId, info) => {
  return chrome.tabs.sendMessage(tabId, Object.assign(info, {
    from: 'background'
  }));
};

/*
* 创建菜单
* @param menu 按钮信息
* */
const createContextMenu = menu => {
  return chrome.contextMenus.create(menu);
};

/*
* 删除全部菜单
* */
const removeAllContextMenus = () => {
  return chrome.contextMenus.removeAll();
};

/***/ }),

/***/ "./src/pages/background/controller/contextMenus.js":
/*!*********************************************************!*\
  !*** ./src/pages/background/controller/contextMenus.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "contextMenusOnClick": () => (/* binding */ contextMenusOnClick),
/* harmony export */   "resetContextMenus": () => (/* binding */ resetContextMenus)
/* harmony export */ });
/* harmony import */ var _user__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./user */ "./src/pages/background/controller/user.js");
/* harmony import */ var _chrome__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../chrome */ "./src/pages/background/chrome.js");


let resetContextMenusIng = false;

/*
* 重置所有右键菜单
* */
const resetContextMenus = async () => {
  if (resetContextMenusIng) return;
  resetContextMenusIng = true;
  // 移除所有菜单
  await (0,_chrome__WEBPACK_IMPORTED_MODULE_1__.removeAllContextMenus)();
  // 获取用户信息
  let user = await (0,_user__WEBPACK_IMPORTED_MODULE_0__.getSelfStorage)();
  // 已登录
  if (user) {
    await (0,_chrome__WEBPACK_IMPORTED_MODULE_1__.createContextMenu)({
      id: "MENU_PARENT",
      title: `${user.user_basic.user_name}的掘金`,
      contexts: ["all"]
    });
    await (0,_chrome__WEBPACK_IMPORTED_MODULE_1__.createContextMenu)({
      id: "SELF_HOME",
      title: "我的主页",
      parentId: "MENU_PARENT",
      contexts: ["all"]
    });
    await (0,_chrome__WEBPACK_IMPORTED_MODULE_1__.createContextMenu)({
      id: "SELF_NOTIFICATION",
      title: "我的消息",
      parentId: "MENU_PARENT",
      contexts: ["all"]
    });
    await (0,_chrome__WEBPACK_IMPORTED_MODULE_1__.createContextMenu)({
      id: "separator1",
      type: "separator",
      parentId: "MENU_PARENT",
      contexts: ["all"]
    });
    await (0,_chrome__WEBPACK_IMPORTED_MODULE_1__.createContextMenu)({
      id: "SIGN_IN",
      title: "快速签到",
      parentId: "MENU_PARENT",
      contexts: ["all"]
    });
    await (0,_chrome__WEBPACK_IMPORTED_MODULE_1__.createContextMenu)({
      id: "BUG_FIX",
      title: "收集BUG",
      parentId: "MENU_PARENT",
      contexts: ["all"]
    });
    await (0,_chrome__WEBPACK_IMPORTED_MODULE_1__.createContextMenu)({
      id: 'FREE_LUCKY_DRAW',
      title: "免费抽奖",
      parentId: "MENU_PARENT",
      contexts: ["all"]
    });
    await (0,_chrome__WEBPACK_IMPORTED_MODULE_1__.createContextMenu)({
      id: "separator2",
      type: "separator",
      parentId: "MENU_PARENT",
      contexts: ["all"]
    });
    await (0,_chrome__WEBPACK_IMPORTED_MODULE_1__.createContextMenu)({
      id: "LOGOUT",
      title: "登出",
      parentId: "MENU_PARENT",
      contexts: ["all"]
    });
  } else {
    await (0,_chrome__WEBPACK_IMPORTED_MODULE_1__.createContextMenu)({
      id: "OPEN_JUEJIN",
      type: "normal",
      title: `掘金首页`,
      contexts: ["all"]
    });
  }
  resetContextMenusIng = false;
};

/*
*  菜单被点击
* */
const contextMenusOnClick = async (info, tab) => {
  let user = await (0,_user__WEBPACK_IMPORTED_MODULE_0__.getSelfStorage)();
  let {
    menuItemId
  } = info;
  let {
    windowId
  } = tab;
  if (menuItemId === "OPEN_JUEJIN") {
    // 打开掘金
    (0,_chrome__WEBPACK_IMPORTED_MODULE_1__.createTab)({
      url: `https://juejin.cn/`,
      selected: true,
      windowId
    });
  }
  if (menuItemId === "SELF_HOME") {
    // 我的主页
    await (0,_chrome__WEBPACK_IMPORTED_MODULE_1__.createTab)({
      url: `https://juejin.cn/user/${user.user_basic.user_id}`,
      selected: true,
      windowId
    });
  }
  if (menuItemId === "SELF_NOTIFICATION") {
    // 我的消息
    await (0,_chrome__WEBPACK_IMPORTED_MODULE_1__.createTab)({
      url: `https://juejin.cn/notification`,
      selected: true,
      windowId
    });
  }
  if (menuItemId === "LOGOUT") {
    // 登出
    await (0,_user__WEBPACK_IMPORTED_MODULE_0__.logout)();
  }
  if (menuItemId === "SIGN_IN") {
    // 签到
    await (0,_user__WEBPACK_IMPORTED_MODULE_0__.signin)();
  }
  if (menuItemId === "BUG_FIX") {
    // fixbug
    await (0,_user__WEBPACK_IMPORTED_MODULE_0__.bugfix)();
  }
  if (menuItemId === 'FREE_LUCKY_DRAW') {
    // 免费抽奖
    await (0,_user__WEBPACK_IMPORTED_MODULE_0__.freeLucky)();
  }
};

/***/ }),

/***/ "./src/pages/background/controller/message.js":
/*!****************************************************!*\
  !*** ./src/pages/background/controller/message.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "runtimeOnMessage": () => (/* binding */ runtimeOnMessage)
/* harmony export */ });
/* harmony import */ var _user__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./user */ "./src/pages/background/controller/user.js");
/* harmony import */ var _pin__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./pin */ "./src/pages/background/controller/pin.js");
// 消息相关




// 事件处理map
const eventHandleMap = {
  'get-self-info': () => (0,_user__WEBPACK_IMPORTED_MODULE_0__.getSelfStorage)(),
  // 获取个人信息
  'get-user-pins': data => (0,_pin__WEBPACK_IMPORTED_MODULE_1__.getUserPins)(data),
  // 获取用户沸点列表
  'remove-pin': data => (0,_pin__WEBPACK_IMPORTED_MODULE_1__.removePin)(data),
  // 删除沸点
  'get-pin-club-info': data => (0,_pin__WEBPACK_IMPORTED_MODULE_1__.getPinClubInfo)(data),
  // 获取沸点圈子详情
  'get-pin-club-day-user-rank': data => (0,_pin__WEBPACK_IMPORTED_MODULE_1__.getPinClubDayUserRank)(data),
  //获取圈子一周废物榜
  'get-user-zan-pins': data => (0,_pin__WEBPACK_IMPORTED_MODULE_1__.getUserZanPins)(data),
  // 获取用户点赞列表
  'cancel-zan-pin': data => (0,_pin__WEBPACK_IMPORTED_MODULE_1__.cancelZanPin)(data),
  // 取消沸点点赞
  'get-year-dynamic': data => (0,_user__WEBPACK_IMPORTED_MODULE_0__.getYearDynamic)(data),
  // 获取年度动态
  'get-random-text': data => (0,_pin__WEBPACK_IMPORTED_MODULE_1__.getRandomText)(data)
};
const handleOnMessage = async (event, data, callback) => {
  callback(await eventHandleMap[event](data));
};

/*
* 当页面发来了消息
* */
const runtimeOnMessage = (request, sender, sendResponse) => {
  let {
    to,
    event,
    data
  } = request;
  if (to !== 'background') return;
  handleOnMessage(event, data, sendResponse);
  return true;
};

/***/ }),

/***/ "./src/pages/background/controller/pin.js":
/*!************************************************!*\
  !*** ./src/pages/background/controller/pin.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "cancelZanPin": () => (/* binding */ cancelZanPin),
/* harmony export */   "getPinClubDayUserRank": () => (/* binding */ getPinClubDayUserRank),
/* harmony export */   "getPinClubInfo": () => (/* binding */ getPinClubInfo),
/* harmony export */   "getRandomText": () => (/* binding */ getRandomText),
/* harmony export */   "getUserPins": () => (/* binding */ getUserPins),
/* harmony export */   "getUserZanPins": () => (/* binding */ getUserZanPins),
/* harmony export */   "removePin": () => (/* binding */ removePin)
/* harmony export */ });
/* harmony import */ var _api_content__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../api/content */ "./src/pages/background/api/content.js");
/* harmony import */ var _api_tag__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../api/tag */ "./src/pages/background/api/tag.js");
/* harmony import */ var _api_recommend__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../api/recommend */ "./src/pages/background/api/recommend.js");
/* harmony import */ var _chrome__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../chrome */ "./src/pages/background/chrome.js");
/* harmony import */ var _user__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./user */ "./src/pages/background/controller/user.js");
/* harmony import */ var _tool__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../tool */ "./src/tool/index.js");
/* harmony import */ var _api_interact__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../api/interact */ "./src/pages/background/api/interact.js");
// 沸点相关








/*
* 获取用户沸点列表
* */
const getUserPins = async userId => {
  // 先获取数量
  let res = await (0,_api_content__WEBPACK_IMPORTED_MODULE_0__.getShortMsgList)({
    userId,
    limit: 1
  });
  if (!res.success) return [];
  res = await (0,_api_content__WEBPACK_IMPORTED_MODULE_0__.getShortMsgList)({
    userId,
    limit: res.count
  });
  return res.success ? res.data : [];
};

/*
* 删除沸点
* */
const removePin = async pin => {
  return await (0,_api_content__WEBPACK_IMPORTED_MODULE_0__.removeShortMsg)(pin.msg_id);
};

/*
* 获取用户点赞列表
* */
const getUserZanPins = async userId => {
  let {
    success,
    data,
    count
  } = await (0,_api_interact__WEBPACK_IMPORTED_MODULE_6__.diggQueryPage)({
    user_id: userId,
    item_type: 4
  });
  return success ? {
    pins: data,
    count: count
  } : {
    pins: [],
    count: 0
  };
};

/*
* 取消点赞
* */
const cancelZanPin = async pin => {
  let {
    success
  } = await (0,_api_interact__WEBPACK_IMPORTED_MODULE_6__.cancelDigg)(pin.msg_id, 4);
  return success;
};

/*
* 获取圈子详情
* 缓存7天
* */
const getPinClubInfo = async clubId => {
  let storageKey = `pin-club-info-${clubId}`;
  let storage = await (0,_chrome__WEBPACK_IMPORTED_MODULE_3__.getStorage)(storageKey);
  if (storage) return storage;
  let {
    success,
    data
  } = await (0,_api_tag__WEBPACK_IMPORTED_MODULE_1__.queryTopicDetail)(clubId);
  if (!success) return null;
  await (0,_chrome__WEBPACK_IMPORTED_MODULE_3__.setStorage)(storageKey, data, 60 * 24 * 7);
  return data;
};

/*
* 获取圈子当日废物榜
* @param clubId 圈子id
* @param isRefresh 是否需要更新缓存
* */
const getPinClubDayUserRank = async ({
  clubId,
  isRefresh
}) => {
  let storageKey = `pin-club-day-user-rank-${clubId}`;
  let storage = await (0,_chrome__WEBPACK_IMPORTED_MODULE_3__.getStorage)(storageKey);
  if (storage && !isRefresh) return storage;
  storage = {
    time: (0,_tool__WEBPACK_IMPORTED_MODULE_5__.dayjs)().format('YYYY-MM-DD HH:mm:ss'),
    rank: []
  };
  let topicList = [];
  for (let i = 0; i < 10; i++) {
    let {
      success,
      data
    } = await (0,_api_recommend__WEBPACK_IMPORTED_MODULE_2__.getTopicShortMsgList)({
      topic_id: clubId,
      limit: 100,
      cursor: 100 * i
    });
    await (0,_tool__WEBPACK_IMPORTED_MODULE_5__.sleep)(0.5);
    if (!success) break;
    let next = true;
    for (let msg of data) {
      if (msg.msg_Info.ctime * 1000 < (0,_tool__WEBPACK_IMPORTED_MODULE_5__.dayjs)().startOf('day').valueOf()) {
        next = false;
        break;
      } else {
        topicList.push(msg);
      }
    }
    if (!next) break;
  }
  let userMsgMap = {};
  let userInfoMap = {};
  for (let msg of topicList) {
    let {
      user_id
    } = msg.msg_Info;
    userMsgMap[user_id] ? userMsgMap[user_id].push(msg) : userMsgMap[user_id] = [msg];
    userInfoMap[user_id] = msg.author_user_info;
  }
  let users = [];
  for (let userId in userMsgMap) {
    users.push({
      userId,
      userInfo: userInfoMap[userId],
      msgCount: userMsgMap[userId].length
    });
  }
  users.sort((a, b) => b.msgCount - a.msgCount);
  let rank = [];
  for (let user of users) {
    if (!rank.length) {
      rank.push({
        msgCount: user.msgCount,
        users: [user]
      });
    } else {
      let {
        msgCount,
        users
      } = rank[rank.length - 1];
      if (user.msgCount === msgCount) {
        users.push(user);
      } else {
        if (rank.length < 3) {
          rank.push({
            msgCount: user.msgCount,
            users: [user]
          });
        } else {
          break;
        }
      }
    }
  }
  storage.rank = rank;
  let endTime = ((0,_tool__WEBPACK_IMPORTED_MODULE_5__.dayjs)().endOf('day').valueOf() - (0,_tool__WEBPACK_IMPORTED_MODULE_5__.dayjs)().valueOf()) / 1000 / 60;
  await (0,_chrome__WEBPACK_IMPORTED_MODULE_3__.setStorage)(storageKey, storage, endTime);
  return storage;
};

/*
* 获取随机文本
* */
const getRandomText = async clubName => {
  const appId = 'nhhhdemgpmhixsnv';
  const appSecret = 'Y296dDlVdVVhRnhucmJmUnhvRVY2UT09';
  let resStr = '';
  try {
    if (clubName.includes('搞笑')) {
      // 获取每日搞笑段子
      let {
        data: jokeInfo
      } = await fetch(`https://www.mxnzp.com/api/jokes/list?page=${(0,_tool__WEBPACK_IMPORTED_MODULE_5__.getRandInt)(1, 8715)}&app_id=${appId}&app_secret=${appSecret}`).then(res => res.json());
      if (jokeInfo && jokeInfo.list.length) {
        resStr += `${jokeInfo.list[(0,_tool__WEBPACK_IMPORTED_MODULE_5__.getRandInt)(0, jokeInfo.list.length - 1)].content}`;
      }
    } else if (clubName.includes('今日新鲜事')) {
      // 今日新鲜事
      // 先获取列表
      await (0,_tool__WEBPACK_IMPORTED_MODULE_5__.sleep)(1);
      let {
        data: typeList
      } = await fetch(`https://www.mxnzp.com/api/news/types?app_id=${appId}&app_secret=${appSecret}`).then(res => res.json());
      if (typeList && typeList.length) {
        let currentType = typeList[(0,_tool__WEBPACK_IMPORTED_MODULE_5__.getRandInt)(0, typeList.length - 1)];
        await (0,_tool__WEBPACK_IMPORTED_MODULE_5__.sleep)(1);
        // 获取详情
        let {
          data: newList
        } = await fetch(`https://www.mxnzp.com/api/news/list?typeId=${currentType.typeId}&page=1&app_id=${appId}&app_secret=${appSecret}`).then(res => res.json());
        if (newList && newList.length) {
          let currentNew = newList[(0,_tool__WEBPACK_IMPORTED_MODULE_5__.getRandInt)(0, newList.length - 1)];
          resStr += `${currentType.typeName}｜${currentNew.title}`;
        }
      }
    } else {
      // 其他
      await (0,_tool__WEBPACK_IMPORTED_MODULE_5__.sleep)(1);
      let {
        data: contentList
      } = await fetch(`https://www.mxnzp.com/api/daily_word/recommend?count=20&app_id=${appId}&app_secret=${appSecret}`).then(res => res.json());
      if (contentList && contentList.length) {
        resStr += `${contentList[(0, contentList.length - 1)].content}`;
      }
    }

    // 获取ip信息
    await (0,_tool__WEBPACK_IMPORTED_MODULE_5__.sleep)(1);
    let {
      data: ipInfo
    } = await fetch(`https://www.mxnzp.com/api/ip/self?app_id=${appId}&app_secret=${appSecret}`).then(res => res.json());
    if (ipInfo) {
      let {
        province,
        city
      } = ipInfo;
      await (0,_tool__WEBPACK_IMPORTED_MODULE_5__.sleep)(1);
      // 获取天气信息
      let {
        data: weatherInfo
      } = await fetch(` https://www.mxnzp.com/api/weather/current/${city}?app_id=${appId}&app_secret=${appSecret}`).then(res => res.json());
      if (weatherInfo) {
        resStr += `\n\n${weatherInfo.address}｜${weatherInfo.temp}｜${weatherInfo.weather}｜风向${weatherInfo.windDirection}｜风力${weatherInfo.windPower}｜湿度${weatherInfo.humidity}`;
      }
    }
    // 获取当日万年历
    // await sleep(1);
    // let { data: dayInfo } = await fetch(
    // 	`https://www.mxnzp.com/api/holiday/single/${dayjs().format('YYYYMMDD')}?app_id=${appId}&app_secret=${appSecret}`).then(res => res.json())
    // if (dayInfo) {
    // 	resStr += `\n${dayInfo.date}｜${dayInfo.yearTips}年｜${dayInfo.typeDes}｜农历${dayInfo.lunarCalendar}｜${dayInfo.solarTerms}`;
    // }
  } catch (e) {}
  return {
    success: true,
    data: resStr,
    err_msg: ''
  };
};

/***/ }),

/***/ "./src/pages/background/controller/tabs.js":
/*!*************************************************!*\
  !*** ./src/pages/background/controller/tabs.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "tabOnUpdate": () => (/* binding */ tabOnUpdate)
/* harmony export */ });
/* harmony import */ var _user__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./user */ "./src/pages/background/controller/user.js");
/* harmony import */ var _contextMenus__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./contextMenus */ "./src/pages/background/controller/contextMenus.js");
/* harmony import */ var _chrome__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../chrome */ "./src/pages/background/chrome.js");




/*
* 当标签页发生变化
* */
const tabOnUpdate = async (tabId, changeInfo, tab) => {
  // 是否完毕
  if (changeInfo.status !== "complete") return;
  // 调用未读消息循环
  (0,_user__WEBPACK_IMPORTED_MODULE_0__.loopNotReadMessageCount)();
  // 是否是掘金的标签页
  let isJueJin = tab.url.includes('juejin.cn');
  if (isJueJin) await (0,_user__WEBPACK_IMPORTED_MODULE_0__.resetSelf)();
  await (0,_contextMenus__WEBPACK_IMPORTED_MODULE_1__.resetContextMenus)();
  if (isJueJin) (0,_chrome__WEBPACK_IMPORTED_MODULE_2__.sendMessageToTab)(tabId, {
    event: "page-change-complete"
  });
};

/***/ }),

/***/ "./src/pages/background/controller/user.js":
/*!*************************************************!*\
  !*** ./src/pages/background/controller/user.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "bugfix": () => (/* binding */ bugfix),
/* harmony export */   "freeLucky": () => (/* binding */ freeLucky),
/* harmony export */   "getSelfStorage": () => (/* binding */ getSelfStorage),
/* harmony export */   "getUserInfo": () => (/* binding */ getUserInfo),
/* harmony export */   "getYearDynamic": () => (/* binding */ getYearDynamic),
/* harmony export */   "logout": () => (/* binding */ logout),
/* harmony export */   "loopNotReadMessageCount": () => (/* binding */ loopNotReadMessageCount),
/* harmony export */   "resetSelf": () => (/* binding */ resetSelf),
/* harmony export */   "setSelfStorage": () => (/* binding */ setSelfStorage),
/* harmony export */   "signin": () => (/* binding */ signin)
/* harmony export */ });
/* harmony import */ var _api_user__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../api/user */ "./src/pages/background/api/user.js");
/* harmony import */ var _chrome__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../chrome */ "./src/pages/background/chrome.js");
/* harmony import */ var _contextMenus__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./contextMenus */ "./src/pages/background/controller/contextMenus.js");
/* harmony import */ var _api_message__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../api/message */ "./src/pages/background/api/message.js");
/* harmony import */ var _tool__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../tool */ "./src/tool/index.js");
// 用户相关






/*
* 获取登录用户缓存
* */
const getSelfStorage = async () => {
  return await (0,_chrome__WEBPACK_IMPORTED_MODULE_1__.getStorage)('self-info');
};

/*
* 设置登录用户缓存
* */
const setSelfStorage = async storage => {
  await (0,_chrome__WEBPACK_IMPORTED_MODULE_1__.setStorage)('self-info', storage);
};

/*重置用户信息*/
const resetSelf = async () => {
  let {
    success,
    data
  } = await (0,_api_user__WEBPACK_IMPORTED_MODULE_0__.getSelfInfo)();
  if (!success) return setSelfStorage(null);
  await setSelfStorage(data);
  return data;
};

/*
* 获取用户信息
* 缓存7天
* */
const getUserInfo = async userId => {
  let storageKey = `user-info-${userId}`;
  let storage = await (0,_chrome__WEBPACK_IMPORTED_MODULE_1__.getStorage)(storageKey);
  if (storage) return storage;
  let {
    success,
    data
  } = await (0,_api_user__WEBPACK_IMPORTED_MODULE_0__.getUserInfo)(userId);
  if (!success) return null;
  await (0,_chrome__WEBPACK_IMPORTED_MODULE_1__.setStorage)(storageKey, data, 60 * 24 * 7);
  return data;
};

/*
* 获取年度用户动态列表
* @param userId 用户id
* @param isRefresh 是否获取最新，如果为否永远获取缓存
* */
const getYearDynamic = async ({
  userId,
  isRefresh
}) => {
  let storageKey = `year-dynamic-${userId}`;
  // 获取缓存
  let storage = await (0,_chrome__WEBPACK_IMPORTED_MODULE_1__.getStorage)(storageKey);
  if (storage && !isRefresh) return storage;
  storage = {
    count: 0,
    time: (0,_tool__WEBPACK_IMPORTED_MODULE_4__.dayjs)().format('YYYY-MM-DD HH:mm:ss'),
    info: {}
  };
  // 先获取总数
  let {
    success,
    data
  } = await (0,_api_user__WEBPACK_IMPORTED_MODULE_0__.getDynamic)(userId, 0);
  if (!success) return storage;
  // count是动态总数
  let {
    count,
    list
  } = data;
  storage.count = count;
  let dynamics = [...list];
  // 每份20个
  let cursors = new Array(Math.ceil(count / 20)).fill(null).map((item, index) => 20 * index);
  // 第一个已经获取过，移除
  cursors.shift();
  // 取出前30个
  cursors = cursors.splice(0, 20);
  // 开始并发请求
  let dynamicsRes = await Promise.all(cursors.map(cursor => (0,_api_user__WEBPACK_IMPORTED_MODULE_0__.getDynamic)(userId, cursor)));
  dynamicsRes.forEach(dynamicRes => {
    if (dynamicRes.success) {
      dynamics.push(...dynamicRes.data.list);
    }
  });
  // 开始处理数据
  for (let dynamic of dynamics) {
    let year = (0,_tool__WEBPACK_IMPORTED_MODULE_4__.dayjs)(dynamic.time * 1000).format('YYYY');
    let date = (0,_tool__WEBPACK_IMPORTED_MODULE_4__.dayjs)(dynamic.time * 1000).format('MM-DD');
    if (storage.info[year]) {
      if (storage.info[year][date]) {
        storage.info[year][date].push(dynamic.action);
      } else {
        storage.info[year][date] = [dynamic.action];
      }
    } else {
      storage.info[year] = {
        [date]: [dynamic.action]
      };
    }
  }
  await (0,_chrome__WEBPACK_IMPORTED_MODULE_1__.setStorage)(storageKey, storage);
  return storage;
};
let loopNotReadMessageCountInterVal = null;

/*
* 开始循环获取未读消息数
* */
const loopNotReadMessageCount = () => {
  if (loopNotReadMessageCountInterVal) return;
  loopNotReadMessageCountInterVal = setInterval(async () => {
    if (await getSelfStorage()) {
      let {
        success,
        data
      } = await (0,_api_message__WEBPACK_IMPORTED_MODULE_3__.getNotReadMessageCount)();
      if (!success) return;
      // count[1]：点赞和收藏  count[3]：评论
      let {
        count,
        total
      } = data;
      let items = [];
      if (count[1]) items.push(`赞和收藏：${count[1]}条`);
      if (count[3]) items.push(`评论：${count[3]}条`);
      if (count[7]) items.push(`私信：${count[3]}条`);
      let notReadStrStorage = await (0,_chrome__WEBPACK_IMPORTED_MODULE_1__.getStorage)("message-not-read");
      // 有未读且详情文字不相同
      if (total && notReadStrStorage !== JSON.stringify(items)) {
        (0,_chrome__WEBPACK_IMPORTED_MODULE_1__.sendBasicNotifications)(`您有${total}条掘金未读消息，以下为详细内容`, `${items.join('\n')}`);
      }
      await (0,_chrome__WEBPACK_IMPORTED_MODULE_1__.setStorage)("message-not-read", JSON.stringify(items));
    }
  }, 1000 * 10);
};

/*
* 用户登出
* 登出后刷新所有相关页面
* */
const logout = async () => {
  (0,_api_user__WEBPACK_IMPORTED_MODULE_0__.logout)();
  // 获取所有掘金相关页面
  let tabs = await (0,_chrome__WEBPACK_IMPORTED_MODULE_1__.queryTabs)({
    url: 'https://juejin.cn/*'
  });
  // 将登录用户缓存清空
  await setSelfStorage(null);
  // 重置菜单
  await (0,_contextMenus__WEBPACK_IMPORTED_MODULE_2__.resetContextMenus)();
  // 刷新页面
  for (let tab of tabs) {
    (0,_chrome__WEBPACK_IMPORTED_MODULE_1__.updateTab)(tab.id, {
      url: tab.url
    });
  }
};

/*
* 用户签到
* */
const signin = async () => {
  let {
    success,
    data,
    err_msg
  } = await (0,_api_user__WEBPACK_IMPORTED_MODULE_0__.checkIn)();
  (0,_chrome__WEBPACK_IMPORTED_MODULE_1__.sendBasicNotifications)("掘金签到：" + (success ? "成功" : "失败"), success ? `本次新增矿石：${data.incr_point}，当前矿石：${data.sum_point}` : err_msg);
};

/*
* 修复bug
* */
const bugfix = async () => {
  // 获取未修复bug
  let {
    success,
    data,
    err_msg
  } = await (0,_api_user__WEBPACK_IMPORTED_MODULE_0__.getNotCollectBug)();
  (0,_chrome__WEBPACK_IMPORTED_MODULE_1__.sendBasicNotifications)("掘金BugFix：" + (success ? "成功" : "失败"), success ? `今日掘金bugfix：${data.length}` : err_msg);
  if (!success) return;
  // 开始修复bug
  data.forEach(bug => (0,_api_user__WEBPACK_IMPORTED_MODULE_0__.collectBug)(bug));
};

/*
* 抽奖
* */
const freeLucky = async () => {
  // 获取今日免费抽奖次数
  let res = await (0,_api_user__WEBPACK_IMPORTED_MODULE_0__.getLotteryConfig)();
  if (!res.success) return (0,_chrome__WEBPACK_IMPORTED_MODULE_1__.sendBasicNotifications)('今日免费抽奖失败', res.err_msg);
  if (!res.data.free_count) return (0,_chrome__WEBPACK_IMPORTED_MODULE_1__.sendBasicNotifications)('今日免费抽奖失败', '今日免费抽奖次数已经用完');
  // 开始抽奖
  res = await (0,_api_user__WEBPACK_IMPORTED_MODULE_0__.drawLottery)();
  if (!res.success) return (0,_chrome__WEBPACK_IMPORTED_MODULE_1__.sendBasicNotifications)('今日免费抽奖失败', res.err_msg);
  (0,_chrome__WEBPACK_IMPORTED_MODULE_1__.sendBasicNotifications)('今日免费抽奖成功', `恭喜抽到：${res.data.lottery_name}`);
};

/***/ }),

/***/ "./src/tool/index.js":
/*!***************************!*\
  !*** ./src/tool/index.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "dayjs": () => (/* binding */ dayjs),
/* harmony export */   "getDynamicActionsCount": () => (/* binding */ getDynamicActionsCount),
/* harmony export */   "getDynamicScoreByActions": () => (/* binding */ getDynamicScoreByActions),
/* harmony export */   "getRandInt": () => (/* binding */ getRandInt),
/* harmony export */   "sleep": () => (/* binding */ sleep),
/* harmony export */   "uuid": () => (/* binding */ uuid)
/* harmony export */ });
/* harmony import */ var dayjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! dayjs */ "./node_modules/dayjs/dayjs.min.js");
/* harmony import */ var dayjs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(dayjs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var dayjs_plugin_weekday__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! dayjs/plugin/weekday */ "./node_modules/dayjs/plugin/weekday.js");
/* harmony import */ var dayjs_plugin_weekday__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(dayjs_plugin_weekday__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var dayjs_plugin_relativeTime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! dayjs/plugin/relativeTime */ "./node_modules/dayjs/plugin/relativeTime.js");
/* harmony import */ var dayjs_plugin_relativeTime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(dayjs_plugin_relativeTime__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var dayjs_locale_zh_cn__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! dayjs/locale/zh-cn */ "./node_modules/dayjs/locale/zh-cn.js");
/* harmony import */ var dayjs_locale_zh_cn__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(dayjs_locale_zh_cn__WEBPACK_IMPORTED_MODULE_3__);




dayjs__WEBPACK_IMPORTED_MODULE_0___default().extend((dayjs_plugin_weekday__WEBPACK_IMPORTED_MODULE_1___default()));
dayjs__WEBPACK_IMPORTED_MODULE_0___default().extend((dayjs_plugin_relativeTime__WEBPACK_IMPORTED_MODULE_2___default()));
dayjs__WEBPACK_IMPORTED_MODULE_0___default().locale('zh-cn');
const dayjs = (dayjs__WEBPACK_IMPORTED_MODULE_0___default());

/*
* 获取uuid
* */
const uuid = () => {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr(s[19] & 0x3 | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";
  var uuid = s.join("");
  return uuid;
};

/*
* 睡眠函数
* */
const sleep = x => {
  return new Promise(res => {
    setTimeout(() => {
      res();
    }, x * 1000);
  });
};

/*
* 获取掘金动态分数计算
* 0：发布文章
* 1：点赞文章
* 2：发布沸点
* 3：点赞沸点
* 4、关注用户
* 5、关注标签
* */
const getDynamicScoreByActions = actions => {
  if (!actions.length) return 0;
  let score = 0;
  actions.forEach(action => {
    if (action === 0) score += 70;
    if (action === 1) score += 20;
    if (action === 2) score += 10;
    if (action === 3) score += 5;
    if (action === 4) score += 10;
  });
  // 活跃度等级
  // Lv0 —— 活跃度 0
  // Lv1 —— 活跃度 [1, 20)
  // Lv2 —— 活跃度 [20, 60)
  // Lv3 —— 活跃度 [60, 80)
  // Lv4 —— 活跃度 [80, 100)
  return Math.min(score, 100);
};
const getDynamicActionsCount = actions => {
  if (!actions.length) return {};
  let count = {};
  actions.forEach(action => {
    count[action] ? count[action]++ : count[action] = 1;
  });
  return count;
};

/**
 * 生成指定范围的随机整数
 * @param min
 * @param max
 * @param type
 * @returns int
 */
const getRandInt = (min, max, type) => {
  type = type || 3;
  min = Math.ceil(min);
  max = Math.floor(max);
  switch (type) {
    case 1:
      //得到一个两数之间的随机整数,这个值不小于min（如果min不是整数的话，得到一个向上取整的 min），并且小于（但不等于）max  [min,max)
      return Math.floor(Math.random() * (max - min)) + min;
    case 2:
      //得到一个两数之间的随机整数，包括两个数在内,这个值比min大（如果min不是整数，那就不小于比min大的整数），但小于（但不等于）max [min,max]
      return Math.floor(Math.random() * (max - min + 1)) + min;
    case 3:
      //得到一个两数之间的随机整数， (min,max)
      return Math.floor(Math.random() * (max - min - 1)) + min + 1;
  }
};

/***/ }),

/***/ "./node_modules/dayjs/dayjs.min.js":
/*!*****************************************!*\
  !*** ./node_modules/dayjs/dayjs.min.js ***!
  \*****************************************/
/***/ (function(module) {

!function(t,e){ true?module.exports=e():0}(this,(function(){"use strict";var t=1e3,e=6e4,n=36e5,r="millisecond",i="second",s="minute",u="hour",a="day",o="week",f="month",h="quarter",c="year",d="date",l="Invalid Date",$=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,y=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,M={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(t){var e=["th","st","nd","rd"],n=t%100;return"["+t+(e[(n-20)%10]||e[n]||e[0])+"]"}},m=function(t,e,n){var r=String(t);return!r||r.length>=e?t:""+Array(e+1-r.length).join(n)+t},v={s:m,z:function(t){var e=-t.utcOffset(),n=Math.abs(e),r=Math.floor(n/60),i=n%60;return(e<=0?"+":"-")+m(r,2,"0")+":"+m(i,2,"0")},m:function t(e,n){if(e.date()<n.date())return-t(n,e);var r=12*(n.year()-e.year())+(n.month()-e.month()),i=e.clone().add(r,f),s=n-i<0,u=e.clone().add(r+(s?-1:1),f);return+(-(r+(n-i)/(s?i-u:u-i))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(t){return{M:f,y:c,w:o,d:a,D:d,h:u,m:s,s:i,ms:r,Q:h}[t]||String(t||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},g="en",D={};D[g]=M;var p=function(t){return t instanceof _},S=function t(e,n,r){var i;if(!e)return g;if("string"==typeof e){var s=e.toLowerCase();D[s]&&(i=s),n&&(D[s]=n,i=s);var u=e.split("-");if(!i&&u.length>1)return t(u[0])}else{var a=e.name;D[a]=e,i=a}return!r&&i&&(g=i),i||!r&&g},w=function(t,e){if(p(t))return t.clone();var n="object"==typeof e?e:{};return n.date=t,n.args=arguments,new _(n)},O=v;O.l=S,O.i=p,O.w=function(t,e){return w(t,{locale:e.$L,utc:e.$u,x:e.$x,$offset:e.$offset})};var _=function(){function M(t){this.$L=S(t.locale,null,!0),this.parse(t)}var m=M.prototype;return m.parse=function(t){this.$d=function(t){var e=t.date,n=t.utc;if(null===e)return new Date(NaN);if(O.u(e))return new Date;if(e instanceof Date)return new Date(e);if("string"==typeof e&&!/Z$/i.test(e)){var r=e.match($);if(r){var i=r[2]-1||0,s=(r[7]||"0").substring(0,3);return n?new Date(Date.UTC(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)):new Date(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)}}return new Date(e)}(t),this.$x=t.x||{},this.init()},m.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds()},m.$utils=function(){return O},m.isValid=function(){return!(this.$d.toString()===l)},m.isSame=function(t,e){var n=w(t);return this.startOf(e)<=n&&n<=this.endOf(e)},m.isAfter=function(t,e){return w(t)<this.startOf(e)},m.isBefore=function(t,e){return this.endOf(e)<w(t)},m.$g=function(t,e,n){return O.u(t)?this[e]:this.set(n,t)},m.unix=function(){return Math.floor(this.valueOf()/1e3)},m.valueOf=function(){return this.$d.getTime()},m.startOf=function(t,e){var n=this,r=!!O.u(e)||e,h=O.p(t),l=function(t,e){var i=O.w(n.$u?Date.UTC(n.$y,e,t):new Date(n.$y,e,t),n);return r?i:i.endOf(a)},$=function(t,e){return O.w(n.toDate()[t].apply(n.toDate("s"),(r?[0,0,0,0]:[23,59,59,999]).slice(e)),n)},y=this.$W,M=this.$M,m=this.$D,v="set"+(this.$u?"UTC":"");switch(h){case c:return r?l(1,0):l(31,11);case f:return r?l(1,M):l(0,M+1);case o:var g=this.$locale().weekStart||0,D=(y<g?y+7:y)-g;return l(r?m-D:m+(6-D),M);case a:case d:return $(v+"Hours",0);case u:return $(v+"Minutes",1);case s:return $(v+"Seconds",2);case i:return $(v+"Milliseconds",3);default:return this.clone()}},m.endOf=function(t){return this.startOf(t,!1)},m.$set=function(t,e){var n,o=O.p(t),h="set"+(this.$u?"UTC":""),l=(n={},n[a]=h+"Date",n[d]=h+"Date",n[f]=h+"Month",n[c]=h+"FullYear",n[u]=h+"Hours",n[s]=h+"Minutes",n[i]=h+"Seconds",n[r]=h+"Milliseconds",n)[o],$=o===a?this.$D+(e-this.$W):e;if(o===f||o===c){var y=this.clone().set(d,1);y.$d[l]($),y.init(),this.$d=y.set(d,Math.min(this.$D,y.daysInMonth())).$d}else l&&this.$d[l]($);return this.init(),this},m.set=function(t,e){return this.clone().$set(t,e)},m.get=function(t){return this[O.p(t)]()},m.add=function(r,h){var d,l=this;r=Number(r);var $=O.p(h),y=function(t){var e=w(l);return O.w(e.date(e.date()+Math.round(t*r)),l)};if($===f)return this.set(f,this.$M+r);if($===c)return this.set(c,this.$y+r);if($===a)return y(1);if($===o)return y(7);var M=(d={},d[s]=e,d[u]=n,d[i]=t,d)[$]||1,m=this.$d.getTime()+r*M;return O.w(m,this)},m.subtract=function(t,e){return this.add(-1*t,e)},m.format=function(t){var e=this,n=this.$locale();if(!this.isValid())return n.invalidDate||l;var r=t||"YYYY-MM-DDTHH:mm:ssZ",i=O.z(this),s=this.$H,u=this.$m,a=this.$M,o=n.weekdays,f=n.months,h=function(t,n,i,s){return t&&(t[n]||t(e,r))||i[n].slice(0,s)},c=function(t){return O.s(s%12||12,t,"0")},d=n.meridiem||function(t,e,n){var r=t<12?"AM":"PM";return n?r.toLowerCase():r},$={YY:String(this.$y).slice(-2),YYYY:this.$y,M:a+1,MM:O.s(a+1,2,"0"),MMM:h(n.monthsShort,a,f,3),MMMM:h(f,a),D:this.$D,DD:O.s(this.$D,2,"0"),d:String(this.$W),dd:h(n.weekdaysMin,this.$W,o,2),ddd:h(n.weekdaysShort,this.$W,o,3),dddd:o[this.$W],H:String(s),HH:O.s(s,2,"0"),h:c(1),hh:c(2),a:d(s,u,!0),A:d(s,u,!1),m:String(u),mm:O.s(u,2,"0"),s:String(this.$s),ss:O.s(this.$s,2,"0"),SSS:O.s(this.$ms,3,"0"),Z:i};return r.replace(y,(function(t,e){return e||$[t]||i.replace(":","")}))},m.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},m.diff=function(r,d,l){var $,y=O.p(d),M=w(r),m=(M.utcOffset()-this.utcOffset())*e,v=this-M,g=O.m(this,M);return g=($={},$[c]=g/12,$[f]=g,$[h]=g/3,$[o]=(v-m)/6048e5,$[a]=(v-m)/864e5,$[u]=v/n,$[s]=v/e,$[i]=v/t,$)[y]||v,l?g:O.a(g)},m.daysInMonth=function(){return this.endOf(f).$D},m.$locale=function(){return D[this.$L]},m.locale=function(t,e){if(!t)return this.$L;var n=this.clone(),r=S(t,e,!0);return r&&(n.$L=r),n},m.clone=function(){return O.w(this.$d,this)},m.toDate=function(){return new Date(this.valueOf())},m.toJSON=function(){return this.isValid()?this.toISOString():null},m.toISOString=function(){return this.$d.toISOString()},m.toString=function(){return this.$d.toUTCString()},M}(),T=_.prototype;return w.prototype=T,[["$ms",r],["$s",i],["$m",s],["$H",u],["$W",a],["$M",f],["$y",c],["$D",d]].forEach((function(t){T[t[1]]=function(e){return this.$g(e,t[0],t[1])}})),w.extend=function(t,e){return t.$i||(t(e,_,w),t.$i=!0),w},w.locale=S,w.isDayjs=p,w.unix=function(t){return w(1e3*t)},w.en=D[g],w.Ls=D,w.p={},w}));

/***/ }),

/***/ "./node_modules/dayjs/locale/zh-cn.js":
/*!********************************************!*\
  !*** ./node_modules/dayjs/locale/zh-cn.js ***!
  \********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

!function(e,_){ true?module.exports=_(__webpack_require__(/*! dayjs */ "./node_modules/dayjs/dayjs.min.js")):0}(this,(function(e){"use strict";function _(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var t=_(e),d={name:"zh-cn",weekdays:"星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),weekdaysShort:"周日_周一_周二_周三_周四_周五_周六".split("_"),weekdaysMin:"日_一_二_三_四_五_六".split("_"),months:"一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),monthsShort:"1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),ordinal:function(e,_){return"W"===_?e+"周":e+"日"},weekStart:1,yearStart:4,formats:{LT:"HH:mm",LTS:"HH:mm:ss",L:"YYYY/MM/DD",LL:"YYYY年M月D日",LLL:"YYYY年M月D日Ah点mm分",LLLL:"YYYY年M月D日ddddAh点mm分",l:"YYYY/M/D",ll:"YYYY年M月D日",lll:"YYYY年M月D日 HH:mm",llll:"YYYY年M月D日dddd HH:mm"},relativeTime:{future:"%s内",past:"%s前",s:"几秒",m:"1 分钟",mm:"%d 分钟",h:"1 小时",hh:"%d 小时",d:"1 天",dd:"%d 天",M:"1 个月",MM:"%d 个月",y:"1 年",yy:"%d 年"},meridiem:function(e,_){var t=100*e+_;return t<600?"凌晨":t<900?"早上":t<1100?"上午":t<1300?"中午":t<1800?"下午":"晚上"}};return t.default.locale(d,null,!0),d}));

/***/ }),

/***/ "./node_modules/dayjs/plugin/relativeTime.js":
/*!***************************************************!*\
  !*** ./node_modules/dayjs/plugin/relativeTime.js ***!
  \***************************************************/
/***/ (function(module) {

!function(r,e){ true?module.exports=e():0}(this,(function(){"use strict";return function(r,e,t){r=r||{};var n=e.prototype,o={future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"};function i(r,e,t,o){return n.fromToBase(r,e,t,o)}t.en.relativeTime=o,n.fromToBase=function(e,n,i,d,u){for(var f,a,s,l=i.$locale().relativeTime||o,h=r.thresholds||[{l:"s",r:44,d:"second"},{l:"m",r:89},{l:"mm",r:44,d:"minute"},{l:"h",r:89},{l:"hh",r:21,d:"hour"},{l:"d",r:35},{l:"dd",r:25,d:"day"},{l:"M",r:45},{l:"MM",r:10,d:"month"},{l:"y",r:17},{l:"yy",d:"year"}],m=h.length,c=0;c<m;c+=1){var y=h[c];y.d&&(f=d?t(e).diff(i,y.d,!0):i.diff(e,y.d,!0));var p=(r.rounding||Math.round)(Math.abs(f));if(s=f>0,p<=y.r||!y.r){p<=1&&c>0&&(y=h[c-1]);var v=l[y.l];u&&(p=u(""+p)),a="string"==typeof v?v.replace("%d",p):v(p,n,y.l,s);break}}if(n)return a;var M=s?l.future:l.past;return"function"==typeof M?M(a):M.replace("%s",a)},n.to=function(r,e){return i(r,e,this,!0)},n.from=function(r,e){return i(r,e,this)};var d=function(r){return r.$u?t.utc():t()};n.toNow=function(r){return this.to(d(this),r)},n.fromNow=function(r){return this.from(d(this),r)}}}));

/***/ }),

/***/ "./node_modules/dayjs/plugin/weekday.js":
/*!**********************************************!*\
  !*** ./node_modules/dayjs/plugin/weekday.js ***!
  \**********************************************/
/***/ (function(module) {

!function(e,t){ true?module.exports=t():0}(this,(function(){"use strict";return function(e,t){t.prototype.weekday=function(e){var t=this.$locale().weekStart||0,i=this.$W,n=(i<t?i+7:i)-t;return this.$utils().u(e)?n:this.subtract(n,"day").add(e,"day")}}}));

/***/ }),

/***/ "./node_modules/_js-base64@3.7.5@js-base64/base64.mjs":
/*!************************************************************!*\
  !*** ./node_modules/_js-base64@3.7.5@js-base64/base64.mjs ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Base64": () => (/* binding */ gBase64),
/* harmony export */   "VERSION": () => (/* binding */ VERSION),
/* harmony export */   "atob": () => (/* binding */ _atob),
/* harmony export */   "atobPolyfill": () => (/* binding */ atobPolyfill),
/* harmony export */   "btoa": () => (/* binding */ _btoa),
/* harmony export */   "btoaPolyfill": () => (/* binding */ btoaPolyfill),
/* harmony export */   "btou": () => (/* binding */ btou),
/* harmony export */   "decode": () => (/* binding */ decode),
/* harmony export */   "encode": () => (/* binding */ encode),
/* harmony export */   "encodeURI": () => (/* binding */ encodeURI),
/* harmony export */   "encodeURL": () => (/* binding */ encodeURI),
/* harmony export */   "extendBuiltins": () => (/* binding */ extendBuiltins),
/* harmony export */   "extendString": () => (/* binding */ extendString),
/* harmony export */   "extendUint8Array": () => (/* binding */ extendUint8Array),
/* harmony export */   "fromBase64": () => (/* binding */ decode),
/* harmony export */   "fromUint8Array": () => (/* binding */ fromUint8Array),
/* harmony export */   "isValid": () => (/* binding */ isValid),
/* harmony export */   "toBase64": () => (/* binding */ encode),
/* harmony export */   "toUint8Array": () => (/* binding */ toUint8Array),
/* harmony export */   "utob": () => (/* binding */ utob),
/* harmony export */   "version": () => (/* binding */ version)
/* harmony export */ });
/**
 *  base64.ts
 *
 *  Licensed under the BSD 3-Clause License.
 *    http://opensource.org/licenses/BSD-3-Clause
 *
 *  References:
 *    http://en.wikipedia.org/wiki/Base64
 *
 * @author Dan Kogai (https://github.com/dankogai)
 */
const version = '3.7.5';
/**
 * @deprecated use lowercase `version`.
 */
const VERSION = version;
const _hasatob = typeof atob === 'function';
const _hasbtoa = typeof btoa === 'function';
const _hasBuffer = typeof Buffer === 'function';
const _TD = typeof TextDecoder === 'function' ? new TextDecoder() : undefined;
const _TE = typeof TextEncoder === 'function' ? new TextEncoder() : undefined;
const b64ch = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
const b64chs = Array.prototype.slice.call(b64ch);
const b64tab = ((a) => {
    let tab = {};
    a.forEach((c, i) => tab[c] = i);
    return tab;
})(b64chs);
const b64re = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;
const _fromCC = String.fromCharCode.bind(String);
const _U8Afrom = typeof Uint8Array.from === 'function'
    ? Uint8Array.from.bind(Uint8Array)
    : (it) => new Uint8Array(Array.prototype.slice.call(it, 0));
const _mkUriSafe = (src) => src
    .replace(/=/g, '').replace(/[+\/]/g, (m0) => m0 == '+' ? '-' : '_');
const _tidyB64 = (s) => s.replace(/[^A-Za-z0-9\+\/]/g, '');
/**
 * polyfill version of `btoa`
 */
const btoaPolyfill = (bin) => {
    // console.log('polyfilled');
    let u32, c0, c1, c2, asc = '';
    const pad = bin.length % 3;
    for (let i = 0; i < bin.length;) {
        if ((c0 = bin.charCodeAt(i++)) > 255 ||
            (c1 = bin.charCodeAt(i++)) > 255 ||
            (c2 = bin.charCodeAt(i++)) > 255)
            throw new TypeError('invalid character found');
        u32 = (c0 << 16) | (c1 << 8) | c2;
        asc += b64chs[u32 >> 18 & 63]
            + b64chs[u32 >> 12 & 63]
            + b64chs[u32 >> 6 & 63]
            + b64chs[u32 & 63];
    }
    return pad ? asc.slice(0, pad - 3) + "===".substring(pad) : asc;
};
/**
 * does what `window.btoa` of web browsers do.
 * @param {String} bin binary string
 * @returns {string} Base64-encoded string
 */
const _btoa = _hasbtoa ? (bin) => btoa(bin)
    : _hasBuffer ? (bin) => Buffer.from(bin, 'binary').toString('base64')
        : btoaPolyfill;
const _fromUint8Array = _hasBuffer
    ? (u8a) => Buffer.from(u8a).toString('base64')
    : (u8a) => {
        // cf. https://stackoverflow.com/questions/12710001/how-to-convert-uint8-array-to-base64-encoded-string/12713326#12713326
        const maxargs = 0x1000;
        let strs = [];
        for (let i = 0, l = u8a.length; i < l; i += maxargs) {
            strs.push(_fromCC.apply(null, u8a.subarray(i, i + maxargs)));
        }
        return _btoa(strs.join(''));
    };
/**
 * converts a Uint8Array to a Base64 string.
 * @param {boolean} [urlsafe] URL-and-filename-safe a la RFC4648 §5
 * @returns {string} Base64 string
 */
const fromUint8Array = (u8a, urlsafe = false) => urlsafe ? _mkUriSafe(_fromUint8Array(u8a)) : _fromUint8Array(u8a);
// This trick is found broken https://github.com/dankogai/js-base64/issues/130
// const utob = (src: string) => unescape(encodeURIComponent(src));
// reverting good old fationed regexp
const cb_utob = (c) => {
    if (c.length < 2) {
        var cc = c.charCodeAt(0);
        return cc < 0x80 ? c
            : cc < 0x800 ? (_fromCC(0xc0 | (cc >>> 6))
                + _fromCC(0x80 | (cc & 0x3f)))
                : (_fromCC(0xe0 | ((cc >>> 12) & 0x0f))
                    + _fromCC(0x80 | ((cc >>> 6) & 0x3f))
                    + _fromCC(0x80 | (cc & 0x3f)));
    }
    else {
        var cc = 0x10000
            + (c.charCodeAt(0) - 0xD800) * 0x400
            + (c.charCodeAt(1) - 0xDC00);
        return (_fromCC(0xf0 | ((cc >>> 18) & 0x07))
            + _fromCC(0x80 | ((cc >>> 12) & 0x3f))
            + _fromCC(0x80 | ((cc >>> 6) & 0x3f))
            + _fromCC(0x80 | (cc & 0x3f)));
    }
};
const re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
/**
 * @deprecated should have been internal use only.
 * @param {string} src UTF-8 string
 * @returns {string} UTF-16 string
 */
const utob = (u) => u.replace(re_utob, cb_utob);
//
const _encode = _hasBuffer
    ? (s) => Buffer.from(s, 'utf8').toString('base64')
    : _TE
        ? (s) => _fromUint8Array(_TE.encode(s))
        : (s) => _btoa(utob(s));
/**
 * converts a UTF-8-encoded string to a Base64 string.
 * @param {boolean} [urlsafe] if `true` make the result URL-safe
 * @returns {string} Base64 string
 */
const encode = (src, urlsafe = false) => urlsafe
    ? _mkUriSafe(_encode(src))
    : _encode(src);
/**
 * converts a UTF-8-encoded string to URL-safe Base64 RFC4648 §5.
 * @returns {string} Base64 string
 */
const encodeURI = (src) => encode(src, true);
// This trick is found broken https://github.com/dankogai/js-base64/issues/130
// const btou = (src: string) => decodeURIComponent(escape(src));
// reverting good old fationed regexp
const re_btou = /[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}/g;
const cb_btou = (cccc) => {
    switch (cccc.length) {
        case 4:
            var cp = ((0x07 & cccc.charCodeAt(0)) << 18)
                | ((0x3f & cccc.charCodeAt(1)) << 12)
                | ((0x3f & cccc.charCodeAt(2)) << 6)
                | (0x3f & cccc.charCodeAt(3)), offset = cp - 0x10000;
            return (_fromCC((offset >>> 10) + 0xD800)
                + _fromCC((offset & 0x3FF) + 0xDC00));
        case 3:
            return _fromCC(((0x0f & cccc.charCodeAt(0)) << 12)
                | ((0x3f & cccc.charCodeAt(1)) << 6)
                | (0x3f & cccc.charCodeAt(2)));
        default:
            return _fromCC(((0x1f & cccc.charCodeAt(0)) << 6)
                | (0x3f & cccc.charCodeAt(1)));
    }
};
/**
 * @deprecated should have been internal use only.
 * @param {string} src UTF-16 string
 * @returns {string} UTF-8 string
 */
const btou = (b) => b.replace(re_btou, cb_btou);
/**
 * polyfill version of `atob`
 */
const atobPolyfill = (asc) => {
    // console.log('polyfilled');
    asc = asc.replace(/\s+/g, '');
    if (!b64re.test(asc))
        throw new TypeError('malformed base64.');
    asc += '=='.slice(2 - (asc.length & 3));
    let u24, bin = '', r1, r2;
    for (let i = 0; i < asc.length;) {
        u24 = b64tab[asc.charAt(i++)] << 18
            | b64tab[asc.charAt(i++)] << 12
            | (r1 = b64tab[asc.charAt(i++)]) << 6
            | (r2 = b64tab[asc.charAt(i++)]);
        bin += r1 === 64 ? _fromCC(u24 >> 16 & 255)
            : r2 === 64 ? _fromCC(u24 >> 16 & 255, u24 >> 8 & 255)
                : _fromCC(u24 >> 16 & 255, u24 >> 8 & 255, u24 & 255);
    }
    return bin;
};
/**
 * does what `window.atob` of web browsers do.
 * @param {String} asc Base64-encoded string
 * @returns {string} binary string
 */
const _atob = _hasatob ? (asc) => atob(_tidyB64(asc))
    : _hasBuffer ? (asc) => Buffer.from(asc, 'base64').toString('binary')
        : atobPolyfill;
//
const _toUint8Array = _hasBuffer
    ? (a) => _U8Afrom(Buffer.from(a, 'base64'))
    : (a) => _U8Afrom(_atob(a).split('').map(c => c.charCodeAt(0)));
/**
 * converts a Base64 string to a Uint8Array.
 */
const toUint8Array = (a) => _toUint8Array(_unURI(a));
//
const _decode = _hasBuffer
    ? (a) => Buffer.from(a, 'base64').toString('utf8')
    : _TD
        ? (a) => _TD.decode(_toUint8Array(a))
        : (a) => btou(_atob(a));
const _unURI = (a) => _tidyB64(a.replace(/[-_]/g, (m0) => m0 == '-' ? '+' : '/'));
/**
 * converts a Base64 string to a UTF-8 string.
 * @param {String} src Base64 string.  Both normal and URL-safe are supported
 * @returns {string} UTF-8 string
 */
const decode = (src) => _decode(_unURI(src));
/**
 * check if a value is a valid Base64 string
 * @param {String} src a value to check
  */
const isValid = (src) => {
    if (typeof src !== 'string')
        return false;
    const s = src.replace(/\s+/g, '').replace(/={0,2}$/, '');
    return !/[^\s0-9a-zA-Z\+/]/.test(s) || !/[^\s0-9a-zA-Z\-_]/.test(s);
};
//
const _noEnum = (v) => {
    return {
        value: v, enumerable: false, writable: true, configurable: true
    };
};
/**
 * extend String.prototype with relevant methods
 */
const extendString = function () {
    const _add = (name, body) => Object.defineProperty(String.prototype, name, _noEnum(body));
    _add('fromBase64', function () { return decode(this); });
    _add('toBase64', function (urlsafe) { return encode(this, urlsafe); });
    _add('toBase64URI', function () { return encode(this, true); });
    _add('toBase64URL', function () { return encode(this, true); });
    _add('toUint8Array', function () { return toUint8Array(this); });
};
/**
 * extend Uint8Array.prototype with relevant methods
 */
const extendUint8Array = function () {
    const _add = (name, body) => Object.defineProperty(Uint8Array.prototype, name, _noEnum(body));
    _add('toBase64', function (urlsafe) { return fromUint8Array(this, urlsafe); });
    _add('toBase64URI', function () { return fromUint8Array(this, true); });
    _add('toBase64URL', function () { return fromUint8Array(this, true); });
};
/**
 * extend Builtin prototypes with relevant methods
 */
const extendBuiltins = () => {
    extendString();
    extendUint8Array();
};
const gBase64 = {
    version: version,
    VERSION: VERSION,
    atob: _atob,
    atobPolyfill: atobPolyfill,
    btoa: _btoa,
    btoaPolyfill: btoaPolyfill,
    fromBase64: decode,
    toBase64: encode,
    encode: encode,
    encodeURI: encodeURI,
    encodeURL: encodeURI,
    utob: utob,
    btou: btou,
    decode: decode,
    isValid: isValid,
    fromUint8Array: fromUint8Array,
    toUint8Array: toUint8Array,
    extendString: extendString,
    extendUint8Array: extendUint8Array,
    extendBuiltins: extendBuiltins,
};
// makecjs:CUT //




















// and finally,



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!***************************************!*\
  !*** ./src/pages/background/index.js ***!
  \***************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _controller_user__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./controller/user */ "./src/pages/background/controller/user.js");
/* harmony import */ var _controller_contextMenus__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./controller/contextMenus */ "./src/pages/background/controller/contextMenus.js");
/* harmony import */ var _controller_tabs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./controller/tabs */ "./src/pages/background/controller/tabs.js");
/* harmony import */ var _controller_message__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./controller/message */ "./src/pages/background/controller/message.js");





// chrome.storage.local.clear();
chrome.contextMenus.onClicked.addListener(_controller_contextMenus__WEBPACK_IMPORTED_MODULE_1__.contextMenusOnClick);
chrome.tabs.onUpdated.addListener(_controller_tabs__WEBPACK_IMPORTED_MODULE_2__.tabOnUpdate);
chrome.runtime.onMessage.addListener(_controller_message__WEBPACK_IMPORTED_MODULE_3__.runtimeOnMessage);
chrome.runtime.onInstalled.addListener(async () => {
  // 重新获取用户信息
  await (0,_controller_user__WEBPACK_IMPORTED_MODULE_0__.resetSelf)();
  // 重置按钮组
  await (0,_controller_contextMenus__WEBPACK_IMPORTED_MODULE_1__.resetContextMenus)();
  // 开始循环获取未读消息数量
  (0,_controller_user__WEBPACK_IMPORTED_MODULE_0__.loopNotReadMessageCount)();
});
})();

/******/ })()
;
//# sourceMappingURL=background.main.js.map
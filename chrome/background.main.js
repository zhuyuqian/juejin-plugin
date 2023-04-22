/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/config/index.ts":
/*!*****************************!*\
  !*** ./src/config/index.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  iconUrl: "static/img/icon.png"
});

/***/ }),

/***/ "./src/pages/background/auth.js":
/*!**************************************!*\
  !*** ./src/pages/background/auth.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "bugfix": () => (/* binding */ bugfix),
/* harmony export */   "freeLuckyDraw": () => (/* binding */ freeLuckyDraw),
/* harmony export */   "getSelfInfoStorage": () => (/* binding */ getSelfInfoStorage),
/* harmony export */   "getUserInfo": () => (/* binding */ getUserInfo),
/* harmony export */   "initAuth": () => (/* binding */ initAuth),
/* harmony export */   "logout": () => (/* binding */ logout),
/* harmony export */   "loopMessageNotReadCount": () => (/* binding */ loopMessageNotReadCount),
/* harmony export */   "resetSelfInfo": () => (/* binding */ resetSelfInfo),
/* harmony export */   "setSelfInfoStorage": () => (/* binding */ setSelfInfoStorage),
/* harmony export */   "signin": () => (/* binding */ signin)
/* harmony export */ });
/* harmony import */ var _contextMenus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./contextMenus */ "./src/pages/background/contextMenus.js");
/* harmony import */ var _tool__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tool */ "./src/pages/background/tool.js");
/* harmony import */ var _storage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./storage */ "./src/pages/background/storage.js");
/* harmony import */ var _message__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./message */ "./src/pages/background/message.js");





// 获取个人信息缓存
const getSelfInfoStorage = async () => {
  return await (0,_storage__WEBPACK_IMPORTED_MODULE_2__.getStorage)("juejin-self");
};

// 设置个人信息缓存
const setSelfInfoStorage = async selfInfo => {
  await (0,_storage__WEBPACK_IMPORTED_MODULE_2__.setStorage)("juejin-self", selfInfo);
};

// 登出
const logout = async () => {
  await fetch("https://juejin.cn/passport/web/logout/", {
    credentials: 'include'
  });
  // 取出所有打开的掘金tab
  let tabs = await (0,_tool__WEBPACK_IMPORTED_MODULE_1__.getAllJueJinTabs)();
  for (let tab of tabs) {
    // 刷新当前页
    await chrome.tabs.update(tab.id, {
      url: tab.url
    });
  }
  await setSelfInfoStorage(null);
  await (0,_contextMenus__WEBPACK_IMPORTED_MODULE_0__.resetContextMenus)();
};

// 获取用户信息
const getUserInfo = async userId => {
  let res = await fetch(`https://api.juejin.cn/user_api/v1/user/get?user_id=${userId}`, {
    credentials: 'include'
  }).then(res => res.json());
  let {
    success,
    data
  } = (0,_tool__WEBPACK_IMPORTED_MODULE_1__.handleApiResult)(res);
  return success ? data : null;
};

// 更新登录人信息
const resetSelfInfo = async () => {
  let res = await fetch("https://api.juejin.cn/user_api/v1/user/get_info_pack", {
    credentials: 'include',
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "pack_req": {
        "user_counter": true,
        "user_growth_info": true,
        "user": true
      }
    })
  }).then(res => res.json());
  let {
    data: userInfo
  } = (0,_tool__WEBPACK_IMPORTED_MODULE_1__.handleApiResult)(res);
  if (!userInfo) return await setSelfInfoStorage(null);
  await setSelfInfoStorage(userInfo);
  return userInfo;
};

// 签到
const signin = async () => {
  let res = await fetch("https://api.juejin.cn/growth_api/v1/check_in", {
    credentials: 'include',
    method: "POST"
  }).then(res => res.json());
  let {
    success,
    data,
    err_msg
  } = (0,_tool__WEBPACK_IMPORTED_MODULE_1__.handleApiResult)(res);
  (0,_message__WEBPACK_IMPORTED_MODULE_3__.sendBasicNotifications)("掘金签到：" + (success ? "成功" : "失败"), success ? `本次新增矿石：${data.incr_point}，当前矿石：${data.sum_point}` : err_msg);
};

// 收集bug
const bugfix = async () => {
  let res = await fetch("https://api.juejin.cn/user_api/v1/bugfix/not_collect", {
    credentials: 'include',
    method: "POST"
  }).then(res => res.json());
  let {
    success,
    data,
    err_msg
  } = (0,_tool__WEBPACK_IMPORTED_MODULE_1__.handleApiResult)(res);
  (0,_message__WEBPACK_IMPORTED_MODULE_3__.sendBasicNotifications)("掘金BugFix：" + (success ? "成功" : "失败"), success ? `今日掘金bugfix：${data.length}` : err_msg);
  if (!success) return;
  data.forEach(bug => {
    fetch("https://api.juejin.cn/user_api/v1/bugfix/collect", {
      credentials: 'include',
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(bug)
    });
  });
};

// 免费抽奖
const freeLuckyDraw = async () => {
  let res = await fetch('https://api.juejin.cn/growth_api/v1/lottery_config/get', {
    credentials: 'include'
  }).then(res => res.json());
  res = (0,_tool__WEBPACK_IMPORTED_MODULE_1__.handleApiResult)(res);
  if (!res.success) return (0,_message__WEBPACK_IMPORTED_MODULE_3__.sendBasicNotifications)('今日免费抽奖失败', res.err_msg);
  if (!res.data.free_count) return (0,_message__WEBPACK_IMPORTED_MODULE_3__.sendBasicNotifications)('今日免费抽奖失败', '今日免费抽奖次数已经用完');
  res = await fetch('https://api.juejin.cn/growth_api/v1/lottery/draw', {
    credentials: 'include',
    method: 'POST'
  }).then(res => res.json());
  res = (0,_tool__WEBPACK_IMPORTED_MODULE_1__.handleApiResult)(res);
  if (!res.success) return (0,_message__WEBPACK_IMPORTED_MODULE_3__.sendBasicNotifications)('今日免费抽奖失败', res.err_msg);
  (0,_message__WEBPACK_IMPORTED_MODULE_3__.sendBasicNotifications)('今日免费抽奖成功', `恭喜抽到：${res.data.lottery_name}`);
};

// 获取未读消息数
const loopMessageNotReadCount = async () => {
  if (await getSelfInfoStorage()) {
    let res = await fetch("https://api.juejin.cn/interact_api/v1/message/count", {
      credentials: 'include'
    }).then(res => res.json());
    let {
      success,
      data
    } = (0,_tool__WEBPACK_IMPORTED_MODULE_1__.handleApiResult)(res);
    if (success) {
      // count[1]：点赞和收藏  count[3]：评论
      let {
        count,
        total
      } = data;
      let items = [];
      if (count[1]) items.push(`点赞和收藏：${count[1]}条`);
      if (count[3]) items.push(`评论：${count[3]}条`);
      let notReadStrStorage = await (0,_storage__WEBPACK_IMPORTED_MODULE_2__.getStorage)("message-not-read");
      // 有未读且详情文字不相同
      if (total && notReadStrStorage !== JSON.stringify(items)) {
        (0,_message__WEBPACK_IMPORTED_MODULE_3__.sendBasicNotifications)(`您有${total}条掘金未读消息，以下为详细内容`, `${items.join('\n')}`);
        await (0,_storage__WEBPACK_IMPORTED_MODULE_2__.setStorage)("message-not-read", JSON.stringify(items));
      }
    }
  }
  setTimeout(() => {
    loopMessageNotReadCount();
  }, 10 * 1000);
};
const initAuth = async () => {
  await resetSelfInfo();
  await loopMessageNotReadCount();
};

/***/ }),

/***/ "./src/pages/background/contextMenus.js":
/*!**********************************************!*\
  !*** ./src/pages/background/contextMenus.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "initContentMenus": () => (/* binding */ initContentMenus),
/* harmony export */   "onClick": () => (/* binding */ onClick),
/* harmony export */   "resetContextMenus": () => (/* binding */ resetContextMenus)
/* harmony export */ });
/* harmony import */ var _auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./auth */ "./src/pages/background/auth.js");

const initContentMenus = async () => {
  await resetContextMenus();
};
let resetContextMenusIng = false;
const resetContextMenus = async () => {
  if (resetContextMenusIng) return;
  resetContextMenusIng = true;
  // 移除所有菜单先
  await chrome.contextMenus.removeAll();
  // 获取用户信息
  let self = await (0,_auth__WEBPACK_IMPORTED_MODULE_0__.getSelfInfoStorage)();
  // 已登录
  if (self) {
    await chrome.contextMenus.create({
      id: "MENU_PARENT",
      title: `${self.user_basic.user_name}的掘金`,
      contexts: ["all"]
    });
    await chrome.contextMenus.create({
      id: "SELF_HOME",
      title: "我的主页",
      parentId: "MENU_PARENT",
      contexts: ["all"]
    });
    await chrome.contextMenus.create({
      id: "SELF_NOTIFICATION",
      title: "我的消息",
      parentId: "MENU_PARENT",
      contexts: ["all"]
    });
    await chrome.contextMenus.create({
      id: "separator1",
      type: "separator",
      parentId: "MENU_PARENT",
      contexts: ["all"]
    });
    await chrome.contextMenus.create({
      id: "SIGN_IN",
      title: "快速签到",
      parentId: "MENU_PARENT",
      contexts: ["all"]
    });
    await chrome.contextMenus.create({
      id: "BUG_FIX",
      title: "收集BUG",
      parentId: "MENU_PARENT",
      contexts: ["all"]
    });
    await chrome.contextMenus.create({
      id: 'FREE_LUCKY_DRAW',
      title: "免费抽奖",
      parentId: "MENU_PARENT",
      contexts: ["all"]
    });
    await chrome.contextMenus.create({
      id: "separator2",
      type: "separator",
      parentId: "MENU_PARENT",
      contexts: ["all"]
    });
    await chrome.contextMenus.create({
      id: "LOGOUT",
      title: "登出",
      parentId: "MENU_PARENT",
      contexts: ["all"]
    });
  } else {
    await chrome.contextMenus.create({
      id: "OPEN_JUEJIN",
      type: "normal",
      title: `掘金首页`,
      contexts: ["all"]
    });
  }
  resetContextMenusIng = false;
};
const onClick = async (info, tab) => {
  let self = await (0,_auth__WEBPACK_IMPORTED_MODULE_0__.getSelfInfoStorage)();
  let {
    windowId
  } = tab;
  let {
    menuItemId
  } = info;
  if (menuItemId === "OPEN_JUEJIN") {
    // 打开掘金
    await chrome.tabs.create({
      url: `https://juejin.cn/`,
      selected: true,
      windowId
    });
  }
  if (menuItemId === "SELF_HOME") {
    // 我的主页
    await chrome.tabs.create({
      url: `https://juejin.cn/user/${self.user_basic.user_id}`,
      selected: true,
      windowId
    });
  }
  if (menuItemId === "SELF_NOTIFICATION") {
    // 我的消息
    await chrome.tabs.create({
      url: `https://juejin.cn/notification`,
      selected: true,
      windowId
    });
  }
  if (menuItemId === "LOGOUT") {
    // 登出
    await (0,_auth__WEBPACK_IMPORTED_MODULE_0__.logout)();
  }
  if (menuItemId === "SIGN_IN") {
    // 签到
    await (0,_auth__WEBPACK_IMPORTED_MODULE_0__.signin)();
  }
  if (menuItemId === "BUG_FIX") {
    // 收集bug
    await (0,_auth__WEBPACK_IMPORTED_MODULE_0__.bugfix)();
  }
  if (menuItemId === 'FREE_LUCKY_DRAW') {
    // 免费抽奖
    await (0,_auth__WEBPACK_IMPORTED_MODULE_0__.freeLuckyDraw)();
  }
};

/***/ }),

/***/ "./src/pages/background/message.js":
/*!*****************************************!*\
  !*** ./src/pages/background/message.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "sendBasicNotifications": () => (/* binding */ sendBasicNotifications)
/* harmony export */ });
/* harmony import */ var _tool__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tool */ "./src/pages/background/tool.js");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../config */ "./src/config/index.ts");


const sendBasicNotifications = (title, message) => {
  chrome.notifications.getPermissionLevel(level => {
    if (level === 'granted') {
      chrome.notifications.create((0,_tool__WEBPACK_IMPORTED_MODULE_0__.uuid)(), {
        type: 'basic',
        title,
        message,
        iconUrl: _config__WEBPACK_IMPORTED_MODULE_1__["default"].iconUrl
      });
    }
  });
};

/***/ }),

/***/ "./src/pages/background/storage.js":
/*!*****************************************!*\
  !*** ./src/pages/background/storage.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getStorage": () => (/* binding */ getStorage),
/* harmony export */   "setStorage": () => (/* binding */ setStorage)
/* harmony export */ });
const setStorage = async (key, value) => {
  await chrome.storage.local.set({
    [key]: value
  });
};
const getStorage = async key => {
  return (await chrome.storage.local.get())[key];
};

/***/ }),

/***/ "./src/pages/background/tabs.js":
/*!**************************************!*\
  !*** ./src/pages/background/tabs.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "onUpdated": () => (/* binding */ onUpdated)
/* harmony export */ });
/* harmony import */ var _contextMenus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./contextMenus */ "./src/pages/background/contextMenus.js");
/* harmony import */ var _auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./auth */ "./src/pages/background/auth.js");
/* harmony import */ var _tool__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./tool */ "./src/pages/background/tool.js");



const onUpdated = async (tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete") return;
  let isJueJin = (0,_tool__WEBPACK_IMPORTED_MODULE_2__.isJueJinByTab)(tab);
  if (isJueJin) await (0,_auth__WEBPACK_IMPORTED_MODULE_1__.resetSelfInfo)();
  await (0,_contextMenus__WEBPACK_IMPORTED_MODULE_0__.resetContextMenus)();
  if (isJueJin) await chrome.tabs.sendMessage(tab.id, {
    from: "background",
    event: "page-change-complete"
  });
};

/***/ }),

/***/ "./src/pages/background/tool.js":
/*!**************************************!*\
  !*** ./src/pages/background/tool.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getAllJueJinTabs": () => (/* binding */ getAllJueJinTabs),
/* harmony export */   "getCookie": () => (/* binding */ getCookie),
/* harmony export */   "getCurrentMonthFirstTime": () => (/* binding */ getCurrentMonthFirstTime),
/* harmony export */   "getCurrentWeekFirstTime": () => (/* binding */ getCurrentWeekFirstTime),
/* harmony export */   "handleApiResult": () => (/* binding */ handleApiResult),
/* harmony export */   "isJueJinByTab": () => (/* binding */ isJueJinByTab),
/* harmony export */   "sleep": () => (/* binding */ sleep),
/* harmony export */   "uuid": () => (/* binding */ uuid)
/* harmony export */ });
// 获取cookie
const getCookie = async () => {
  let cookies = await chrome.cookies.getAll({});
  let arr = cookies.map(cookie => `${cookie.name}=${cookie.value}`);
  return arr.join(';');
};
const handleApiResult = apiRes => {
  return Object.assign({}, apiRes, {
    success: apiRes.err_no === 0
  });
};
const getAllJueJinTabs = async () => {
  return await chrome.tabs.query({
    url: 'https://juejin.cn/*'
  });
};
const isJueJinByTab = tab => {
  return tab.url.includes('juejin.cn');
};
const sleep = s => {
  return new Promise(res => {
    setTimeout(res, s * 1000);
  });
};

// 获取本月月初时间戳
const getCurrentMonthFirstTime = () => {
  var data = new Date();
  data.setDate(1);
  data.setHours(0);
  data.setSeconds(0);
  data.setMinutes(0);
  return data.getTime();
};

// 获取本周一时间戳
const getCurrentWeekFirstTime = () => {
  const now = new Date();
  const nowTime = now.getTime();
  // getDay()返回0-6，其中0表示周日，需特殊处理
  const day = now.getDay() > 0 ? now.getDay() : 7; // 表示当前是周几
  const oneDayTime = 24 * 60 * 60 * 1000; // 一天的总ms
  // 本周一时间戳
  const MondayTime = nowTime - (day - 1) * oneDayTime;
  // 格式化时间
  const monday = new Date(MondayTime);
  monday.setHours(0);
  monday.setSeconds(0);
  monday.setMinutes(0);
  return monday.getTime();
};
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
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
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
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!***************************************!*\
  !*** ./src/pages/background/index.js ***!
  \***************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _auth_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./auth.js */ "./src/pages/background/auth.js");
/* harmony import */ var _contextMenus_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./contextMenus.js */ "./src/pages/background/contextMenus.js");
/* harmony import */ var _tabs_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./tabs.js */ "./src/pages/background/tabs.js");



chrome.contextMenus.onClicked.addListener(_contextMenus_js__WEBPACK_IMPORTED_MODULE_1__.onClick);
chrome.tabs.onUpdated.addListener(_tabs_js__WEBPACK_IMPORTED_MODULE_2__.onUpdated);
const init = async () => {
  await (0,_auth_js__WEBPACK_IMPORTED_MODULE_0__.initAuth)();
  await (0,_contextMenus_js__WEBPACK_IMPORTED_MODULE_1__.initContentMenus)();
};
init();
})();

/******/ })()
;
//# sourceMappingURL=background.main.js.map
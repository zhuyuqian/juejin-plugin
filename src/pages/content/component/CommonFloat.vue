<!--左侧浮动内容-->
<template>
  <div class="plugin-float">
    <div class="plugin-float-button" :class="{active:pageInfo.special.show}"
         @click="clickButton('special')">
      我<br/>的<br/>关<br/>心
    </div>
    <div class="plugin-float-button" :class="{active:pageInfo.fuzzyPin.show}"
         @click="clickButton('fuzzyPin')">屏<br/>蔽<br/>沸<br/>点
    </div>
    <div class="plugin-float-button" :class="{active:pageInfo.collectPin.show}"
         @click="clickButton('collectPin')">收<br/>藏<br/>沸<br/>点
    </div>
  </div>
  <div class="plugin-float-popup" :class="{active:pageInfo.special.show}">
    <div class="attention-box" v-for="user of pageInfo.special.users">
      <a class="info" target="_blank" :href="`/user/${user.userId}`">
        <img class="avatar" :src="user.userAvatar"/>
        <div class="name">
          {{ user.userName }}<span class="nick">{{ pageInfo.nick.nameMap[user.userId] || '' }}</span>
        </div>
      </a>
      <span class="cancel" @click.stop="removeSpecialUser(user)">移出</span>
    </div>
  </div>
  <div class="plugin-float-popup" :class="{active:pageInfo.fuzzyPin.show}">
    <el-form label-position="top">
      <el-form-item label="指定用户ID">
        <el-select v-model="pageInfo.fuzzyPin.info.userIds" multiple filterable allow-create default-first-option
                   :reserve-keyword="false" placeholder="请输入用户id" style="width: 100%" @change="saveFuzzyPin">
          <el-option v-for="userId in pageInfo.fuzzyPin.info.userIds" :key="userId" :label="userId" :value="userId"/>
        </el-select>
      </el-form-item>
      <el-form-item label="指定关键字">
        <el-select v-model="pageInfo.fuzzyPin.info.keywords" multiple filterable allow-create default-first-option
                   :reserve-keyword="false" placeholder="请输入关键字" style="width: 100%" @change="saveFuzzyPin">
          <el-option v-for="keyword in pageInfo.fuzzyPin.info.keywords" :key="keyword" :label="keyword"
                     :value="keyword"/>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
  <div class="plugin-float-popup" :class="{active:pageInfo.collectPin.show}">
    <div class="collect-pins-warp">
      <a class="collect-pins-box" target="_blank" v-for="pin of pageInfo.collectPin.pins" :key="pin.id"
         :href="`https://juejin.cn/pin/${pin.id}`">
        <div class="pin-content pub-ellipsis-2" v-html="pin.content"></div>
        <div class="pin-info">
          <span>{{ $dayjs(pin.addTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
          <span>{{ pin.club.name }}</span>
        </div>
      </a>
    </div>
  </div>
  <el-dialog title="昵称修改" v-model="pageInfo.nick.show" width="450px" :close-on-press-escape="false"
             :close-on-click-modal="false" :show-close="false">
    <el-form label-position="top">
      <el-form-item label="用户Id">
        <el-input v-model="pageInfo.nick.currentUserId" placeholder="请输入用户id" disabled/>
      </el-form-item>
      <el-form-item label="配置昵称">
        <el-input v-model="pageInfo.nick.nameMap[pageInfo.nick.currentUserId]" placeholder="请输入备注名称"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="saveNickName">保存</el-button>
      <el-button @click="pageInfo.nick.show=false">关闭</el-button>
    </template>
  </el-dialog>
  <el-dialog title="分享图" v-model="pageInfo.checkPoster.show" width="450px" :close-on-press-escape="false"
             :close-on-click-modal="false" :show-close="false">
    <div v-loading="pageInfo.checkPoster.loading">
      <div class="plugin-check-poster" v-if="pageInfo.checkPoster.info && !pageInfo.checkPoster.base64"
           ref="pluginPoster">
        <img :src="pageInfo.checkPoster.info.user.avatar" class="plugin-avatar" alt="img"/>
        <div class="plugin-user-name">{{ pageInfo.checkPoster.info.user.name }}</div>
        <div class="plugin-content" v-html="pageInfo.checkPoster.info.content"></div>
        <div class="plugin-images">
          <img class="plugin-image" v-for="image of pageInfo.checkPoster.info.images" :src="image" alt="img"/>
        </div>
        <div class="plugin-club">
          <span>{{ pageInfo.checkPoster.info.club.name || '/' }}</span>
        </div>
        <vue-qr class="plugin-qr-code" :logoSrc="pageInfo.checkPoster.info.user.avatar"
                :text="`https://juejin.cn/pin/${pageInfo.checkPoster.info.id}`" :size="80" :margin="5" alt="img"/>
      </div>
      <img style="width: 100%" v-if="pageInfo.checkPoster.base64" :src="pageInfo.checkPoster.base64" alt="img"/>
    </div>
    <template #footer>
      <el-button :disabled="pageInfo.checkPoster.loading" @click="pageInfo.checkPoster.show=false">关闭</el-button>
    </template>
  </el-dialog>
</template>
<script setup>
import {ref, reactive, onUnmounted, getCurrentInstance, nextTick} from 'vue';
import vueQr from 'vue-qr/src/packages/vue-qr.vue';
import html2canvas from 'html2canvas';
import {ajax, EVENT_MAP} from "@/pages/content/api";
import {openLink} from "@/tool";

let {proxy} = getCurrentInstance();
const pluginPoster = ref(null);
// 页面数据
const pageInfo = reactive({
  special: {
    show: false,
    users: JSON.parse(localStorage.getItem('pluginSpecialAttention') || '[]')
  },
  nick: {
    show: false,
    currentUserId: null,
    nameMap: JSON.parse(localStorage.getItem('pluginNickNameMap') || '{}')
  },
  fuzzyPin: {
    show: false,
    info: {
      userIds: JSON.parse(localStorage.getItem('pluginHiddenUserIds') || '[]'),
      keywords: JSON.parse(localStorage.getItem('pluginHiddenKeywords') || '[]')
    }
  },
  collectPin: {
    show: false,
    pins: JSON.parse(localStorage.getItem('pluginCollectPins') || '[]'),
  },
  checkPoster: {
    show: false,
    type: null,
    base64: null,
    info: null,
    loading: false
  }
})

const clickButton = (name) => {
  unBind()
  let isShow = pageInfo[name].show;
  for (let key in pageInfo) {
    pageInfo[key].show = false;
  }
  pageInfo[name].show = !isShow;
  bind();
}

/*-------------别名设置------------------*/

const openNickName = (e) => {
  let userId = $(e.currentTarget).attr('data-user-id');
  if (!userId) return;
  pageInfo.nick.currentUserId = userId;
  clickButton('nick')
}

const handleInsertNickName = () => {
  // 用户名称旁边
  for (let username of $('a.username')) {
    let userId = $(username).attr('href').split('/user/')[1];
    let nick = $(username).parent().find('.plugin-nick');
    if (!nick.length) {
      nick = $('<span class="plugin-nick"></span>');
      nick.insertBefore($(username));
    }
    nick.text(pageInfo.nick.nameMap[userId] || '');
  }
  // 用户首页
  let homeUser = $('.user-info-block');
  if (homeUser.length) {
    let userId = proxy.$url.info.userId;
    let nick = homeUser.find('.plugin-nick');
    if (!nick.length) {
      nick = $('<span class="plugin-nick"></span>');
      nick.insertBefore(homeUser.find('.user-name'));
    }
    nick.text(pageInfo.nick.nameMap[userId] || '');
  }
}

const handleInsertButton = () => {
  // 弹出框
  let popover = $('.popover-content');
  let button = $(`<span class="popover-button  plugin-set-nickname">别名</span>`);
  if (popover.html() && popover.html().includes('operate-btn') && !popover.find('.plugin-set-nickname').length) {
    button.attr('data-user-id', popover.find('.username').attr('href').split('/user/')[1]);
    popover.find('.operate-btn').append(button)
  }
  // 用户首页｜用户控制区
  let user = $('.user-info-block');
  if (user.length && !user.find('.plugin-set-nickname').length) {
    button.attr('data-user-id', proxy.$url.info.userId);
    user.find('.introduction .right').append(button)
  }
  button.on('click', openNickName)
}

const handleNickName = () => {
  handleInsertButton();
  handleInsertNickName();
}

const saveNickName = () => {
  for (let userId in pageInfo.nick.nameMap) {
    if (!pageInfo.nick.nameMap[userId]) delete pageInfo.nick.nameMap[userId];
  }
  localStorage.setItem('pluginNickNameMap', JSON.stringify(pageInfo.nick.nameMap));
  pageInfo.nick.show = false;
  handleDomChange();
}

/*-------------屏蔽沸点------------------*/

// 保存屏蔽内容
const saveFuzzyPin = () => {
  localStorage.setItem('pluginHiddenUserIds', JSON.stringify(pageInfo.fuzzyPin.info.userIds));
  localStorage.setItem('pluginHiddenKeywords', JSON.stringify(pageInfo.fuzzyPin.info.keywords));
  handleDomChange();
}

// 获取命中的关键字
const getTargetKeywordStr = content => {
  let targets = pageInfo.fuzzyPin.info.keywords.filter(keyword => content.includes(keyword));
  return targets.length ? targets.join(';') : '';
}

// 处理上级回复
const handleParentReplys = () => {
  let replys = [];
  for (let reply of $('.sub-comment .parent-wrapper .parent-content')) {
    if (!$(reply).attr('data-pin-hidden')) {
      replys.push(reply)
    }
  }
  for (let reply of replys) {
    let replyContent = reply.innerText;
    // 需要替换的文本内容
    let hitContent = '';
    // 命中内容
    let hitKeyword = getTargetKeywordStr(replyContent);
    if (hitKeyword) hitContent = `${new Array(replyContent.length).fill('*').join('')}（命中关键字：${hitKeyword}）`

    if (hitContent) {
      // 给节点标记一个属性
      $(reply).attr('data-pin-hidden', 1);
      reply.innerText = hitContent;
    }
  }
}

// 处理回复
const handleReplys = () => {
  let replys = [];
  for (let reply of $('.sub-comment')) {
    if ($(reply).attr('data-jj-helper-comment-id') && !$(reply).attr('data-pin-hidden')) {
      replys.push(reply)
    }
  }
  for (let reply of replys) {
    // 回复的用户
    let replyUserId = $(reply.querySelector('.user-link')).attr('href').split('/user/')[1];
    // 回复的内容
    let replyDom = reply.querySelector('.content-wrapper .content');

    let replyContent = replyDom.innerText;
    // 需要替换的文本内容
    let hitContent = '';
    // 命中用户
    if (pageInfo.fuzzyPin.info.userIds.includes(replyUserId)) hitContent = `${new Array(replyContent.length).fill('*').join('')}（命中掘友ID）`
    // 命中内容
    let hitKeyword = getTargetKeywordStr(replyContent);
    if (hitKeyword) hitContent = `${new Array(replyContent.length).fill('*').join('')}（命中关键字：${hitKeyword}）`

    if (hitContent) {
      // 给节点标记一个属性
      $(reply).attr('data-pin-hidden', 1);
      replyDom.innerText = hitContent;
    }
  }
}

// 处理热评
const handleHotComments = () => {
  let comments = [];
  for (let comment of $('.hot-comment-row .desc')) {
    if (!$(comment).attr('data-pin-hidden')) {
      comments.push(comment);
    }
  }
  for (let comment of comments) {
    // 评论的内容
    let commentContent = comment.innerText;
    // 需要替换的文本内容
    let hitContent = '';
    // 命中内容
    let hitKeyword = getTargetKeywordStr(comment.innerText);
    if (hitKeyword) {
      hitContent = `${new Array(commentContent.length).fill('*').join('')}（命中关键字：${hitKeyword}）`
    }
    if (hitContent) {
      // 给节点标记一个属性
      $(comment).attr('data-pin-hidden', 1);
      comment.innerText = hitContent;
    }
  }
}

// 处理评论
const handleComments = () => {
  let comments = [];
  for (let comment of $('.comment')) {
    if ($(comment).attr('data-jj-helper-comment-id') && !$(comment).attr('data-pin-hidden')) {
      comments.push(comment);
    }
  }
  for (let comment of comments) {
    // 评论的用户
    let commentUserId = $(comment.querySelector('.user-link')).attr('href').split('/user/')[1];
    // 评论的内容
    let commentDom = comment.querySelector('.comment-main .content');
    let commentContent = commentDom.innerText;
    // 需要替换的文本内容
    let hitContent = '';
    // 命中用户
    if (pageInfo.fuzzyPin.info.userIds.includes(commentUserId)) {
      hitContent = `${new Array(commentContent.length).fill('*').join('')}（命中掘友ID）`
    }
    // 命中内容
    let hitKeyword = getTargetKeywordStr(commentDom.innerText);
    if (hitKeyword) {
      hitContent = `${new Array(commentContent.length).fill('*').join('')}（命中关键字：${hitKeyword}）`
    }
    if (hitContent) {
      // 给节点标记一个属性
      $(comment).attr('data-pin-hidden', 1);
      commentDom.innerText = hitContent;
    }
  }
}

// 处理沸点
const handlePins = () => {
  let pins = [];
  for (let pin of $('.pin')) {
    if ($(pin).attr('data-pin-id') && !$(pin).attr('data-pin-hidden')) {
      pins.push(pin);
    }
  }
  for (let pin of pins) {

    // 取出作者id
    let authUserId = $(pin).find('.pin-header-row').attr('data-author-id');
    // 取出沸点内容
    let contentText = pin.querySelector('.content').innerText;

    let html = ''

    // 隐藏指定用户
    if (pageInfo.fuzzyPin.info.userIds.includes(authUserId)) {
      html = `<div class='plugin-pin-shadow'>
								<span class="plugin-pin-shadow-text">命中掘友ID</span>
								<span class="plugin-pin-shadow-desc">${authUserId}</span>
							</div>`
    }
    // 隐藏指定内容
    let hitKeyword = getTargetKeywordStr(contentText);
    if (hitKeyword) {
      html = `<div class='plugin-pin-shadow'>
								<span class="plugin-pin-shadow-text">命中关键字</span>
								<span class="plugin-pin-shadow-desc">${hitKeyword}</span>
							</div>`
    }

    // 如果需要整个屏蔽
    if (html) {
      // 给节点标记一个属性
      $(pin).attr('data-pin-hidden', 1);
      $(pin).append($(html));
    }
  }
}

// 处理屏蔽沸点
const handleFuzzyPin = () => {
  handlePins();
  handleComments();
  handleReplys();
  handleHotComments();
  handleParentReplys();
}

/*-------------我的关心------------------*/

// 查找特别关心用户的下标
const findSpecialUserIndex = (userId) => {
  return pageInfo.special.users.findIndex(user => user.userId === userId);
}

// 取消特别关心
const removeSpecialUser = (user) => {
  let userIndex = findSpecialUserIndex(user.userId);
  pageInfo.special.users.splice(userIndex, 1);
  localStorage.setItem('pluginSpecialAttention', JSON.stringify(pageInfo.special.users));
}

// 保存特别关心
const saveSpecialUser = (e) => {
  let userStr = $(e.currentTarget).attr('data-user-json');
  let user = JSON.parse(userStr);
  let userIndex = findSpecialUserIndex(user.userId);
  if (userIndex !== -1) { // 存在，取关
    pageInfo.special.users.splice(userIndex, 1);
    $('.plugin-set-attention').text('关心')
  } else { // 不存在，前面新增
    user.addTime = new Date().getTime();
    pageInfo.special.users.unshift(user);
    $('.plugin-set-attention').text('已关心')
  }
  localStorage.setItem('pluginSpecialAttention', JSON.stringify(pageInfo.special.users));
}

// 处理特别关心
const handleSpecialAttention = () => {
  // 弹出框
  let popover = $('.popover-content')
  let button = $(`<span class="popover-button plugin-set-attention" title="特别关心"></span>`);
  if (popover.html() && popover.html().includes('operate-btn') && !popover.find('.plugin-set-attention').length) {
    let user = {
      userId: popover.find('.username').attr('href').split('/user/')[1],
      userName: popover.find('.username').text().trim(),
      userAvatar: popover.find('img').attr('src')
    }
    let attentionIndex = findSpecialUserIndex(user.userId);
    button.text(attentionIndex !== -1 ? '已关心' : '关心')
    button.attr('data-user-json', JSON.stringify(user))
    popover.find('.operate-btn').append(button);
  }
  // 用户首页｜用户控制区
  let userBlock = $('.user-info-block');
  if (userBlock.length && !userBlock.find('.plugin-set-attention').length) {
    let user = {
      userId: proxy.$url.info.userId,
      userName: userBlock.find('.user-name').text().trim(),
      userAvatar: userBlock.find('.avatar').attr('src')
    }
    let attentionIndex = findSpecialUserIndex(user.userId);
    button.text(attentionIndex !== -1 ? '已关心' : '关心')
    button.attr('data-user-json', JSON.stringify(user));
    userBlock.find('.introduction .right').append(button)
  }
  button.on('click', saveSpecialUser)
}

/*-------------收藏沸点------------------*/

const findCollectPinIndex = (pinId) => {
  return pageInfo.collectPin.pins.findIndex(pin => pin.id === pinId);
}

const handleCollectButtonClick = (pinEl) => {
  let pin = getPinInfoByDom(pinEl)
  let hasIndex = findCollectPinIndex(pin.id);
  if (hasIndex === -1) {
    pageInfo.collectPin.pins.unshift(Object.assign({addTime: new Date().getTime()}, pin))
  } else {
    pageInfo.collectPin.pins.splice(hasIndex, 1);
  }
  localStorage.setItem('pluginCollectPins', JSON.stringify(pageInfo.collectPin.pins));
  handleDomChange()
}

const handleCollectPin = () => {
  for (let pin of $('.pin')) {
    let $pin = $(pin);
    if (!$pin.attr('data-pin-id')) continue
    // 增加关注按钮
    let button = null;
    if (!($pin.find('.plugin-collect-button').length)) {
      button = $('<li class="plugin-collect-button"></li>');
      button.click(() => handleCollectButtonClick(pin))
      $(pin).find('.dislike-menu ul').prepend(button)
    } else {
      button = $pin.find('.plugin-collect-button')
    }
    let pinId = $pin.attr('data-pin-id');
    let hasIndex = findCollectPinIndex(pinId);
    if (hasIndex === -1) {
      button.text('收藏');
    } else {
      button.text('取消收藏');
    }
    // 增加快捷进入详情页
    if (!$pin.find('.plugin-pin-fast-jump-detail').length) {
      $(pin).find('.dislike-menu ul').prepend($(`<a class="plugin-pin-fast-jump-detail" href="https://juejin.cn/pin/${pinId}" target="_blank">详情</a>`))
    }
    // 增加快捷复制沸点发送的功能
    if (!$pin.find('.plugin-pin-fast-copy-push').length) {
      let copyButton = $(`<span class="plugin-pin-fast-copy-push">复制</span>`);
      copyButton.click(async () => {
        if (confirm("你确定要复制并发送该沸点么？")) {
          let newPinInfo = await ajax(EVENT_MAP.COPY_PIN_PUSH, pinId);
          if (newPinInfo) {
            openLink(`https://juejin.cn/pin/${newPinInfo.msg_id}`)
          }
          console.log(newPinInfo)
        }
      })
      $(pin).find('.dislike-menu ul').prepend(copyButton)
    }
  }
}

/*-------------生成海报------------------*/
const changeImageBase = async () => {
  for (let imgEl of $(pluginPoster.value).find('img')) {
    let src = $(imgEl).attr('src');
    let newSrc = await loadImage(src);
    $(imgEl).attr('src', newSrc)
  }

  nextTick(() => {
    html2canvas(pluginPoster.value, {scale: 2, dpi: 300}).then(canvas => {
      pageInfo.checkPoster.base64 = canvas.toDataURL('image/jpeg', 1.0).toString();
      pageInfo.checkPoster.info = null;
      pageInfo.checkPoster.loading = false;
    })
  })
}

// 生成海报
const createCheckPoster = (type, info) => {
  pageInfo.checkPoster.show = true;
  pageInfo.checkPoster.loading = true;
  pageInfo.checkPoster.base64 = null
  pageInfo.checkPoster.info = info;
  pageInfo.checkPoster.type = type;
  setTimeout(() => {
    changeImageBase();
  }, 500)
}

const handleCheckPoster = () => {
  // 获取分享弹出层
  let sharePanel = $('.share-panel');
  // 如果没有就跳过
  if (!sharePanel.length) return;
  // 生成点击按钮
  let button = $('<div class="plugin-check-poster-button">生成海报</div>');
  // 追加到子集第一个
  sharePanel.prepend(button);
  // 增加点击事件
  button.click(() => {
    let pin = getPinInfoByDom(sharePanel.closest('.pin')[0])
    createCheckPoster(1, pin);
  })
}

/*-------------------------*/

const loadImage = (src) => {
  const getImage = (image) => {
    let canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    let context = canvas.getContext('2d');
    context.drawImage(image, 0, 0, image.width, image.height);
    let quality = 0.8;
    // 这里的dataurl就是base64类型
    return canvas.toDataURL('image/jpeg', quality);
  }

  return new Promise(res => {
    let image = new Image();
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = src;
    image.onload = () => {
      res(getImage(image))
    }
  })
}

// 从沸点节点里面获取沸点信息
const getPinInfoByDom = (pinEl) => {
  let $pin = $(pinEl);
  let id = $pin.attr('data-pin-id');
  let content = $pin.find('.content').html();
  let user = {
    id: $pin.find('.user-link').attr('href').split('/')[2],
    name: $pin.find('.username').text().trim(),
    avatar: $pin.find('.avatar-img').attr('src')
  }
  let club = {id: null, name: ''};
  if ($pin.find('.club').length) {
    club.id = $pin.find('.club').attr('href').split('/')[3]
    club.name = $pin.find('.club span').text().trim()
  }
  let images = [];
  for (let imgEl of $pin.find('.pin-img')) {
    let src = $(imgEl).find('.image').attr('src');
    // 裁剪：https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9e9f50bc9b0e47ef89a129195d6ae391~tplv-k3u1fbpfcp-zoom-mark-crop-v2:460:460:0:0.awebp
    //      https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4b578cca130f4d2285e7b76c74c0c722~tplv-k3u1fbpfcp-zoom-mark-crop-v2:240:240:0:0.awebp?
    // 原图：https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9e9f50bc9b0e47ef89a129195d6ae391~tplv-k3u1fbpfcp-watermark.awebp
    src = src.replace('-zoom-mark-crop-v2:460:460:0:0', '-watermark')
        .replace('-zoom-mark-crop-v2:240:240:0:0', '-watermark');
    images.push(src)
  }
  return {id, content, user, club, images};
}

// 当页面dom发生变化后的处理函数
const handleDomChange = () => {
  unBind();
  handleSpecialAttention();
  handleFuzzyPin();
  handleNickName();
  handleCollectPin();
  handleCheckPoster();
  bind();
}

let timeOut = null;
// 绑定的函数
const handleDOMNodeInserted = () => {
  if (timeOut) clearTimeout(timeOut);
  timeOut = setTimeout(() => {
    handleDomChange();
    timeOut = null
  }, 50)
}

// 绑定dom变化监听函数
const bind = () => {
  $("#juejin").on('DOMNodeInserted', handleDOMNodeInserted);

}
// 移除dom变化监听函数
const unBind = () => {
  $("#juejin").off('DOMNodeInserted', handleDOMNodeInserted);
}

bind();

onUnmounted(() => {
  unBind();
})
</script>
<style lang="less">
.plugin-float {
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 110px;

  .plugin-float-button {
    width: 40px;
    margin-bottom: 10px;
    padding: 16px 0;
    cursor: pointer;
    font-size: 12px;
    text-align: center;
    box-sizing: border-box;
    border-radius: 0 4px 4px 0;
    background-color: var(--juejin-layer-1);
    color: var(--juejin-font-1);

    &:hover, &.active {
      color: var(--juejin-brand-1-normal);
    }
  }
}

.plugin-float-popup {
  z-index: 999;
  left: -300px;
  transition: left 0.5s;
  position: fixed;
  top: 110px;
  width: 250px;
  bottom: 100px;
  border-radius: 4px;
  overflow-y: auto;
  background-color: var(--juejin-layer-1);
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid var(--juejin-layer-3-border);

  &.active {
    left: 50px;
  }

  .attention-box {
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;

    .info {
      flex: 1;
      display: flex;
      align-items: center;

      .avatar {
        width: 30px;
        height: 30px;
        border-radius: 4px;
      }

      .name {
        font-size: 14px;
        margin-left: 10px;
        color: var(--juejin-font-1);
        font-weight: bold;

        .nick {
          margin-left: 4px;
          font-size: 12px;
          color: var(--juejin-font-3);
        }
      }
    }

    .cancel {
      font-size: 12px;
      display: none;
      cursor: pointer;
      color: var(--juejin-font-3);
    }

    &:hover {
      .name {
        color: var(--el-color-primary);
      }

      .cancel {
        display: block;
        color: var(--el-color-primary);
      }
    }

    &:first-child {
      margin-top: 0;
    }
  }
}

.pin[data-pin-hidden='1'] {
  height: 200px;
  overflow: hidden;
}

.plugin-pin-shadow {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  align-content: center;
  text-align: center;

  .plugin-pin-shadow-text {
    margin-top: 90px;
    font-size: 26px;
    color: var(--juejin-font-2);
  }

  .plugin-pin-shadow-desc {
    margin-top: 4px;
    font-size: 12px;
    color: var(--juejin-font-3);
  }
}

.dislike-list {
  max-height: none !important;
}

.plugin-collect-button, .plugin-pin-fast-jump-detail, .plugin-pin-fast-copy-push {
  display: block;
  cursor: pointer;
  height: 34px;
  line-height: 34px;
  text-indent: 36px;
  color: var(--juejin-font-1);
  font-size: 14px;

  &:hover {
    color: var(--juejin-font-1);
    background-color: var(--juejin-component-hover);
  }
}

.collect-pins-warp {
  .collect-pins-box {
    display: block;
    font-size: 12px;
    margin-bottom: 10px;

    .pin-content {
      color: var(--juejin-font-1);
    }

    .pin-info {
      margin-top: 4px;
      display: flex;
      justify-content: space-between;
      color: var(--juejin-font-3);
    }

    &:last-child {
      margin-bottom: 0;
    }

    &:hover {
      .pin-content {
        color: var(--el-color-primary)
      }
    }
  }
}

.plugin-check-poster-button {
  font-size: 14px;
  padding: 8px 0;
  text-align: center;
  cursor: pointer;
  color: var(--juejin-font-2);
  border-bottom: 1px solid var(--juejin-layer-3-border);

  &:hover {
    color: var(--el-color-primary);
  }
}

.plugin-check-poster {
  padding: 10px 20px 20px 20px;
  position: relative;
  background-color: var(--juejin-layer-1);

  &:before {
    position: absolute;
    content: '';
    left: 10px;
    right: 10px;
    bottom: 138px;
    top: 40px;
    border: 1px solid var(--juejin-layer-3-border);
    border-radius: 4px;
    z-index: 0;
  }

  .plugin-avatar {
    position: relative;
    z-index: 1;
    display: block;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    margin: 0 auto;
    border: 10px solid var(--juejin-layer-1);
    box-sizing: border-box;
  }

  .plugin-user-name {
    text-align: center;
    font-size: 13px;
    color: var(--juejin-font-2);
    font-weight: bold;
  }

  .plugin-content {
    margin-top: 10px;
    font-size: 14px;
    line-height: 26px;
    color: var(--juejin-font-1);

    img {
      width: 15px;
      display: inline-block;
    }
  }

  .plugin-images {
    margin-top: 10px;
    font-size: 0;

    .plugin-image {
      width: 100%;
    }
  }

  .plugin-club {
    margin-top: 10px;
    text-align: center;

    span {
      position: relative;
      z-index: 1;
      padding: 0 10px;
      background-color: var(--juejin-layer-1);
      font-size: 12px;
      color: var(--juejin-font-3);
    }
  }

  .plugin-qr-code {
    display: block !important;
    margin: 30px auto 0;
    border-radius: 4px;
  }
}
</style>
(()=>{var t={7484:function(t){t.exports=function(){"use strict";var t=6e4,e=36e5,n="millisecond",r="second",a="minute",i="hour",s="day",o="week",u="month",c="quarter",l="year",d="date",h="Invalid Date",f=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,p=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,m={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(t){var e=["th","st","nd","rd"],n=t%100;return"["+t+(e[(n-20)%10]||e[n]||e[0])+"]"}},_=function(t,e,n){var r=String(t);return!r||r.length>=e?t:""+Array(e+1-r.length).join(n)+t},y={s:_,z:function(t){var e=-t.utcOffset(),n=Math.abs(e),r=Math.floor(n/60),a=n%60;return(e<=0?"+":"-")+_(r,2,"0")+":"+_(a,2,"0")},m:function t(e,n){if(e.date()<n.date())return-t(n,e);var r=12*(n.year()-e.year())+(n.month()-e.month()),a=e.clone().add(r,u),i=n-a<0,s=e.clone().add(r+(i?-1:1),u);return+(-(r+(n-a)/(i?a-s:s-a))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(t){return{M:u,y:l,w:o,d:s,D:d,h:i,m:a,s:r,ms:n,Q:c}[t]||String(t||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},w="en",g={};g[w]=m;var $=function(t){return t instanceof Y},v=function t(e,n,r){var a;if(!e)return w;if("string"==typeof e){var i=e.toLowerCase();g[i]&&(a=i),n&&(g[i]=n,a=i);var s=e.split("-");if(!a&&s.length>1)return t(s[0])}else{var o=e.name;g[o]=e,a=o}return!r&&a&&(w=a),a||!r&&w},M=function(t,e){if($(t))return t.clone();var n="object"==typeof e?e:{};return n.date=t,n.args=arguments,new Y(n)},S=y;S.l=v,S.i=$,S.w=function(t,e){return M(t,{locale:e.$L,utc:e.$u,x:e.$x,$offset:e.$offset})};var Y=function(){function m(t){this.$L=v(t.locale,null,!0),this.parse(t)}var _=m.prototype;return _.parse=function(t){this.$d=function(t){var e=t.date,n=t.utc;if(null===e)return new Date(NaN);if(S.u(e))return new Date;if(e instanceof Date)return new Date(e);if("string"==typeof e&&!/Z$/i.test(e)){var r=e.match(f);if(r){var a=r[2]-1||0,i=(r[7]||"0").substring(0,3);return n?new Date(Date.UTC(r[1],a,r[3]||1,r[4]||0,r[5]||0,r[6]||0,i)):new Date(r[1],a,r[3]||1,r[4]||0,r[5]||0,r[6]||0,i)}}return new Date(e)}(t),this.$x=t.x||{},this.init()},_.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds()},_.$utils=function(){return S},_.isValid=function(){return!(this.$d.toString()===h)},_.isSame=function(t,e){var n=M(t);return this.startOf(e)<=n&&n<=this.endOf(e)},_.isAfter=function(t,e){return M(t)<this.startOf(e)},_.isBefore=function(t,e){return this.endOf(e)<M(t)},_.$g=function(t,e,n){return S.u(t)?this[e]:this.set(n,t)},_.unix=function(){return Math.floor(this.valueOf()/1e3)},_.valueOf=function(){return this.$d.getTime()},_.startOf=function(t,e){var n=this,c=!!S.u(e)||e,h=S.p(t),f=function(t,e){var r=S.w(n.$u?Date.UTC(n.$y,e,t):new Date(n.$y,e,t),n);return c?r:r.endOf(s)},p=function(t,e){return S.w(n.toDate()[t].apply(n.toDate("s"),(c?[0,0,0,0]:[23,59,59,999]).slice(e)),n)},m=this.$W,_=this.$M,y=this.$D,w="set"+(this.$u?"UTC":"");switch(h){case l:return c?f(1,0):f(31,11);case u:return c?f(1,_):f(0,_+1);case o:var g=this.$locale().weekStart||0,$=(m<g?m+7:m)-g;return f(c?y-$:y+(6-$),_);case s:case d:return p(w+"Hours",0);case i:return p(w+"Minutes",1);case a:return p(w+"Seconds",2);case r:return p(w+"Milliseconds",3);default:return this.clone()}},_.endOf=function(t){return this.startOf(t,!1)},_.$set=function(t,e){var o,c=S.p(t),h="set"+(this.$u?"UTC":""),f=(o={},o[s]=h+"Date",o[d]=h+"Date",o[u]=h+"Month",o[l]=h+"FullYear",o[i]=h+"Hours",o[a]=h+"Minutes",o[r]=h+"Seconds",o[n]=h+"Milliseconds",o)[c],p=c===s?this.$D+(e-this.$W):e;if(c===u||c===l){var m=this.clone().set(d,1);m.$d[f](p),m.init(),this.$d=m.set(d,Math.min(this.$D,m.daysInMonth())).$d}else f&&this.$d[f](p);return this.init(),this},_.set=function(t,e){return this.clone().$set(t,e)},_.get=function(t){return this[S.p(t)]()},_.add=function(n,c){var d,h=this;n=Number(n);var f=S.p(c),p=function(t){var e=M(h);return S.w(e.date(e.date()+Math.round(t*n)),h)};if(f===u)return this.set(u,this.$M+n);if(f===l)return this.set(l,this.$y+n);if(f===s)return p(1);if(f===o)return p(7);var m=(d={},d[a]=t,d[i]=e,d[r]=1e3,d)[f]||1,_=this.$d.getTime()+n*m;return S.w(_,this)},_.subtract=function(t,e){return this.add(-1*t,e)},_.format=function(t){var e=this,n=this.$locale();if(!this.isValid())return n.invalidDate||h;var r=t||"YYYY-MM-DDTHH:mm:ssZ",a=S.z(this),i=this.$H,s=this.$m,o=this.$M,u=n.weekdays,c=n.months,l=function(t,n,a,i){return t&&(t[n]||t(e,r))||a[n].slice(0,i)},d=function(t){return S.s(i%12||12,t,"0")},f=n.meridiem||function(t,e,n){var r=t<12?"AM":"PM";return n?r.toLowerCase():r},m={YY:String(this.$y).slice(-2),YYYY:this.$y,M:o+1,MM:S.s(o+1,2,"0"),MMM:l(n.monthsShort,o,c,3),MMMM:l(c,o),D:this.$D,DD:S.s(this.$D,2,"0"),d:String(this.$W),dd:l(n.weekdaysMin,this.$W,u,2),ddd:l(n.weekdaysShort,this.$W,u,3),dddd:u[this.$W],H:String(i),HH:S.s(i,2,"0"),h:d(1),hh:d(2),a:f(i,s,!0),A:f(i,s,!1),m:String(s),mm:S.s(s,2,"0"),s:String(this.$s),ss:S.s(this.$s,2,"0"),SSS:S.s(this.$ms,3,"0"),Z:a};return r.replace(p,(function(t,e){return e||m[t]||a.replace(":","")}))},_.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},_.diff=function(n,d,h){var f,p=S.p(d),m=M(n),_=(m.utcOffset()-this.utcOffset())*t,y=this-m,w=S.m(this,m);return w=(f={},f[l]=w/12,f[u]=w,f[c]=w/3,f[o]=(y-_)/6048e5,f[s]=(y-_)/864e5,f[i]=y/e,f[a]=y/t,f[r]=y/1e3,f)[p]||y,h?w:S.a(w)},_.daysInMonth=function(){return this.endOf(u).$D},_.$locale=function(){return g[this.$L]},_.locale=function(t,e){if(!t)return this.$L;var n=this.clone(),r=v(t,e,!0);return r&&(n.$L=r),n},_.clone=function(){return S.w(this.$d,this)},_.toDate=function(){return new Date(this.valueOf())},_.toJSON=function(){return this.isValid()?this.toISOString():null},_.toISOString=function(){return this.$d.toISOString()},_.toString=function(){return this.$d.toUTCString()},m}(),D=Y.prototype;return M.prototype=D,[["$ms",n],["$s",r],["$m",a],["$H",i],["$W",s],["$M",u],["$y",l],["$D",d]].forEach((function(t){D[t[1]]=function(e){return this.$g(e,t[0],t[1])}})),M.extend=function(t,e){return t.$i||(t(e,Y,M),t.$i=!0),M},M.locale=v,M.isDayjs=$,M.unix=function(t){return M(1e3*t)},M.en=g[w],M.Ls=g,M.p={},M}()},3852:function(t,e,n){t.exports=function(t){"use strict";var e=function(t){return t&&"object"==typeof t&&"default"in t?t:{default:t}}(t),n={name:"zh-cn",weekdays:"星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),weekdaysShort:"周日_周一_周二_周三_周四_周五_周六".split("_"),weekdaysMin:"日_一_二_三_四_五_六".split("_"),months:"一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),monthsShort:"1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),ordinal:function(t,e){return"W"===e?t+"周":t+"日"},weekStart:1,yearStart:4,formats:{LT:"HH:mm",LTS:"HH:mm:ss",L:"YYYY/MM/DD",LL:"YYYY年M月D日",LLL:"YYYY年M月D日Ah点mm分",LLLL:"YYYY年M月D日ddddAh点mm分",l:"YYYY/M/D",ll:"YYYY年M月D日",lll:"YYYY年M月D日 HH:mm",llll:"YYYY年M月D日dddd HH:mm"},relativeTime:{future:"%s内",past:"%s前",s:"几秒",m:"1 分钟",mm:"%d 分钟",h:"1 小时",hh:"%d 小时",d:"1 天",dd:"%d 天",M:"1 个月",MM:"%d 个月",y:"1 年",yy:"%d 年"},meridiem:function(t,e){var n=100*t+e;return n<600?"凌晨":n<900?"早上":n<1100?"上午":n<1300?"中午":n<1800?"下午":"晚上"}};return e.default.locale(n,null,!0),n}(n(7484))},4110:function(t){t.exports=function(){"use strict";return function(t,e,n){t=t||{};var r=e.prototype,a={future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"};function i(t,e,n,a){return r.fromToBase(t,e,n,a)}n.en.relativeTime=a,r.fromToBase=function(e,r,i,s,o){for(var u,c,l,d=i.$locale().relativeTime||a,h=t.thresholds||[{l:"s",r:44,d:"second"},{l:"m",r:89},{l:"mm",r:44,d:"minute"},{l:"h",r:89},{l:"hh",r:21,d:"hour"},{l:"d",r:35},{l:"dd",r:25,d:"day"},{l:"M",r:45},{l:"MM",r:10,d:"month"},{l:"y",r:17},{l:"yy",d:"year"}],f=h.length,p=0;p<f;p+=1){var m=h[p];m.d&&(u=s?n(e).diff(i,m.d,!0):i.diff(e,m.d,!0));var _=(t.rounding||Math.round)(Math.abs(u));if(l=u>0,_<=m.r||!m.r){_<=1&&p>0&&(m=h[p-1]);var y=d[m.l];o&&(_=o(""+_)),c="string"==typeof y?y.replace("%d",_):y(_,r,m.l,l);break}}if(r)return c;var w=l?d.future:d.past;return"function"==typeof w?w(c):w.replace("%s",c)},r.to=function(t,e){return i(t,e,this,!0)},r.from=function(t,e){return i(t,e,this)};var s=function(t){return t.$u?n.utc():n()};r.toNow=function(t){return this.to(s(this),t)},r.fromNow=function(t){return this.from(s(this),t)}}}()},6833:function(t){t.exports=function(){"use strict";return function(t,e){e.prototype.weekday=function(t){var e=this.$locale().weekStart||0,n=this.$W,r=(n<e?n+7:n)-e;return this.$utils().u(t)?r:this.subtract(r,"day").add(t,"day")}}}()}},e={};function n(r){var a=e[r];if(void 0!==a)return a.exports;var i=e[r]={exports:{}};return t[r].call(i.exports,i,i.exports,n),i.exports}n.n=t=>{var e=t&&t.__esModule?()=>t.default:()=>t;return n.d(e,{a:e}),e},n.d=(t,e)=>{for(var r in e)n.o(e,r)&&!n.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:e[r]})},n.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),(()=>{"use strict";const t=async({url:t,method:n="GET",data:r,isInclude:a=!1,headers:i={"Content-Type":"application/json"}})=>{let s=a?"include":"omit",o=await fetch(t,{method:n,credentials:s,headers:i,body:JSON.stringify(r)}).then((t=>t.json())).catch((t=>({err_no:1,err_msg:"接口出错"})));return e(o)},e=t=>Object.assign({},t,{success:0===t.err_no}),r=(e,n)=>t({url:`https://api.juejin.cn/user_api/v1/user/dynamic?user_id=${e}&cursor=${n}`});var a=n(7484),i=n.n(a),s=n(6833),o=n.n(s),u=n(4110),c=n.n(u);n(3852),i().extend(o()),i().extend(c()),i().locale("zh-cn");const l=i(),d=t=>new Promise((e=>{setTimeout((()=>{e()}),1e3*t)})),h=(t,e,n)=>{switch(n=n||3,t=Math.ceil(t),e=Math.floor(e),n){case 1:return Math.floor(Math.random()*(e-t))+t;case 2:return Math.floor(Math.random()*(e-t+1))+t;case 3:return Math.floor(Math.random()*(e-t-1))+t+1}},f=async(t,e,n)=>{let r=i()().format("YYYY-MM-DD HH:mm:ss"),a={[t]:{value:e,setTime:r,overdueTime:void 0!==n?i()(r).add(n,"minute").format("YYYY-MM-DD HH:mm:ss"):null}};await chrome.storage.local.set(a)},p=async t=>{let e=(await chrome.storage.local.get())[t];return e?e.overdueTime&&!i()().isBefore(e.overdueTime)?null:e.value:null},m=(t,e)=>{chrome.notifications.create((()=>{for(var t=[],e="0123456789abcdef",n=0;n<36;n++)t[n]=e.substr(Math.floor(16*Math.random()),1);return t[14]="4",t[19]=e.substr(3&t[19]|8,1),t[8]=t[13]=t[18]=t[23]="-",t.join("")})(),{type:"basic",title:t,message:e,iconUrl:"static/img/icon.png"})},_=t=>chrome.tabs.create(t),y=(t,e)=>chrome.tabs.update(t,e),w=t=>chrome.contextMenus.create(t);let g=!1;const $=async()=>{if(g)return;g=!0,await chrome.contextMenus.removeAll();let t=await v();t?(await w({id:"MENU_PARENT",title:`${t.user_basic.user_name}的掘金`,contexts:["all"]}),await w({id:"SELF_HOME",title:"我的主页",parentId:"MENU_PARENT",contexts:["all"]}),await w({id:"SELF_NOTIFICATION",title:"我的消息",parentId:"MENU_PARENT",contexts:["all"]}),await w({id:"separator1",type:"separator",parentId:"MENU_PARENT",contexts:["all"]}),await w({id:"SIGN_IN",title:"快速签到",parentId:"MENU_PARENT",contexts:["all"]}),await w({id:"FREE_LUCKY_DRAW",title:"免费抽奖",parentId:"MENU_PARENT",contexts:["all"]}),await w({id:"separator2",type:"separator",parentId:"MENU_PARENT",contexts:["all"]}),await w({id:"LOGOUT",title:"登出",parentId:"MENU_PARENT",contexts:["all"]})):await w({id:"OPEN_JUEJIN",type:"normal",title:"掘金首页",contexts:["all"]}),g=!1},v=async()=>await p("self-info"),M=async t=>{await f("self-info",t)},S=async()=>{let{success:e,data:n}=await t({url:"https://api.juejin.cn/user_api/v1/user/get_info_pack",method:"POST",data:{pack_req:{user_counter:!0,user_growth_info:!0,user:!0}},isInclude:!0});return e?(await M(n),n):M(null)};let Y=null;const D=()=>{Y||(Y=setInterval((async()=>{if(await v()){let{success:e,data:n}=await t({url:"https://api.juejin.cn/interact_api/v1/message/count",isInclude:!0});if(!e)return;let{count:r,total:a}=n,i=[];r[1]&&i.push(`赞和收藏：${r[1]}条`),r[3]&&i.push(`评论：${r[3]}条`),r[7]&&i.push(`私信：${r[3]}条`);let s=await p("message-not-read");a&&s!==JSON.stringify(i)&&m(`您有${a}条掘金未读消息，以下为详细内容`,`${i.join("\n")}`),await f("message-not-read",JSON.stringify(i))}}),1e4))},j=({userId:e,cursor:n=0,sortType:r=4,limit:a=999})=>t({url:"https://api.juejin.cn/content_api/v1/short_msg/query_list",method:"POST",data:{user_id:e,cursor:n.toString(),sort_type:r,limit:a}}),I="function"==typeof btoa,O="function"==typeof Buffer,T=("function"==typeof TextDecoder&&new TextDecoder,"function"==typeof TextEncoder?new TextEncoder:void 0),b=Array.prototype.slice.call("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="),x=((t=>{let e={};t.forEach(((t,n)=>e[t]=n))})(b),String.fromCharCode.bind(String)),N=("function"==typeof Uint8Array.from&&Uint8Array.from.bind(Uint8Array),t=>t.replace(/=/g,"").replace(/[+\/]/g,(t=>"+"==t?"-":"_"))),E=I?t=>btoa(t):O?t=>Buffer.from(t,"binary").toString("base64"):t=>{let e,n,r,a,i="";const s=t.length%3;for(let s=0;s<t.length;){if((n=t.charCodeAt(s++))>255||(r=t.charCodeAt(s++))>255||(a=t.charCodeAt(s++))>255)throw new TypeError("invalid character found");e=n<<16|r<<8|a,i+=b[e>>18&63]+b[e>>12&63]+b[e>>6&63]+b[63&e]}return s?i.slice(0,s-3)+"===".substring(s):i},L=O?t=>Buffer.from(t).toString("base64"):t=>{let e=[];for(let n=0,r=t.length;n<r;n+=4096)e.push(x.apply(null,t.subarray(n,n+4096)));return E(e.join(""))},k=t=>{if(t.length<2)return(e=t.charCodeAt(0))<128?t:e<2048?x(192|e>>>6)+x(128|63&e):x(224|e>>>12&15)+x(128|e>>>6&63)+x(128|63&e);var e=65536+1024*(t.charCodeAt(0)-55296)+(t.charCodeAt(1)-56320);return x(240|e>>>18&7)+x(128|e>>>12&63)+x(128|e>>>6&63)+x(128|63&e)},C=/[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g,A=O?t=>Buffer.from(t,"utf8").toString("base64"):T?t=>L(T.encode(t)):t=>E(t.replace(C,k)),P=(t,e=!1)=>e?N(A(t)):A(t),H=({topic_id:e,cursor:n=0,id_type:r=4,limit:a=459,sort_type:i=500})=>t({url:"https://api.juejin.cn/recommend_api/v1/short_msg/topic",method:"POST",data:{topic_id:e,cursor:P(JSON.stringify({v:"",i:n})),id_type:r,limit:a,sort_type:i}}),U={"get-self-info":()=>v(),"get-user-pins":t=>(async t=>{let e=await j({userId:t,limit:1});return e.success?(e=await j({userId:t,limit:e.count}),e.success?e.data:[]):[]})(t),"remove-pin":e=>(async e=>{return await(n=e.msg_id,t({url:"https://api.juejin.cn/content_api/v1/short_msg/delete",method:"POST",data:{msg_id:n},isInclude:!0}));var n})(e),"get-pin-club-info":e=>(async e=>{let n=`pin-club-info-${e}`,r=await p(n);if(r)return r;let{success:a,data:i}=await(s=e,t({url:"https://api.juejin.cn/tag_api/v1/query_topic_detail",method:"POST",data:{topic_id:s}}));var s;return a?(await f(n,i,10080),i):null})(e),"get-pin-club-day-user-rank":t=>(async({clubId:t,isRefresh:e})=>{let n=`pin-club-day-user-rank-${t}`,r=await p(n);if(r&&!e)return r;r={time:l().format("YYYY-MM-DD HH:mm:ss"),rank:[]};let a=[];for(let e=0;e<10;e++){let{success:n,data:r}=await H({topic_id:t,limit:100,cursor:100*e});if(await d(.5),!n)break;let i=!0;for(let t of r){if(1e3*t.msg_Info.ctime<l().startOf("day").valueOf()){i=!1;break}a.push(t)}if(!i)break}let i={},s={};for(let t of a){let{user_id:e}=t.msg_Info;i[e]?i[e].push(t):i[e]=[t],s[e]=t.author_user_info}let o=[];for(let t in i)o.push({userId:t,userInfo:s[t],msgCount:i[t].length});o.sort(((t,e)=>e.msgCount-t.msgCount));let u=[];for(let t of o)if(u.length){let{msgCount:e,users:n}=u[u.length-1];if(t.msgCount===e)n.push(t);else{if(!(u.length<3))break;u.push({msgCount:t.msgCount,users:[t]})}}else u.push({msgCount:t.msgCount,users:[t]});r.rank=u;let c=(l().endOf("day").valueOf()-l().valueOf())/1e3/60;return await f(n,r,c),r})(t),"get-user-zan-pins":e=>(async e=>{let{success:n,data:r,count:a}=await(({cursor:e=0,item_type:n=4,sort_type:r=2,user_id:a})=>t({url:"https://api.juejin.cn/interact_api/v1/digg/query_page",method:"POST",data:{cursor:e.toString(),item_type:n,sort_type:r,user_id:a}}))({user_id:e,item_type:4});return n?{pins:r,count:a}:{pins:[],count:0}})(e),"cancel-zan-pin":e=>(async e=>{let{success:n}=await(r=e.msg_id,t({url:"https://api.juejin.cn/interact_api/v1/digg/cancel",method:"POST",data:{item_id:r,item_type:4},isInclude:!0}));var r;return n})(e),"get-year-dynamic":t=>(async({userId:t,isRefresh:e})=>{let n=`year-dynamic-${t}`,a=await p(n);if(a&&!e)return a;a={count:0,time:l().format("YYYY-MM-DD HH:mm:ss"),info:{}};let{success:i,data:s}=await r(t,0);if(!i)return a;let{count:o,list:u}=s;a.count=o;let c=[...u],d=new Array(Math.ceil(o/20)).fill(null).map(((t,e)=>20*e));d.shift(),d=d.splice(0,20),(await Promise.all(d.map((e=>r(t,e))))).forEach((t=>{t.success&&c.push(...t.data.list)}));for(let t of c){let e=l(1e3*t.time).format("YYYY"),n=l(1e3*t.time).format("MM-DD");a.info[e]?a.info[e][n]?a.info[e][n].push(t.action):a.info[e][n]=[t.action]:a.info[e]={[n]:[t.action]}}return await f(n,a),a})(t),"get-random-text":t=>(async t=>{const e="nhhhdemgpmhixsnv",n="Y296dDlVdVVhRnhucmJmUnhvRVY2UT09";let r="";try{if(t.includes("搞笑")){let{data:t}=await fetch(`https://www.mxnzp.com/api/jokes/list?page=${h(1,8715)}&app_id=${e}&app_secret=${n}`).then((t=>t.json()));t&&t.list.length&&(r+=`${t.list[h(0,t.list.length-1)].content}`)}else if(t.includes("上班摸鱼")){const t=[{date:"2024-1-1",name:"元旦"},{date:"2024-2-09",name:"除夕"},{date:"2024-2-10",name:"春节"},{date:"2024-4-5",name:"清明节"},{date:"2024-5-1",name:"劳动节"},{date:"2024-6-10",name:"端午节"},{date:"2024-9-17",name:"中秋节"},{date:"2024-10-01",name:"国庆节"}],e=["偶尔摸鱼有害健康，常常摸鱼收获满满。","人生就是浑水，你不去趟，怎么能摸鱼呢？","上班摸鱼就是要发扬死猪不怕开水烫的精神！","“懒”是我养的宠物，再忙都要花点时间摸摸才行！","有一条深海鱼在往深处游，游着游着它就哭了，因为它觉得压力好大。","人类的终极目标是闲情逸致，而不是工作！","摸鱼也是一种对生活的抵抗。","也许工作比无所事事，对世界的危害更大！","感觉有什么东西在扒拉我，以为是爱情的魔爪，没想到是你的鱼钩！","本来摸鱼的时候，内心还是有点愧疚的，但是你“摸鱼的时候多想想你的工资”从此摸鱼就安心多了！"];r+="【摸鱼办】提醒您：工作再累，一定不要忘记摸鱼哦！\n有事没事起身去茶水间，去厕所，去廊道走走别总在工位上坐着，钱是老板的，但命是自己的。\n";let n=(new Date).getDay();0!==n&&6!==n&&(r+=`\n距离【周末】还有：${6-n}天`),t.forEach((t=>{let e=l(t.date).diff(l(),"day");e>0&&(r+=`\n距离【${t.name}】还有：${e+1}天`)})),r+="\n"+e[h(0,e.length-1)],r+="\n上班是帮老板赚钱，摸鱼是赚老板的钱！最后，祝愿天下所有摸鱼人，都能愉快渡过每一天..."}else if(t.includes("今日新鲜事")){await d(1);let{data:t}=await fetch(`https://www.mxnzp.com/api/news/types?app_id=${e}&app_secret=${n}`).then((t=>t.json()));if(t&&t.length){let a=t[h(0,t.length-1)];await d(1);let{data:i}=await fetch(`https://www.mxnzp.com/api/news/list?typeId=${a.typeId}&page=1&app_id=${e}&app_secret=${n}`).then((t=>t.json()));if(i&&i.length){let t=i[h(0,i.length-1)];r+=`${a.typeName}｜${t.title}`}}}else{await d(1);let{data:t}=await fetch(`https://www.mxnzp.com/api/daily_word/recommend?count=20&app_id=${e}&app_secret=${n}`).then((t=>t.json()));t&&t.length&&(r+=`${t[t.length-1].content}`)}await d(1);let{data:a}=await fetch(`https://www.mxnzp.com/api/ip/self?app_id=${e}&app_secret=${n}`).then((t=>t.json()));if(a){let{province:t,city:i}=a;await d(1);let{data:s}=await fetch(` https://www.mxnzp.com/api/weather/current/${i}?app_id=${e}&app_secret=${n}`).then((t=>t.json()));s&&(r+=`\n\n${s.address}｜${s.temp}｜${s.weather}｜风向${s.windDirection}｜风力${s.windPower}｜湿度${s.humidity}`)}}catch(t){}return{success:!0,data:r,err_msg:""}})(t),"copy-pin-push":e=>(async e=>{let{success:n,data:r}=await(a=e,t({url:"https://api.juejin.cn/content_api/v1/short_msg/detail",method:"POST",data:{msg_id:a}}));var a;if(!n)return null;let i={sync_to_org:!1,content:r.msg_Info.content,pic_list:r.msg_Info.pic_list,topic_id:r.msg_Info.topic_id,theme_id:r.msg_Info.theme_id,jcode_id:r.msg_Info.jcode_id,url:r.msg_Info.url,url_pic:r.msg_Info.url_pic,url_title:r.msg_Info.url_title},s=await(o=i,t({url:"https://api.juejin.cn/content_api/v1/short_msg/publish",method:"POST",data:o,isInclude:!0}));var o;return s.success?s.data:null})(e),"get-self-task-info":()=>(async()=>{let e=await v(),n=e?.user_basic?.user_id;if(!n)return null;let r=await((e,n=1)=>t({url:`https://api.juejin.cn/growth_api/v1/user_growth/task_list?uuid=${e}`,method:"POST",data:{growth_type:n},isInclude:!0}))(n);if(!r.success)return null;let a={todayLimitScore:0,todayScore:r.data.today_jscore,todayPercent:0,taskGroup:[]};for(let t in r.data.growth_tasks){let e=r.data.growth_tasks[t];if(e.length){let t={name:"",tasks:[]};e.forEach((e=>{t.name=e.task_type,t.tasks.push({title:e.title,successCount:e.done,successScore:e.done*e.score,limitCount:e.limit,oneScore:e.score,allScore:e.score*e.limit,origin:e}),e.limit&&(a.todayLimitScore+=e.score*e.limit)})),a.taskGroup.push(t)}}return a.todayPercent=a.todayScore/a.todayLimitScore*100+"%",r=await((e,n=1)=>t({url:`https://api.juejin.cn/growth_api/v1/user_growth/progress?uuid=${e}`,method:"POST",data:{growth_type:n},isInclude:!0}))(n),r.success?(a.currentLevel=r.data.current_level,a.currentScore=r.data.current_score,a.currentLevelSpec=r.data.level_spec.find((t=>t.min_score<=r.data.current_score&&t.max_score>=r.data.current_score)),a.currentPercent=a.currentScore/a.currentLevelSpec.max_score*100+"%",a.levelOrigin=r.data,a):a})()};chrome.contextMenus.onClicked.addListener((async(e,n)=>{let r=await v(),{menuItemId:a}=e,{windowId:i}=n;"OPEN_JUEJIN"===a&&_({url:"https://juejin.cn/",selected:!0,windowId:i}),"SELF_HOME"===a&&await _({url:`https://juejin.cn/user/${r.user_basic.user_id}`,selected:!0,windowId:i}),"SELF_NOTIFICATION"===a&&await _({url:"https://juejin.cn/notification",selected:!0,windowId:i}),"LOGOUT"===a&&await(async()=>{t({url:"https://juejin.cn/passport/web/logout/",isInclude:!0});let e=await((t={})=>chrome.tabs.query(t))({url:"https://juejin.cn/*"});await M(null),await $();for(let t of e)y(t.id,{url:t.url})})(),"SIGN_IN"===a&&await(async()=>{let{success:e,data:n,err_msg:r}=await t({url:"https://api.juejin.cn/growth_api/v1/check_in",method:"POST",isInclude:!0});m("掘金签到："+(e?"成功":"失败"),e?`本次新增矿石：${n.incr_point}，当前矿石：${n.sum_point}`:r)})(),"FREE_LUCKY_DRAW"===a&&await(async()=>{let e=await t({url:"https://api.juejin.cn/growth_api/v1/lottery_config/get",isInclude:!0});return e.success?e.data.free_count?(e=await t({url:"https://api.juejin.cn/growth_api/v1/lottery/draw",method:"POST",isInclude:!0}),e.success?void m("今日免费抽奖成功",`恭喜抽到：${e.data.lottery_name}`):m("今日免费抽奖失败",e.err_msg)):m("今日免费抽奖失败","今日免费抽奖次数已经用完"):m("今日免费抽奖失败",e.err_msg)})()})),chrome.tabs.onUpdated.addListener((async(t,e,n)=>{if("complete"!==e.status)return;D();let r=n.url.includes("juejin.cn");r&&await S(),await $(),r&&((t,e)=>{chrome.tabs.sendMessage(t,Object.assign({event:"page-change-complete"},{from:"background"}))})(t)})),chrome.runtime.onMessage.addListener(((t,e,n)=>{let{to:r,event:a,data:i}=t;if("background"===r)return(async(t,e,n)=>{n(await U[t](e))})(a,i,n),!0})),chrome.runtime.onInstalled.addListener((async()=>{await S(),await $(),D()}))})()})();
//# sourceMappingURL=background.main.js.map
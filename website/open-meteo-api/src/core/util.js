var RS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
        , KS   = RS+"0123456789+/=";


var _utf8_encode = function (e) {e = e.toString().replace(/rn/g, "n");var t = "";for (var n = 0; n < e.length; n++) {let r = e.charCodeAt(n);if (r < 128) {t += String.fromCharCode(r);} else if (r > 127 && r < 2048) {t += String.fromCharCode(r >> 6 | 192);t += String.fromCharCode(r & 63 | 128);} else {t += String.fromCharCode(r >> 12 | 224);t += String.fromCharCode(r >> 6 & 63 | 128);t += String.fromCharCode(r & 63 | 128);}} return t;}

var _utf8_decode = function(e) {var t = "", n = 0;while (n < e.length) {let r = e.charCodeAt(n);if (r < 128) {t += String.fromCharCode(r);n++;} else if (r > 191 && r < 224) {let c2 = e.charCodeAt(n + 1);t += String.fromCharCode((r & 31) << 6 | c2 & 63);n += 2;} else {let c2 = e.charCodeAt(n + 1);let c3 = e.charCodeAt(n + 2);t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);n += 3;}} return t;}

const util = {
    p (cb) {return new Promise((next, reject) => cb(next, reject))},
	/**
	 * base64_encode
	 * @param e
	 * @returns {string}
	 */
	encode: function (e) {var t = "", f = 0;e = _utf8_encode(e);while (f < e.length) {let n = e.charCodeAt(f++);let r = e.charCodeAt(f++);let i = e.charCodeAt(f++);let s = n >> 2;let o = (n & 3) << 4 | r >> 4;let u = (r & 15) << 2 | i >> 6;let a = i & 63;if (isNaN(r)) {u = a = 64;} else if (isNaN(i)) {a = 64;}t = t + KS.charAt(s) + KS.charAt(o) + KS.charAt(u) + KS.charAt(a);}return t;},
	/**
	 * base64_decode
	 * @param e
	 * @returns {string}
	 */
	decode: function (e) {var t = "", f = 0;e = e.toString().replace(/[^A-Za-z0-9+/=]/g, "");while (f < e.length) {let s = KS.indexOf(e.charAt(f++));let o = KS.indexOf(e.charAt(f++));let u = KS.indexOf(e.charAt(f++));let a = KS.indexOf(e.charAt(f++));let n = s << 2 | o >> 4;let r = (o & 15) << 4 | u >> 2;let i = (u & 3) << 6 | a;t = t + String.fromCharCode(n);if (u !== 64) {t = t + String.fromCharCode(r);}if (a !== 64) {t = t + String.fromCharCode(i);}}t = _utf8_decode(t);return t;},
    /**
	 * 加密
	 * @param str
	 * @param key
	 * @param garbleVal
	 * @returns {string}
	 */
	encrypt: function (str, key, garbleVal) {var iv = garbleVal ? util.str_unqie(util.md5(garbleVal)).split('').filter(d => isNaN(d)).map((d, i) => i % 2 === 0 ? d.toString().toUpperCase() : d).join('') : util.random((arguments[2] || 2) > 4 ? arguments[2] : parseInt(Math.random() * 12 + 4)), n = parseInt(Math.random() * 9 + 1), _en_ = util.str_unqie(util.encode(iv + (key || '') + n + iv.split('').reverse().join(","))), _de_ = _en_.split('').reverse().join("");return iv + n + util.strtr(util.encode(str + '#' + parseInt((new Date).getTime() / 1000)), _en_, _de_);},
	/**
	 * 解密
	 * @param str
	 * @param key
	 * @param timeout 过期时间
	 * @returns {string}
	 */
	decrypt: function (str, key, timeout) {var n = str.match(new RegExp("[0-9]+")), l = str.indexOf(n), iv = str.substr(0, l), r = str.substr(l, 1), _en_ = util.str_unqie(util.encode(iv + (key || '') + r + iv.split('').reverse().join(","))), _de_ = _en_.split('').reverse().join("");str = util.decode(util.strtr(str.substr(l + 1, str.length - l - 1), _de_, _en_));var time = str.substr(str.indexOf('#') + 1) || 0;if (timeout > 0 && time > 0 && ((new Date).getTime() + timeout * 1000) < time * 100) {return null;}return str.substr(0, str.indexOf('#'));},
	/**
	 * 字符替换
	 * @param {Object} str
	 * @param {Object} from
	 * @param {Object} to
	 */
	strtr: function (str, from, to) {try {var fr = '', i = 0, j = 0, lenStr = 0, lenFrom = 0, tmpStrictForIn = false, fromTypeStr = '', toTypeStr = '', istr = '';var tmpFrom = [];var tmpTo = [];var ret = '';var match = false;if (typeof from === 'object') {tmpStrictForIn = util.ini_set('phpjs.strictForIn', false);from = util.krsort(from);util.ini_set('phpjs.strictForIn', tmpStrictForIn);for (fr in from) {if (Object.prototype.hasOwnProperty.call(from, fr)) {tmpFrom.push(fr);tmpTo.push(from[fr]);}}from = tmpFrom;to = tmpTo;}lenStr = str.length;lenFrom = from.length;fromTypeStr = typeof from === 'string';toTypeStr = typeof to === 'string';for (i = 0; i < lenStr; i++) {match = false;if (fromTypeStr) {istr = str.charAt(i);for (j = 0; j < lenFrom; j++) {if (istr == from.charAt(j)) {match = true;break;}}} else {for (j = 0; j < lenFrom; j++) {if (str.substr(i, from[j].length) == from[j]) {match = true;i = (i + from[j].length) - 1;break;}}}if (match) {ret += toTypeStr ? to.charAt(j) : to[j];} else {ret += str.charAt(i);}}return ret;} catch (e) {console.warn("strstr" , e);}return str;},
	/**
	 * 字符串去重
	 * @param s
	 * @returns {*}
	 */
	str_unqie: function (s) {var d = {};return s.split("").reduce(function (t, n) {if (d[n] !== true) {d[n] = true;t += n;}return t;}, "");},
	/**
	 * 随机字符
	 * @param ln
	 * @returns {string}
	 */
	random: function (ln) {ln = Math.max(ln || 0, 4);var n = "", l = RS.length;for (let i = 0; i < ln; i++) {n += RS.charAt(Math.floor(Math.random() * l));}return n;},
	/**
	 * 把字符串作为 URI 组件进行编码
	 * @param s
	 * @returns {string}
	 */
	$encode: function (s) {return encodeURIComponent(s);},
	/**
	 * 可对 encodeURIComponent() 函数编码的 URI 进行解码
	 * @param s
	 * @returns {string}
	 */
	$decode: function (s) {return decodeURIComponent(s.replace(/\+/g, " "));},
	/**
	 * unescape() 函数可对通过 escape() 编码的字符串进行解码
	 * @param s
	 * @returns {string}
	 */
	$unescape: function (s) {return unescape(util.$encode(s));},
	/**
	 * md5加密： (hex-encoded) MD5【md5('value') // "2063c1608d6e0baf80249c42e2be5804"】(hex-encoded) HMAC-MD5【md5('value', 'key') // "01433efd5f16327ea4b31144572c67f6"】MD5【md5('value', null, true)】HMAC-MD5【md5('value', 'key', true)】
	 * @param n
	 * @param t
	 * @param r
	 * @returns {*|string|string}
	 */
	md5:function(n,t,r){function d(n,t){var r=(65535&n)+(65535&t);return(((n>>16)+(t>>16)+(r>>16))<<16)|(65535&r)}function f(n,t,r,e,o,u){return d(((u=d(d(t,n),d(e,u)))<<o)|(u>>>(32-o)),r)}function l(n,t,r,e,o,u,c){return f((t&r)|(~t&e),n,t,o,u,c)}function g(n,t,r,e,o,u,c){return f((t&e)|(r&~e),n,t,o,u,c)}function v(n,t,r,e,o,u,c){return f(t^r^e,n,t,o,u,c)}function m(n,t,r,e,o,u,c){return f(r^(t|~e),n,t,o,u,c)}function c(n,t){var r,e,o,u;(n[t>>5]|=128<<t%32),(n[14+(((t+64)>>>9)<<4)]=t);for(var c=1732584193,f=-271733879,i=-1732584194,a=271733878,h=0;h<n.length;h+=16)(c=l((r=c),(e=f),(o=i),(u=a),n[h],7,-680876936)),(a=l(a,c,f,i,n[h+1],12,-389564586)),(i=l(i,a,c,f,n[h+2],17,606105819)),(f=l(f,i,a,c,n[h+3],22,-1044525330)),(c=l(c,f,i,a,n[h+4],7,-176418897)),(a=l(a,c,f,i,n[h+5],12,1200080426)),(i=l(i,a,c,f,n[h+6],17,-1473231341)),(f=l(f,i,a,c,n[h+7],22,-45705983)),(c=l(c,f,i,a,n[h+8],7,1770035416)),(a=l(a,c,f,i,n[h+9],12,-1958414417)),(i=l(i,a,c,f,n[h+10],17,-42063)),(f=l(f,i,a,c,n[h+11],22,-1990404162)),(c=l(c,f,i,a,n[h+12],7,1804603682)),(a=l(a,c,f,i,n[h+13],12,-40341101)),(i=l(i,a,c,f,n[h+14],17,-1502002290)),(c=g(c,(f=l(f,i,a,c,n[h+15],22,1236535329)),i,a,n[h+1],5,-165796510)),(a=g(a,c,f,i,n[h+6],9,-1069501632)),(i=g(i,a,c,f,n[h+11],14,643717713)),(f=g(f,i,a,c,n[h],20,-373897302)),(c=g(c,f,i,a,n[h+5],5,-701558691)),(a=g(a,c,f,i,n[h+10],9,38016083)),(i=g(i,a,c,f,n[h+15],14,-660478335)),(f=g(f,i,a,c,n[h+4],20,-405537848)),(c=g(c,f,i,a,n[h+9],5,568446438)),(a=g(a,c,f,i,n[h+14],9,-1019803690)),(i=g(i,a,c,f,n[h+3],14,-187363961)),(f=g(f,i,a,c,n[h+8],20,1163531501)),(c=g(c,f,i,a,n[h+13],5,-1444681467)),(a=g(a,c,f,i,n[h+2],9,-51403784)),(i=g(i,a,c,f,n[h+7],14,1735328473)),(c=v(c,(f=g(f,i,a,c,n[h+12],20,-1926607734)),i,a,n[h+5],4,-378558)),(a=v(a,c,f,i,n[h+8],11,-2022574463)),(i=v(i,a,c,f,n[h+11],16,1839030562)),(f=v(f,i,a,c,n[h+14],23,-35309556)),(c=v(c,f,i,a,n[h+1],4,-1530992060)),(a=v(a,c,f,i,n[h+4],11,1272893353)),(i=v(i,a,c,f,n[h+7],16,-155497632)),(f=v(f,i,a,c,n[h+10],23,-1094730640)),(c=v(c,f,i,a,n[h+13],4,681279174)),(a=v(a,c,f,i,n[h],11,-358537222)),(i=v(i,a,c,f,n[h+3],16,-722521979)),(f=v(f,i,a,c,n[h+6],23,76029189)),(c=v(c,f,i,a,n[h+9],4,-640364487)),(a=v(a,c,f,i,n[h+12],11,-421815835)),(i=v(i,a,c,f,n[h+15],16,530742520)),(c=m(c,(f=v(f,i,a,c,n[h+2],23,-995338651)),i,a,n[h],6,-198630844)),(a=m(a,c,f,i,n[h+7],10,1126891415)),(i=m(i,a,c,f,n[h+14],15,-1416354905)),(f=m(f,i,a,c,n[h+5],21,-57434055)),(c=m(c,f,i,a,n[h+12],6,1700485571)),(a=m(a,c,f,i,n[h+3],10,-1894986606)),(i=m(i,a,c,f,n[h+10],15,-1051523)),(f=m(f,i,a,c,n[h+1],21,-2054922799)),(c=m(c,f,i,a,n[h+8],6,1873313359)),(a=m(a,c,f,i,n[h+15],10,-30611744)),(i=m(i,a,c,f,n[h+6],15,-1560198380)),(f=m(f,i,a,c,n[h+13],21,1309151649)),(c=m(c,f,i,a,n[h+4],6,-145523070)),(a=m(a,c,f,i,n[h+11],10,-1120210379)),(i=m(i,a,c,f,n[h+2],15,718787259)),(f=m(f,i,a,c,n[h+9],21,-343485551)),(c=d(c,r)),(f=d(f,e)),(i=d(i,o)),(a=d(a,u));return[c,f,i,a]}function i(n){for(var t="",r=32*n.length,e=0;e<r;e+=8)t+=String.fromCharCode((n[e>>5]>>>e%32)&255);return t}function a(n){var t=[];for(t[(n.length>>2)-1]=void 0,e=0;e<t.length;e+=1)t[e]=0;for(var r=8*n.length,e=0;e<r;e+=8)t[e>>5]|=(255&n.charCodeAt(e/8))<<e%32;return t}function e(n){for(var t,r="0123456789abcdef",e="",o=0;o<n.length;o+=1)(t=n.charCodeAt(o)),(e+=r.charAt((t>>>4)&15)+r.charAt(15&t));return e}function o(n){return i(c(a((n=util.$unescape(n))),8*n.length))}function u(n,t){return(function(n,t){var r,e=a(n),o=[],u=[];for(o[15]=u[15]=void 0,16<e.length&&(e=c(e,8*n.length)),r=0;r<16;r+=1)(o[r]=909522486^e[r]),(u[r]=1549556828^e[r]);return((t=c(o.concat(a(t)),512+8*t.length)),i(c(u.concat(t),640)))})(util.$unescape(n),util.$unescape(t))}return t?(r?u(t,n):e(u(t,n))):r?o(n):e(o(n))},
    /**
     * 判断是否手机
     * @returns boolean
     */
	isMobile:function (){return ('ontouchstart' in document.documentElement);},
    /**
     * 判断是否ios系统
     * @returns boolean
     */
	isIos:function () { const userAgent = navigator.userAgent || navigator.vendor || window.opera;return /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;},
	stringToObject:function(str , split , split2 , _default){if(typeof str === 'object')return str;if(str && typeof str !== 'function'){split = split !== undefined && split !== null ? split : ',';let ss = str.toString().split(split);if(split2 !== undefined && split2 !== null){let Obj = {};for (const ssKey in ss) {let ss1 = ss[ssKey].split(split2);Obj[ss1[0].trim()] = ss1[1] === undefined ? null : (ss1[1] === 'true' ? true : (ss1[1] === 'false' ? false : util.$decode(ss1[1])));}return Obj;}return ss;}return _default === undefined ? {} : _default;},
	/**
	 * 参数解析
	 * @param query
	 * @returns {{}}
	 */
	parseParams:function(params){if(params.indexOf('&') === -1 && params.indexOf('=') === -1)return {};let index = params.indexOf('?');return util.stringToObject(index > -1 ? params.substr(index + 1 , params.length - index - 1) : params , '&' , '=');},
	/**
	 * 参数对象转字符
	 * @param query
	 * @returns {string}
	 */
	buildQuery : function(query) {return Object.entries(query).reduce((result, entry) => {result.push(entry.join('='));return result;}, []).join('&');},
    /**
     * 驼峰大写
     * @param {string} str 
     * @returns 
     */
    toCamelCase:function(str , isFirstCase = false) {var s = str.replace(/[-_\s]+(.)?/g, (match, group1) => group1 ? group1.toUpperCase() : '');return isFirstCase ? s.slice(0, 1).toUpperCase() + s.slice(1) : s;},
	/**
	 * 变量转换值
	 * @param {string} str 
	 * @param {object} obj 
	 * @param {function} valCallback 
	 * @param {string} regStart 
	 * @param {string} regEnd 
	 * @returns 
	 */
	variableConvert(str,obj , valCallback = null , regStart = null , regEnd = null){if(!str)return str;valCallback = typeof valCallback === 'function' ? valCallback : null;regStart = regStart || '${';regEnd = regEnd || '}';var reg = new RegExp('\\'+regStart.split("").join('\\')+'.*'+'\\'+regEnd.split("").join('\\') , 'g');for(var i = 0 ; i < str.length ; i ++){var matched = reg.exec(str);if(!(matched||{})[0]) break;var name = matched[0].substr(regStart.length , matched[0].indexOf(regEnd) - regStart.length);var variable = regStart+name+regEnd;var val = obj[variable] !== undefined && obj[variable] !== null ? obj[variable] : (obj[name] === undefined || obj[name] === null ? '' : obj[name]);var r = valCallback ? valCallback(name , val , obj) : val.toString();if(r && r !== true) val = r;str = str.replace(variable , val);} return str;},
    /**
     * 设置、获取、删除缓存
     * @param {string} key 
     * @param {string} value 
     * @param {int} timeout 
     * @returns 
     */
    localStorage: function(key , value = '' , timeout = -1){if(value === null)return localStorage.removeItem(key); if(value === ''){let _value = localStorage.getItem(key);if(_value)_value = util.decrypt(_value , key , timeout); return _value; }return localStorage.setItem(key, util.encrypt(JSON.stringify(value) , key));},

    eachArray:function(array , callback  , childrenStr = 'children', parents = []){
        return array.map((d , i)=>{
			var _d = d instanceof Array ? [ ...d] : d instanceof Object ? {...d} : d;
			if(!(_d instanceof Array) && _d instanceof Object && _d[childrenStr] instanceof Array && (_d[childrenStr] || []).length){
				try{
					_d[childrenStr] = this.eachArray(_d[childrenStr] , callback  , childrenStr , [...(parents || []) , {..._d,_index:i}]);
				}catch(e){/** */}
			}
			var r = typeof callback === 'function' ? callback(_d , i , array , parents) : _d;
			return r === undefined || r === null ? _d : r;
		})
    },
	
	isUrl:function (str) {
		var v = new RegExp('^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$', 'i');
		return v.test(str);
	},
	/**
	 * 对象去空值
	 * @param {*} obj 对象
	 * @param {*} isIncrease 是否递增
	 * @param {*} trimFunc 去空函数
	 * @returns 
	 */
	ObjectTrim(obj , isIncrease = false,trimFunc=null){
		if(!(obj instanceof Object))return obj;
		var isArray = obj instanceof Array;
		var newArr = isArray ? [] : {};
		trimFunc = trimFunc || function(v){ return v !== undefined && v !== null;}
		for(let i in obj) {
		  let val = isIncrease ? this.ObjectTrim(obj[i] , isIncrease , trimFunc) : obj[i];
		  if(trimFunc(val) === false) continue;
		  if(isArray){
			newArr.push(val);
		  }else{
			newArr[i] = val;
		  }
		}
		return newArr;
	  }
}
export default util

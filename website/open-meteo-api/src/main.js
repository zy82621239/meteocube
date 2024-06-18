import Vue from 'vue'
import ElementUI from 'element-ui';
import App from './App.vue'
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/styles/common.css';
import config from '@/core/config'
import util from '@/core/util'
import store from '@/core/store'
import router from '@/core/router'
import mixin from '@/core/mixin'
import axios from  '@/core/axios'
import $ from 'jquery'


Vue.use(ElementUI);

Vue.config.productionTip = false
Vue.prototype.$config = config
Vue.prototype.$util = util
Vue.prototype.$http = axios
Vue.prototype.$ = $

Vue.mixin(mixin);
//加载公共自定义组件
const files = require.context('./components/com', true, /\.vue$/)
files.keys().forEach(key => {
  var name = key.substr(2 , key.length - 6);
  name = util.toCamelCase((name.indexOf('/index') === name.length - 6 ? name.substr(0 , name.length -6) : name).replace('/','-') , true);
  var d = files(key);
  Vue.component('com'+name, d.default)
})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

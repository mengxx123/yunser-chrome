import Vue from 'vue'
import root from './root.vue'
import http from '../util/http'
import storage from '../util/storage'
import cookie from '../util/cookie'

Vue.config.productionTip = false
/* eslint-disable no-new */

Vue.prototype.$http = http
Vue.prototype.$storage = storage
Vue.prototype.$cookie = cookie

// Vue.use(ElementUI)

Vue.config.productionTip = false

// used in Vue rendering
Vue.prototype.__ = chrome.i18n.getMessage

new Vue({ // eslint-disable-line no-new
  el: '#root',
  render: h => h(root)
})

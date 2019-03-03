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

new Vue({
  el: '#root',
  render: h => h(root)
})

import Vue from 'vue'
import root from './root.vue'
// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
import http from '../util/http'
import storage from '../util/storage'

Vue.prototype.$http = http
Vue.prototype.$storage = storage

Vue.config.productionTip = false
// Vue.use(ElementUI)
/* eslint-disable no-new */
new Vue({
  el: '#root',
  render: h => h(root)
})

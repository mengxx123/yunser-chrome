import Vue from 'vue'
import root from './root.vue'
import http from '../util/http'
import storage from '../util/storage'

Vue.config.productionTip = false

Vue.prototype.$http = http
Vue.prototype.$storage = storage

// used in Vue rendering
Vue.prototype.__ = chrome.i18n.getMessage

new Vue({ // eslint-disable-line no-new
    el: '#root',
    render: h => h(root)
})

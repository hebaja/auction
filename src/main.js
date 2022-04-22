import Vue from 'vue'
import App from './App.vue'

import router from '@/router'
import store from '@/store'
import http from '@/http'

Vue.config.productionTip = false

import VTooltip from 'v-tooltip'
import VModal from 'vue-js-modal'
import VuejsDialog from 'vuejs-dialog'
import 'vuejs-dialog/dist/vuejs-dialog.min.css'
import { Vuelidate } from 'vuelidate'
import CripNotice from 'crip-vue-notice'
import VueSocial from "@growthbunker/vuesocial"

Vue.use(VTooltip)
Vue.use(VModal)
Vue.use(VuejsDialog)
Vue.use(Vuelidate)
Vue.use(CripNotice)
Vue.use(VueSocial, {
	iconPath: '/vuesocial/networks',
})

Vue.prototype.$http = http

// Vue.component('pulse-loader', require('vue-spinner/src/PulseLoader.vue'));

new Vue({
	router,
	store,
	render: h => h(App),
}).$mount('#app')
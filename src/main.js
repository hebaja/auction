import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import VTooltip from 'v-tooltip'
import VModal from 'vue-js-modal'
import VuejsDialog from 'vuejs-dialog'
import 'vuejs-dialog/dist/vuejs-dialog.min.css'

Vue.use(VTooltip)
Vue.use(VModal)
Vue.use(VuejsDialog)

new Vue({
  render: h => h(App),
}).$mount('#app')
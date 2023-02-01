import Vue from 'vue'
import App from './views/App.vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import PortalVue from 'portal-vue'
import './style/main.scss'

import { VueAzureAppConfiguration } from '@/index'

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(PortalVue)
Vue.use(VueAzureAppConfiguration, {
  connectionString: '',
  featureFlagLabel: ''
})

Vue.config.productionTip = false

const vm = new Vue({
  render: h => h(App)
})
vm.$mount('#app')

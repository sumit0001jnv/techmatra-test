import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import axios from 'axios'

Vue.config.productionTip = false
axios.defaults.baseURL = 'http://localhost:3000'

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
// import Echo from 'laravel-echo'

Vue.config.productionTip = false

// window.io = require('socket.io-client')
// window.Echo = new Echo({
//   broadcaster: 'socket.io',
//   host: 'http://localhost:6001'
// })

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

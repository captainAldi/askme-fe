import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

// import Echo from 'laravel-echo'

Vue.config.productionTip = false
Vue.use(VueSweetalert2);

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

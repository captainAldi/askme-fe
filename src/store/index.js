import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth.js'
import prevUrl from './prevUrl.js'
import alert from './alert.js'
import dialog from './dialog.js'
import askme from './askme.js'

import VuexPersist from 'vuex-persist'

Vue.use(Vuex)

const vuexPersist = new VuexPersist({
  key: 'askme-data',
  storage: window.localStorage,
  modules: ['auth', 'prevUrl', 'askme']
})

export default new Vuex.Store({
  plugins: [vuexPersist.plugin],
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    auth,
    prevUrl,
    alert,
    dialog,
    askme,
  }
})

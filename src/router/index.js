import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index'

import AdminBase from '../views/admin/Base.vue'

import Home from '../views/Home.vue'
import RunEvent from '../views/RunEvent.vue'

Vue.use(VueRouter)

const routes = [
  
  // Join Event
  {
    path: '/',
    name: 'Home',
    component: Home,
  },

  // Running Event
  {
    path: '/event/:eventCode',
    name: 'RunEvent',
    meta: {
      isEventCode: true
    },
    component: RunEvent,
    
  },

  // Auth
  {
    path: '/auth/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
  },

  // Base
  {
    path: '/admin',
    name: 'Admin',
    component: AdminBase,
    meta: {
      auth: true,
    },
    children: [
      {
        path: 'home',
        component: () => import(/* webpackChunkName: "home" */ '../views/admin/Dashboard.vue')
      },
      {
        path: 'events',
        component: () => import(/* webpackChunkName: "event" */ '../views/admin/events/List.vue')
      },
      {
        path: 'event/create',
        component: () => import(/* webpackChunkName: "event" */ '../views/admin/events/Add.vue')
      },
      {
        path: 'event/edit/:code',
        component: () => import(/* webpackChunkName: "event" */ '../views/admin/events/Edit.vue')
      },
      {
        path: 'questions',
        component: () => import(/* webpackChunkName: "question" */ '../views/admin/Questions.vue')
      },
    ]
  },

  // 404
  {
    path: '*',
    component: () => import(/* webpackChunkName: "home" */ '../views/404.vue')
  }


]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  // jika routing ada meta auth-nya maka
  if (to.matched.some(record => record.meta.auth)) {
    // jika user adalah guest
    if (store.getters['auth/guest']) {
      // tampilkan pesan bahwa harus login dulu
      store.dispatch('alert/set', {
        status: true,
        text: 'Login first',
        color: 'error',
      })
      // catat link sebelum nya
      store.dispatch('prevUrl/setPrevUrl', to.path)

      //redirect ke form login
      next('/auth/login')
    }
    else {
      next()
    }
  } 
  // Jika Routing ada meta isEventCode-nya maka
  else if (to.matched.some(record => record.meta.isEventCode)) {
    // Jika Event Code TidakAda
    if (Object.keys(store.getters['askme/dataEventDetail']).length === 0) {
      // tampilkan pesan Unauthorized !
      store.dispatch('alert/set', {
        status: true,
        text: 'Masukan Event Code!',
        color: 'error',
      })

      //redirect ke dashboard
      next('/')
    } else {
      next()
    }
  } 
  // Kosong
  else {
    next()
  }


})

export default router

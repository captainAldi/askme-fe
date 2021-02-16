<template>
  <v-app>
    <v-app-bar
      app
      :color="$vuetify.theme.dark ? 'grey-darken4' : 'primary'"
      dark
    >
      <v-toolbar-title>Ask Me - Alterra</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-switch
        v-model="goDark"
        color="blue darken-1"
        class="mt-5"
        :append-icon="$vuetify.theme.dark ? 'mdi-moon-waning-crescent' : 'mdi-weather-sunny'"
      >
      </v-switch>

    </v-app-bar>

    <Alert />
    <Dialog />

    <v-main>
      <v-slide-y-transition mode="out-in">
       <div >
          <Question @intersected="onIntersectChild"/>
       </div>
      </v-slide-y-transition>
    </v-main>

    

    <v-footer
      :color="$vuetify.theme.dark ? 'grey-darken4' : 'primary'"
      app
    >
      <span class="white--text mr-2">Infra Team</span>
      <v-divider color="white" vertical></v-divider>
      <span class="white--text ml-2">&copy; {{ tahun }}</span>

      <v-fab-transition>
        <v-btn
          v-show="isIntersecting"
          @click="goToTop"
          color="pink"
          dark
          absolute
          top
          right
          fab
        >
          <v-icon>mdi-arrow-up</v-icon>
        </v-btn>
      </v-fab-transition>

    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'RunEvent',
  components: {
    Question: () => import( /* webpackChunkName: "question" */ '@/components/Home/Question.vue'),
    Alert: () => import( /* webpackChunkName: "alert" */ '@/components/Alert.vue'),
    Dialog: () => import( /* webpackChunkName: "dialogLoading" */ '@/components/Dialog.vue'),
  },

  mounted() {
    this.getTahun()
    this.getThemeDataLS()
  },

  data() {
    return {
      tahun: '',
      app_theme_key: process.env.VUE_APP_LS_THEME_KEY,
      api_url: process.env.VUE_APP_API_ENDPOINT,

      isIntersecting: false,
    }
  },

  computed: {

    goDark: {
      get() {
        const theme = JSON.parse(localStorage.getItem(this.app_theme_key))
        return theme
      },
      set(v) {
        this.$vuetify.theme.dark = v
        localStorage.setItem(this.app_theme_key, v)
      }
    },

  },

  methods: {

    getTahun() {
      this.tahun = new Date().getFullYear()
    },

    getThemeDataLS() {
      const theme = localStorage.getItem(this.app_theme_key);


      if (theme) {
          if (theme == "true") {
              this.$vuetify.theme.dark = true;
          } else {
              this.$vuetify.theme.dark = false;
          }
      }
    },

    onIntersectChild(value) {
      this.isIntersecting = value
    },

    goToTop() {
      let optionGoTo = {
        duration: 800,
        offset: 0,
        easing: 'easeInOutCubic',
      }

      this.$vuetify.goTo(1, optionGoTo)
    }
  }


}
</script>

<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
    >
      <v-list dense>
        <section v-if="guest === false">
          <v-list-item>
            <v-list-item-content>

              <v-list-item-title class="title mt-2">
                {{user.profile.name}}
              </v-list-item-title>

              <v-list-item-subtitle class="mt-2 mb-2">
                {{user.profile.email}}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>
        </section>

        <v-list-item 
          link
          :to="`/admin/home`"
        >

          <v-list-item-action>
            <v-icon>mdi-shield-home-outline</v-icon>
          </v-list-item-action>

          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>

        </v-list-item>

        <v-list-item 
          link
          :to="`/admin/events`"
        >

          <v-list-item-action>
            <v-icon>mdi-account-circle-outline</v-icon>
          </v-list-item-action>

          <v-list-item-content>
            <v-list-item-title>Events</v-list-item-title>
          </v-list-item-content>

        </v-list-item>

        <v-list-item 
          link
          :to="`/admin/questions`"
        >

          <v-list-item-action>
            <v-icon>mdi-account-supervisor-circle-outline</v-icon>
          </v-list-item-action>

          <v-list-item-content>
            <v-list-item-title>Questions</v-list-item-title>
          </v-list-item-content>

        </v-list-item>

        <section v-if="guest === false">
          <v-divider></v-divider>

          <v-list-item>
            <v-list-item-content>
              <v-btn
                color="red"
                class="white--text"
                @click="logOutSSO"
              >
                Logout
              </v-btn>
            </v-list-item-content>
          </v-list-item>
        </section>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      :color="$vuetify.theme.dark ? 'grey-darken4' : 'primary'"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Ask Me</v-toolbar-title>

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
        <router-view></router-view>
      </v-slide-y-transition>
    </v-main>

    <v-footer
      :color="$vuetify.theme.dark ? 'grey-darken4' : 'primary'"
      app
    >
      <span class="white--text">Renaldi</span>
      
      <v-divider color="white" vertical></v-divider>

      <span class="white--text">&copy; {{ tahun }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'admin-base',
  components: {
    Alert: () => import( /* webpackChunkName: "alert" */ '@/components/Alert.vue'),
    Dialog: () => import( /* webpackChunkName: "dialogLoading" */ '@/components/Dialog.vue'),
  },

  mounted() {
    this.getTahun()
    this.getThemeDataLS()
    this.redirectToDashboard()
  },

  data() {
    return {
      drawer: false,
      tahun: '',
      app_theme_key: process.env.VUE_APP_LS_THEME_KEY,
      api_url: process.env.VUE_APP_API_ENDPOINT,
    }
  },

  computed: {
    ...mapGetters({
      user: 'auth/user',
      guest: 'auth/guest',
    }),

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
    ...mapActions({
      setAlert  : 'alert/set',
      setDialog : 'dialog/set',
      setAuth   : 'auth/set'
    }),

    getTahun() {
      this.tahun = new Date().getFullYear()
    },

    async logOutSSO() {
      await localStorage.clear()
      this.$router.go(0)
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

    redirectToDashboard() {
      if (this.$route.path == '/admin') {
        this.$router.push('admin/home')
      }
    }
  }

}
</script>

<style>

</style>
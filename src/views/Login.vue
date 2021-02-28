<template>
  <v-app> 

    <Alert />
    <Dialog />

    <v-main>
      <v-slide-y-transition mode="out-in">
       <v-container fluid class="app">
        <!-- Logo -->
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            lg="6"
            md="8"
            align-self="center"
          >
            <!-- <v-img
              :lazy-src="require('@/assets/aplikasi/logo.png')"
              :src="require('@/assets/aplikasi/logo.png')"
              max-width="150"
              max-height="150"
              class="mt-5 mx-auto"
            ></v-img> -->
            <p>Logo</p>
          </v-col>
        </v-row>

        <!-- Form -->
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            lg="6"
            md="8"
            align-self="center"
          >
            <v-card
              elevation="4"
              class="mx-auto mt-5 "
              max-width="80%"
            >
              <v-card-title class="justify-center">Login Page</v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <!-- Inputan -->
                <v-form
                  ref="formLogin"
                  v-model="validLogin"
                  lazy-validation
                >
                  <v-text-field
                    v-model="form.email"
                    label="E-Mail ..."
                    :rules="formRules.emailRules"
                    filled
                    required
                    class="mt-5"
                  ></v-text-field>

                  <v-text-field
                    label="Password ..."
                    v-model="form.password"
                    :rules="formRules.passwordRules"
                    :append-icon="showPassTextInput ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showPassTextInput ? 'text' : 'password'"
                    @click:append="showPassTextInput = !showPassTextInput"
                    filled
                    required
                  ></v-text-field>

                  <v-btn
                    :disabled="!validLogin"
                    color="success"
                    class="mr-4"
                    @click="submit"
                  >
                    Login
                  </v-btn>

                  <v-btn
                    color="error"
                    class="mr-4"
                    @click="reset"
                  >
                    Reset
                  </v-btn>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
       </v-container>
      </v-slide-y-transition>
    </v-main>

  </v-app>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import axios from 'axios'

export default {
  name: 'login',
  components: {
    Alert: () => import( /* webpackChunkName: "alert" */ '@/components/Alert.vue'),
    Dialog: () => import( /* webpackChunkName: "dialogLoading" */ '@/components/Dialog.vue'),
  },

  data() {
    return {
      api_url: process.env.VUE_APP_API_ENDPOINT,
      validLogin: false,
      showPassTextInput: false,
      form: {
        email: '',
        password: ''
      },
      formRules: {
        emailRules: [
          v => !!v || 'E-mail is required',
          v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
        ],
        passwordRules: [
          v => !!v || 'Password is required',
          v => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d~`!$%@#£€*?&^()<>,.\-+=_|/;:'"{}[\s]{6,}$/.test(v) || "Use At Least 6 Characters, with Letter and Number"
        ],
      }
    }
  },

  computed: {
    ...mapGetters({
      user: 'auth/user',
      prevUrl : 'prevUrl/prevUrl'
    }),
  },

  methods: {
    ...mapActions({
      setAlert  : 'alert/set',
      setDialog : 'dialog/set',
      setAuth   : 'auth/set'
    }),

    async submit(e) {
      e.preventDefault()

      if (!this.$refs.formLogin.validate()) {
        this.setAlert({
          status : true,
          color  : 'error',
          text  : 'Isi Data dengan Lengkap !',
        })
      } else {

        try {

          this.setDialog({
            status : true,
          })

          let formData = new FormData()

          formData.append('email', this.form.email.toLowerCase())
          formData.append('password', this.form.password)

          const response = await axios.post(this.api_url + '/login', formData)

          await this.setAuth(response.data.result)

          this.setDialog({
            status : false,
          })

          if(this.prevUrl.length > 0) {
            this.$router.push(this.prevUrl)
          } else {
            this.$router.push('admin/home')
          }

        } catch (error) {

          this.setDialog({
            status : false,
          })

          if (error.response.status === 401) {
            this.setAlert({
              status : true,
              color  : 'error',
              text  : 'Data Tidak Valid !',
            })
          } else if (error.response.status === 403) {
            this.setAlert({
              status : true,
              color  : 'error',
              text  : 'Verifikasi Email Anda !',
            })
          } else if (error.response.status === 404) {
            this.setAlert({
              status : true,
              color  : 'error',
              text  : 'Anda Belum Ter Daftar !',
            })
          } else {
            this.setAlert({
              status : true,
              color  : 'error',
              text  : 'Ada Masalah di Server !',
            })
          }
        }
        
      }
    },
    
    reset() {
      this.$refs.formLogin.resetValidation()
      
      this.form.email = ''
      this.form.password = ''
      
    },

  }
}
</script>

<style scoped>
.app {
  background-color: #54c2cc;
  height: 100%;
}
</style>
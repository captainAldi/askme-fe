<template>
  <v-app> 

    <Alert />
    <Dialog />

    <v-main>
      <v-slide-y-transition mode="out-in">
       <v-container fluid class="app">
         <v-row>
            <v-col
              cols="12"
              md="4"
              offset-md="4"
            >
              <center>logo</center>
            </v-col>
         </v-row>

         <v-row>
            <v-col
              cols="12"
              md="4"
              offset-md="4"
            >
              <v-form
                ref="formEnterEvent"
                v-model="validEnterEventForm"
                lazy-validation
              >
                <v-text-field
                  label="Enter Event Code"
                  solo
                  v-model="event_code"
                  :rules="event_code_rules"
                ></v-text-field>
              </v-form>

             <center>
                <v-btn
                  color="primary"
                  class="mt-n2 mr-2"
                  @click="enterEvent"
                  :disabled="!validEnterEventForm"
                >
                  Enter
                </v-btn>

                <v-btn
                  color="error"
                  class="mt-n2"
                  @click="reset"
                >
                  Reset
                </v-btn>
             </center>
            </v-col>
         </v-row>
       </v-container>
      </v-slide-y-transition>
    </v-main>

  </v-app>
</template>

<script>
import axios from 'axios'
import { mapActions } from 'vuex'

export default {
  name: 'Home',
  components: {
    // Question: () => import( /* webpackChunkName: "question" */ '@/components/Home/Question.vue'),
    Alert: () => import( /* webpackChunkName: "alert" */ '@/components/Alert.vue'),
    Dialog: () => import( /* webpackChunkName: "dialogLoading" */ '@/components/Dialog.vue'),
  },

  mounted() {

  },

  data() {
    return {
      api_url: process.env.VUE_APP_API_ENDPOINT,


      event_code: '',
      event_code_rules: [
          v => !!v || 'Event Code is required',
        ],

      validEnterEventForm: false

    }
  },

  computed: {

  },

  methods: {
    ...mapActions({
      setAlert  : 'alert/set',
      setEventDetail : 'askme/doSetEventDetail',
      setClearEvent : 'askme/doSetClear',
      setDialog : 'dialog/set',
    }),

    async enterEvent() {
      if (!this.$refs.formEnterEvent.validate()) {
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

          this.setClearEvent()

          let formData = new FormData()
          formData.append('event_code', this.event_code)

          const response = await axios.post(`${this.api_url}/events/enter`, formData)

          await this.setEventDetail(response.data.data)

          this.setDialog({
            status : false,
          })

          this.$router.push(`/event/${this.event_code}`)

        } catch (error) {
          this.setDialog({
            status : false,
          })

          this.setAlert({
            status : true,
            color  : 'error',
            text  : error.response.data.message,
          })
        }
      }
    },

    reset() {
      this.$refs.formEnterEvent.resetValidation()

      this.event_code = ''
    }
  }


}
</script>

<style scoped>
.app {
  background-color: #54c2cc;
  height: 100%;
}
</style>

<template>
  <v-container fluid>
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
          <v-card-title class="justify-center">Tambah Event</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <!-- Alert Jika Gagal -->
            <v-alert 
              :type="alertObject.type"
              v-model="alertObject.status"
              dismissible
            >
              <li>
                <template v-for="item in alertObject.message"> {{item}} </template>
              </li>
            </v-alert>

            <!-- Inputan -->
            <v-form
              ref="formEvent"
              v-model="validEvent"
              lazy-validation
            >
              <v-text-field
                v-model="form.nama_event"
                label="Judul Event ..."
                :rules="formRules.judulRules"
                filled
                required
                class="mt-5"
              ></v-text-field>

              <v-text-field
                v-model="form.code"
                label="Code Event ..."
                :rules="formRules.codeRules"
                filled
                disabled
                required
                class="mt-5"
              ></v-text-field>


              <v-switch
                v-model="form.status"
                :label="form.status == false ? 'Not Active' : 'Active'"
                color="blue darken-1"
                class="mt-5"
              >
              </v-switch>

              <v-btn
                :disabled="!validEvent"
                color="success"
                class="mr-4"
                @click="submit"
              >
                Update
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
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import axios from 'axios'

export default {
  name: 'edit-event',
  data() {
    return {
      api_url: process.env.VUE_APP_API_ENDPOINT,
      validEvent: false,
      code_event: '',
      form: {
        nama_event: '',
        code: '',
        status: false
      },
      formRules: {
        judulRules: [
          v => !!v || 'Judul is required',
        ],
        codeRules: [
          v => !!v || 'Code is required',
        ],
      },
      alertObject: {
        type: 'success',
        message: {},
        status: false
      },
    }
  },

  mounted() {
    this.ambilDataUrl()
    this.getCurrentData()
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

    ambilDataUrl() {
      this.code_event = this.$route.params.code
    },

    async getCurrentData() {
      try {
        this.setDialog({
          status : true,
        })
        
        let config = {
          headers: {
            'Authorization': this.user.api_token,
          }
        }

        const response = await axios.get(this.api_url + '/admin/event/' + this.code_event, config)

        this.form = response.data.data

        this.form.status = response.data.data.status == 'not active' ? false : true

        this.setDialog({
          status : false,
        })

      } catch (error) {
        this.setAlert({
          status : true,
          color  : 'error',
          text  : error.response.data.message,
        })
      }
    },

    async submit(e) {
      e.preventDefault()

      if (!this.$refs.formEvent.validate()) {
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

          let config = {
            headers: {
              'Authorization': this.user.api_token,
            }, 
          }

          let formData = new FormData()

          formData.append('judul', this.form.nama_event)
          formData.append('code', this.form.code)
          formData.append('status', this.form.status)
          formData.append("_method", "PATCH");

          await axios.post(this.api_url + '/admin/event/update/' + this.code_event, formData, config)

          this.setDialog({
            status : false,
          })

          this.$router.go(-1)

        } catch (error) {

          this.setDialog({
            status : false,
          })

          this.setAlert({
            status : true,
            color  : 'error',
            text  : error.response.data.message
          })

          this.alertObject.status = true
          this.alertObject.type = 'error'
          this.alertObject.message = error.response.data

        }
        
      }
    },
    
    reset() {
      this.$refs.formEvent.resetValidation()
      
      this.form.judul = ''
      this.form.code = ''
      this.form.status = false
      
    },

  }
}
</script>

<style>

</style>
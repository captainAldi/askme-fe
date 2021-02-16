<template>
  <div>
    <v-container fluid>
      <v-form
        ref="formAddPertanyaan"
        v-model="validAddPertanyaanForm"
        lazy-validation
      >
        <v-card
          class="mb-4"
        >
          <v-card-title>Buat Pertanyaan</v-card-title>

          <v-card-text>
            <v-text-field
              dense
              label="Penanya"
              v-model="form.penanya"
            ></v-text-field>

            <v-textarea
              dense
              label="Pertanyaan"
              v-model="form.judul"
              :rules="formRules.pertanyaan"
            ></v-textarea>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-btn
              @click="createQuestion"
              :disabled="!validAddPertanyaanForm"
              color="primary"
              class="mr-2"
            >
              Tanya
            </v-btn>

            <v-btn
              color="error"
              @click="reset"
            >
              Reset
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>

      <section class="d-flex flex-row">
        <v-select
          v-model="sort_by"
          :items="item_sort_by"
          item-text="title"
          item-value="nilai"
          label="Items"
          @change="getQuestions"
        ></v-select>

        <v-btn
          @click="getQuestions"
          class="mb-2 mt-3 ml-3"
          color="primary"
        >
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </section>
      
      <section v-if="statusLoadingQuestions">
        <v-skeleton-loader
          type="article, actions"
        ></v-skeleton-loader>
      </section>

      <section v-else>
        <v-card 
          v-for="(item, index) in data_pertanyaan" 
          :key="index" 
          class="mb-4"
          v-intersect="onIntersect"
        >
          <v-card-title>
            <section v-if="item.penanya != ''">
              {{ item.penanya }}
            </section>

            <section v-else>
              Anonymous
            </section>
          </v-card-title>

          <v-card-text>
            {{ item.judul }}
          </v-card-text>

          <v-card-subtitle>
            <section v-if="liked_questions.includes(item.id)">
              <v-btn
                @click="likeQuestions(item.id)"
                color="primary"
                disabled
                icon
              >
                <v-icon class="mr-2">mdi-thumb-up-outline</v-icon>
                {{ item.like }}
              </v-btn>
            </section>

            <section v-else>
              <v-btn
                @click="likeQuestions(item.id)"
                color="primary"
                icon
              >
                <v-icon class="mr-2">mdi-thumb-up-outline</v-icon>
                {{ item.like }}
              </v-btn>
            </section>
          </v-card-subtitle>
        </v-card>
      </section>

      
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import axios from 'axios'

export default {
  name: 'listQuestions',
  data() {
    return {
      api_url: process.env.VUE_APP_API_ENDPOINT,

      validAddPertanyaanForm: false,
      formRules: {
        pertanyaan: [
          v => !!v || 'Pertanyaan is required',
        ],
      },

      data_pertanyaan: [],
      statusLoadingQuestions: true,
      item_sort_by: [
        { title: 'Favourites', nilai: 'like' },
        { title: 'Newest', nilai: 'created_at' },
      ],

      sort_by: 'like',
      form: {
        judul: '',
        penanya: ''
      }

    }
  },

  mounted() {
    this.getQuestions()
    //this.intervalGetQuestions()
  },

  computed: {
    ...mapGetters({
      event_detail: 'askme/dataEventDetail',
      liked_questions: 'askme/dataLikedQuestions'
    }),
  },

  methods: {
    ...mapActions({
      setAlert  : 'alert/set',
      setLikedQuestions: 'askme/doSetLikedQuestions'
    }),

    async getQuestions() {
      try {

        this.statusLoadingQuestions = true

        let config = {
          params: {
            sort_by: this.sort_by,
          }
        }

        const response = await axios.get(`${this.api_url}/questions/${this.event_detail.code}`, config)

        this.data_pertanyaan = response.data.data

        this.statusLoadingQuestions = false

      } catch (error) {
        this.statusLoadingQuestions = false

        this.setAlert({
          status : true,
          color  : 'error',
          text  : error,
        })
      }
    },

    intervalGetQuestions() {
      setInterval(() => {
        this.getQuestions()
      }, 5000)
    },

    async likeQuestions(id) {
      try {

        await axios.post(`${this.api_url}/questions/like/${id}`)

        this.setLikedQuestions(id)

        await this.getQuestions()

      } catch (error) {
        this.setAlert({
          status : true,
          color  : 'error',
          text  : error,
        })
      }
    },

    async createQuestion(e) {
      e.preventDefault()

      if (!this.$refs.formAddPertanyaan.validate()) {
        this.setAlert({
          status : true,
          color  : 'error',
          text  : 'Isi Data dengan Lengkap !',
        })
      } else {
        try {
          let formData = new FormData()
          formData.append('event_id', this.event_detail.id)
          formData.append('judul', this.form.judul)
          formData.append('penanya', this.form.penanya)

          await axios.post(`${this.api_url}/questions/create`, formData)

          await this.getQuestions()

          this.setAlert({
            status : true,
            color  : 'success',
            text  : 'Pertanyaan Berhasil di Tambah !',
          })

        } catch (error) {
          this.setAlert({
            status : true,
            color  : 'error',
            text  : error,
          })
        }
      }
      
    },

    reset() {
      this.$refs.formAddPertanyaan.resetValidation()
      
      this.form.penanya = ''
      this.form.judul = ''
      
    },

    onIntersect (entries) {
      // More information about these options
      // is located here: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
      // this.isIntersecting = entries[0].isIntersecting
      this.$emit('intersected', entries[0].isIntersecting)
    },

  },

  beforeDestroy() {
    clearInterval(this.getQuestions)
  }

}
</script>

<style>

</style>
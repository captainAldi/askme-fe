<template>
  <v-container fluid>
    <v-row>
      <v-col
        cols="12"
      >
        <h1>Data Pertanyaan</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col
        cols="12"
      >
        <DataQuestions
          :allQuestionsData="allQuestionsData" 
          :headers="headers" 
          :meta="meta"
          :dataTableLoading="dataTableLoading"
          @per_page="handlePerPage" 
          @pagination="handlePagination" 
          @searchJudul="handleSearchJudul" 
          @searchEvent="handleSearchEvent" 
          @searchPenanya="handleSearchPenanya"
          @sort="handleSort"
          @refresh="handleRefreshData"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import axios from 'axios'

export default {
  name: 'list-questions',
  components: {
    DataQuestions: () => import( /* webpackChunkName: "data-questions" */ '@/components/Admin/DataQuestions.vue'),
  },
  data() {
    return {
      api_url: process.env.VUE_APP_API_ENDPOINT,

      allQuestionsData: [],
      headers: [
        {
          text: 'Penanya',
          align: 'start',
          value: 'penanya',
        },
        { text: 'Event Code', value: 'event.code' },
        { text: 'Like', value: 'like' },
        { text: 'Judul', value: 'judul' },
      ],
      
      meta: [],
      dataTableLoading: true,

      current_page: 1, 
      per_page: 10, 
      sortBy: 'created_at',
      sortByDesc: true,

      searchJudul: '',
      searchEvent: '',
      searchPenanya: '',
    }
  },

  mounted() {
    this.loadData()
  },
  computed: {
    ...mapGetters({
      user  : 'auth/user',
      guest : 'auth/guest'
    }),
  },

  methods: {
    ...mapActions({
      setAlert  : 'alert/set',
      setAuth   : 'auth/set',
      setDialog : 'dialog/set'
    }),

    async loadData() {
      try {
        
        this.dataTableLoading = true

        let config = {
          headers: {
            'Authorization': this.user.api_token,
          },
          params: {
            page: this.current_page,
            per_page: this.per_page,
            sortby: this.sortBy,
            sortbydesc: this.sortByDesc ? 'DESC':'ASC',
            event: this.searchEvent,
            pertanyaan: this.searchJudul,
            penanya: this.searchPenanya
          }
        }

        const response = await axios.get(this.api_url + '/admin/questions', config)

        let getData = response.data.data

        this.allQuestionsData = getData.data

        this.meta = {
          total: getData.total,
          current_page: getData.current_page,
          per_page: getData.per_page,
          last_page: getData.last_page,
          from: getData.from,
          to: getData.to
        }

        this.dataTableLoading = false

        if (getData.data.length > 0) {
            this.setAlert({
              status : true,
              color  : 'success',
              text  : 'Data Berhasil di Ambil',
            })
          } else {
            this.setAlert({
              status : true,
              color  : 'error',
              text  : 'Data Tidak Ada !',
            })
          }

      } catch (error) {
        this.dataTableLoading = false

        this.setAlert({
          status : true,
          color  : 'error',
          text  : error,
        })

        console.log(error.response)
      }
    },

    handlePerPage(val) {
      this.per_page = val 
      this.loadData()
    },

    handlePagination(val) {
        this.current_page = val
        this.loadData()
    },

    handleSearchJudul(val) {
        this.current_page = '1' 
        this.searchJudul = val
        this.loadData()
    },

    handleSearchPenanya(val) {
        this.current_page = '1' 
        this.searchPenanya = val
        this.loadData()
    },

    handleSearchEvent(val) {
        this.current_page = '1' 
        this.searchEvent = val
        this.loadData()
    },

    handleSort(val) {
        this.sortBy = val.sortBy
        this.sortByDesc = val.sortDesc

        this.loadData()
    },

    handleRefreshData() {
      this.loadData()
    }
  
  }
}
</script>

<style>

</style>
<template>
  <div>
    <v-container fluid>
      <!-- Form Search -->

      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-header>FILTERS</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row>
              <v-col cols="12" sm="6" md="2">
                <v-text-field
                  filled
                  clearable
                  v-model="judul"
                  label="Pertanyaan ..."
                  @input="searchByJudul"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="2">
                <v-text-field
                  filled
                  clearable
                  v-model="event"
                  label="Code Event ..."
                  @input="searchByEvent"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="2">
                <v-text-field
                  filled
                  clearable
                  v-model="penanya"
                  label="Penanya ..."
                  @input="searchByPenanya"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" sm="6" md="2">
                <v-select
                  filled
                  @change="loadPerPage"
                  v-model="meta.per_page"
                  :items="itemsPerPage"
                  label="Per Page"
                ></v-select>
                
              </v-col>
            </v-row>

          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>


      <!-- Table -->
      <v-data-table
        :headers="headers"
        :items="allQuestionsData"
        :loading="dataTableLoading"
        
        must-sort
        hide-default-footer
        class="elevation-4 mt-5"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
      >

        <!-- Untuk Judul / Bagian Atas -->
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Pertanyaan</v-toolbar-title>
            <v-divider
              class="mx-4"
              inset
              vertical
            ></v-divider>

            <v-spacer></v-spacer>

            <v-divider
              class="mx-4"
              inset
              vertical
            ></v-divider>

            <v-btn
              color="primary"
              dark
              @click="$emit('refresh')"
              small
              class="ma-2"
            >
              <v-icon>
                mdi-reload
              </v-icon>
            </v-btn>
          </v-toolbar>
        </template>

        <!-- Untuk Kolom Penanya -->
        <template
          v-slot:[`item.penanya`]="{ item }"
        >
          {{item.penanya}}
        </template>

        <!-- Untuk Event  -->
        <template
          v-slot:[`item.event`]="{ item }"
        >
          {{item.event.code}}
        </template>

        <!-- Untuk Kolom Like -->
        <template
          v-slot:[`item.like`]="{ item }"
        >
          {{item.like}}
        </template>

        <!-- Untuk Kolom Judul -->
        <template
          v-slot:[`item.judul`]="{ item }"
        >
          {{item.judul}}
        </template>

        <template v-slot:no-data>
          <v-btn color="primary" @click="$emit('refresh')">Reset</v-btn>
        </template>
      </v-data-table>

      <v-pagination
        v-model="meta.current_page"
        :length="meta.last_page"
        :total-visible="6"
        @input="changePage"
        class="mt-3"
      ></v-pagination>

    </v-container>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import _ from 'lodash'

export default {
  name: 'dataPkg',
  props: {
    allQuestionsData: {
        type: Array,
        required: true
    },
    headers: {
        type: Array,
        required: true
    },
    meta: {
        required: true
    },
    dataTableLoading: {
        required: true
    },
  },
  data() {
    return {
      api_url: process.env.VUE_APP_API_ENDPOINT,

      judul: '',
      event: '',
      penanya: '',

      page: '1',

      itemsPerPage: [
        '1',
        '5',
        '10',
        '15',
        '20'
      ],

      sortBy: null, 
      sortDesc: false,

    }
  },

  mounted() {

  },

  watch: {
    sortBy() {
      this.$emit('sort', {
          sortBy: this.sortBy,
          sortDesc: this.sortDesc
      })
    },

    sortDesc() {
      this.$emit('sort', {
          sortBy: this.sortBy,
          sortDesc: this.sortDesc
      })
    }
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

    loadPerPage() {
      this.$emit('per_page', this.meta.per_page)
    },

    changePage(val) {
      this.$emit('pagination', val)
    },

    searchByJudul: _.debounce(function (e) {
      this.$emit('searchJudul', e)
    }, 500),

    searchByEvent: _.debounce(function (e) {
      this.$emit('searchEvent', e)
    }, 500),

     searchByPenanya: _.debounce(function (e) {
      this.$emit('searchPenanya', e)
    }, 500),

  }
}
</script>

<style>

</style>
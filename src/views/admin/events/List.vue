<template>
  <v-container fluid>
    <h1>Events</h1>

    <v-card>
        <v-card-title>
          Data Events
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>

        <v-btn
          dark
          small
          class="ma-2"
          color="success" 
          to="/admin/event/create"
        >
          <v-icon dark>mdi-plus-box-multiple-outline</v-icon>
        </v-btn>

        <v-data-table
          :headers="headers"
          :items="dataEvents"
          :search="search"
          :loading="tableLoading"
          mobile-breakpoint="0"
        >
          <template v-slot:item="row">
              <tr>
                <td>{{row.index + 1}}</td>
                <td>{{row.item.nama_event}}</td>
                <td>{{row.item.code}}</td>
                <td>{{row.item.status}}</td>
                <td>
                  <v-btn
                    small
                    class="mx-2"
                    icon
                    color="pink" 
                    @click="editData(row.item)"
                  >
                      <v-icon dark>mdi-circle-edit-outline</v-icon>
                  </v-btn>

                  <v-btn
                    small
                    class="mx-2"
                    icon
                    color="pink" 
                    @click="deleteData(row.item)"
                  >
                      <v-icon dark>mdi-trash-can-outline</v-icon>
                  </v-btn>
                </td>
              </tr>
          </template>
        </v-data-table>

      </v-card>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import axios from 'axios'
import 'vue-sweetalert2';

export default {
  name: 'event-list',
  data() {
    return {
      api_url: process.env.VUE_APP_API_ENDPOINT,
      search: '',
      tableLoading: false,
      headers: [
        { text: 'No', value: 'no', sortable: false },
        { text: 'Judul', value: 'nama_event' },
        { text: 'Code', value: 'code' },
        { text: 'Status', value: 'status' },
        { text: 'Actions', value: 'controls', sortable: false },
      ],
      dataEvents: []
    }
  },

  mounted() {
    this.getAllEvents()
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

    async getAllEvents() {
      try {

        this.tableLoading = true

        let config = {
          headers: {
            'Authorization': this.user.api_token
          }
        }

        let response = await axios.get(this.api_url + '/admin/events', config)

        this.dataEvents = response.data.data

        this.tableLoading = false
      } catch (error) {
        this.setAlert({
          status : true,
          color  : 'success',
          text  : error.response.message,
        })
      }
    },

    editData(e) {
      this.$router.push('event/edit/' + e.code)
    },

    async deleteData(e) {
      const sw = await this.$swal.fire({
        title: 'Are you sure?',
        text: `Delete "${e.nama_event}" ?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      })
      
      if (sw.value) {
        try {
          
          this.setDialog({
            status : true,
          })
          
          let config = {
            headers: {
              'Authorization': this.user.api_token
            }
          }

          const response = await axios.delete(this.api_url + '/admin/event/' + e.code, config)

          this.setDialog({
            status : false,
          })

          this.getAllEvents()

          this.setAlert({
            status : true,
            color  : 'success',
            text  : response.data.message,
          })
          

        } catch (error) {
          this.setAlert({
            status : true,
            color  : 'error',
            text  : error.response.data.message,
          })

          this.setDialog({
            status : false,
          })
        }
      } 

    },
  }

}
</script>

<style>

</style>
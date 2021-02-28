<template>
  <div>
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
          <v-card-title class="justify-center">Dashboard Admin</v-card-title>

          <v-divider></v-divider>
          
          <center>
           <p>logo</p>
          </center>

          <v-card-text>
            
          </v-card-text>
          <v-card-subtitle>
            Welcome, <strong>{{ this.user.profile.name }}</strong> 
            <br>
            Take a look in NavBar for navigating ...
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'dashboard-admin',
  data() {
    return {

    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/user',
      guest: 'auth/guest',
    }),
  },
}
</script>

<style>

</style>
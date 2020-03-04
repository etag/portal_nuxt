<template>
  <div>
    <b-card class="align-content-center">
      <b-form @submit.prevent="login">
        <b-label for="username"><b>Username</b></b-label>
        <input type="text" placeholder="Enter Username" name="username" required v-model="username">

        <b-label for="password"><b>Password</b></b-label>
        <input type="password" placeholder="Enter Password" name="password" required v-model="password">

        <b-button type="submit">Submit</b-button>
      </b-form>
    </b-card>
  </div>
  <div v-if="msg">
    <b-card class="align-content-center">
      {{ msg }}
    </b-card>
  </div>
</template>

<script>

export default {
  data () {
    return {
      username: null,
      password: null,
      msg: null
    }
  },
  methods: {
    login () {
      let axios = this.$axios
      let nuxt_auth = this.$auth
      let msg = this.msg
      async function postLogin (username, password) {
        let bodyFormData = new FormData()
        bodyFormData.set('username', username)
        bodyFormData.set('password', password)
        bodyFormData.set('submit', 'Log in')
        return await axios.post('/api/api-auth/login/?format=json', bodyFormData, {
          withCredentials: true,
          headers: bodyFormData.getHeaders
        })
      }

      async function getUser () {
        return await axios.get('/api/user/?format=json', {
          withCredentials: true
        })
      }

      Promise.all([postLogin(this.username, this.password), getUser()])
        .then(values => {
          console.log(values)
          console.log(values[1].headers['content-type'])
          if (values[1].headers['content-type'] === 'application/json') {
            nuxt_auth.setToken('local', values[1]['data']['auth-token'])
            nuxt_auth.$storage.setState('loggedIn', true)
            // nuxt_auth.fetchUser()
          } else {
            console.log("Incorrect username or password. Try Again.")
          }
        })
    },
  }
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  text-align: center;
}
</style>

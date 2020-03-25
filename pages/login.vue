<template>
  <div>
    <b-card class="align-content-center">
      <b-form @submit.prevent="userLogin">
        <b-form-group
          id="username-group"
          label="Username:"
          label-for="username-input"
        >
          <b-form-input
            id="username-input"
            v-model="login.username"
            required
            placeholder="Username"
          ></b-form-input>
        </b-form-group>
        <b-form-group
          id="password-group"
          label="Password:"
          label-for="password-input"
        >
          <b-form-input
            id="password-input"
            type="password"
            v-model="login.password"
            required
            placeholder="Password"
          ></b-form-input>
        </b-form-group>
        <b-button type="submit">Submit</b-button>
      </b-form>
    </b-card>
  </div>
  <!--<div v-if="msg">
    <b-card class="align-content-center">
      {{ msg }}
    </b-card>
  </div>
  -->
</template>

<script>

export default {
  data () {
    return {
      login: {
        username: '',
        password: '',
      },
      msg: ''
    }
  },
  methods: {
    async userLogin() {
      try {
        await this.$auth.loginWith('local', { data: this.login })
      } catch (err) {
        console.log(err)
      }
    }
    //login () {
    //  let axios = this.$axios
    //  let nuxt_auth = this.$auth
    //  let msg = this.msg
    //  async function postLogin (username, password) {
    //    let bodyFormData = new FormData()
    //    bodyFormData.set('username', username)
    //    bodyFormData.set('password', password)
    //    bodyFormData.set('submit', 'Log in')
    //    return await axios.post('/api/api-auth/login/?format=json', bodyFormData, {
    //      withCredentials: true,
    //      headers: bodyFormData.getHeaders
    //    })
    //  }
    //
    //  async function getUser () {
    //    return await axios.get('/api/user/?format=json', {
    //      withCredentials: true
    //    })
    //  }
//
    //  Promise.all([postLogin(this.username, this.password), getUser()])
    //    .then(values => {
    //      console.log(values)
    //      console.log(values[1].headers['content-type'])
    //      if (values[1].headers['content-type'] === 'application/json') {
    //        nuxt_auth.setToken('local', values[1]['data']['auth-token'])
    //        nuxt_auth.$storage.setState('loggedIn', true)
    //        // nuxt_auth.fetchUser()
    //      } else {
    //        console.log("Incorrect username or password. Try Again.")
    //      }
    //    })
    //},
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

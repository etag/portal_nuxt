<template>
  <div>

    <!-- TODO: add styling and a form for updating -->

    <div> Avatar: <img :src="profile.gravatar" alt="Avatar Image"></div>
    <div> Avatar Link: {{ profile.gravatar }}</div>
    <div> Username: {{ profile.username }} </div>
    <div> First Name: {{ profile.firstname }} </div>
    <div> Last Name: {{ profile.lastname }} </div>
    <div> Email: {{ profile.email }} </div>

  </div>
</template>

<script>

export default {
  components: {
  },
  computed: {
    profile () {
      return {
        username: this.$store.$auth.user.username,
        firstname: this.$store.$auth.user.first_name,
        lastname: this.$store.$auth.user.last_name,
        email: this.$store.$auth.user.email,
        gravatar: this.$store.$auth.user.gravator_url, // TODO: fix "gravator" typo on API end-point
      }
    },
  },
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

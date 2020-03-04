<template>
  <b-navbar toggleable="md" type="dark" variant="info">
    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

    <b-navbar-brand href="#">{{ title }}</b-navbar-brand>

    <b-collapse is-nav id="nav_collapse">

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-item title="About" class="mh-100" to="/about" exact exact-active-class="active" no-prefetch>About</b-nav-item>
        <b-nav-item title="Map" to="/map" exact exact-active-class="active" no-prefetch>Map</b-nav-item>
        <template v-if="$store.state.auth.loggedIn">
          <b-nav-item title="Reader Data" to="/readerdata" exact exact-active-class="active" no-prefetch>Reader Data</b-nav-item>
          <b-nav-item title="RFID Reads" to="/rfidreads" exact exact-active-class="active" no-prefetch>RFID Reads</b-nav-item>
          <b-nav-item title="Tagged Data" to="/taggeddata" exact exact-active-class="active" no-prefetch>Tagged Data</b-nav-item>
          <b-nav-dropdown text="user">
            <b-dropdown-item title="Profile" to="/profile" exact exact-active-class="active" no-prefetch>Profile</b-dropdown-item>
            <b-dropdown-item title="Logout" v-on:click="logout" exact exact-active-class="active" no-prefetch>Logout</b-dropdown-item>
          </b-nav-dropdown>
        </template>
        <template v-else>
          <b-nav-item title="Login" to="/login" exact exact-active-class="active" no-prefetch>Login</b-nav-item>
        </template>
      </b-navbar-nav>

    </b-collapse>

  </b-navbar>
</template>

<script>
  export default {
    data () {
      return {
        title: "Electronic Transponder Analysis Gateway Data Portal",
      }
    },
    methods: {
      logout () {
        return this.$auth.logout()
      }
    }
  }
</script>

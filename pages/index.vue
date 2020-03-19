<template>
  <div class="container-fluid">
    <div>

    </div>
  </div>
</template>

<script>

export default {
  auth: false,  // this page does not require authentication to view
  middleware ({ store, redirect }) {
    // this is hackish to redirect to the about page
    return redirect('/about')
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

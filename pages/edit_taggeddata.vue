<template>
<div>
  <b-form @submit="saveChanges">

  </b-form>
</div>
</template>

<script>
  export default {
    props: ['item', 'fields'],
    methods: {
      saveChanges() {
        // TODO: add axios patch to submit edits
      }
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

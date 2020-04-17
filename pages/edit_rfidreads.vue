<template>
<div>
  <b-form @submit="saveChanges">
    {{ item.url }}
  </b-form>
</div>
</template>

<script>
  export default {
    computed: {
      item() {
        return this.$store.state.tagReads.activeItem
      },
    },
    methods: {
      saveChanges() {
        // TODO: add axios patch to submit edits
        this.$axios({
          url: this.item.url,
          method: 'PATCH',
          data: fields,
          headers: {Authorization: this.$auth.$storage._state['_token.local']}
        }).then((response) => {
          // check if successful and reroute to taggeddata page
          this.$router.push('rfidreads')
        })
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

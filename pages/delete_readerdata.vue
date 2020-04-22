<template>
  <div>
    <b-card bg-variant="light">
      <b-form-group>
        <b-form @submit.prevent="deleteRecord">
          <b-form-group id="Title" :label="'Do you want to delete record for Reader ID: ' + item.reader_id"/>

          <b-button type="submit" variant="danger">Delete</b-button>
          <b-button type="button" variant="primary" @click="$router.go(-1)">Cancel</b-button>
        </b-form>
      </b-form-group>
    </b-card>

  </div>
</template>

<script>
  export default {
    computed: {
      item() {
        return this.$store.state.readers.activeItem;
      },
    },
    methods: {
      deleteRecord() {
        let notify = this.$notify;
        let router = this.$router;
        console.log(this.item)
        this.$axios({
          url: this.item.url,
          method: 'delete',
          headers: {Authorization: this.$auth.$storage._state['_token.local']}
        }).then(function (response) {
          notify({group: 'alerts', text: 'Record deleted!'});
          router.push('readerdata');
        })
        .catch(function (response) {
          notify({group: 'alerts', text: 'Failed to delete record.'});
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

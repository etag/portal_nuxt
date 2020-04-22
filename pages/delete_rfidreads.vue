<template>
  <div>
    <b-card bg-variant="light">
      <b-form-group>
        <b-form @submit.prevent="deleteRecord">
          <b-form-group id="Title" :label="'Do you want to delete Tag Read: ' + item.tag_id + ' at ' + item.tag_read_time"/>

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
        return this.$store.state.tagReads.activeItem;
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
          router.push('rfidreads');
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

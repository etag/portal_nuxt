<template>
  <div>
    <b-form @submit="saveChanges">
      <b-form-group id="input-group-1" label=ANIMAL_CURRENTMARKER label-for="input-1">
        <b-form-input
          id="input-1"
          :placeholder="item.field_data.ANIMAL_CURRENTMARKER"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="ANIMAL_IDENTIFYINGMARKERSTARTDATE" label-for="input-2">
        <b-form-input
          id="input-2"
          :placeholder="item.field_data.ANIMAL_IDENTIFYINGMARKERSTARTDATE"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-3" label="ANIMAL_ORIGINALMARKER" label-for="input-3">
        <b-form-input
          id="input-3"
          :placeholder="item.field_data.ANIMAL_ORIGINALMARKER"
        ></b-form-input>
      </b-form-group>

      <b-button type="submit" variant="primary">Submit</b-button>
    </b-form>
  </div>
</template>

<script>
  export default {
    computed: {
      item() {
        return this.$store.state.animals.activeItem
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
          this.$router.push('taggeddata')
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
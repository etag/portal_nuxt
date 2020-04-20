<template>
  <div>
    <b-card bg-variant="light">
      <b-form-group>
        <b-form @submit="saveChanges" v-model=form>
          
          <b-form-group id="Title" :label="'Editing User ID: ' + item.user_id"></b-form-group>

          <b-form-group id="input-group-1" label="Tag_ID" label-for="input-1">
            <b-form-input
              id="input-1"
              :value="item.tag_id"
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-2" label="Tag_Read_Time" label-for="input-2">
            <b-form-input
              id="input-2"
              :value="item.tag_read_time"
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-3" label="Reader_ID" label-for="input-3">
            <b-form-input
              id="input-3"
              :value="item.reader_id"
            ></b-form-input>
          </b-form-group>

          <div v-for="(value, name) in item.accessory_data">
            <b-form-group id="input-group-4" :label="`${name}`" label-for="input-4">
              <b-form-input
                id="input-4"
                :value="`${value}`"
              ></b-form-input>
            </b-form-group>
          </div>

          <b-button type="submit" variant="primary">Submit</b-button>
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
        return this.$store.state.tagReads.activeItem
      },
      form: {
          Tag_ID: '',
          Tag_Read_Time: '',
          Reader_ID: '',
          Accessory_Data: null,
      },
    },
    methods: {
      saveChanges(evt) {
        evt.preventDefault()
        // TODO: add axios patch to submit edits
        this.$axios({
          url: this.item.url,
          method: 'patch',
          data: this.$item,
          headers: {Authorization: this.$auth.$storage._state['_token.local']}
        }).then(function (response) {
            //this.$router.push('taggeddata')
            console.log(response);
        })
        .catch(function (response) {
            //handle error
            console.log(response);
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

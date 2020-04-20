<template>
  <div>
    <b-card bg-variant="light">
      <b-form-group>
        <b-form @submit.prevent="saveChanges" v-model=form>

          <b-form-group id="Title" :label="'Editing User ID: ' + item.user_id"></b-form-group>
          
          <b-form-group id="input-group-1" label="Reader_ID" label-for="input-1">
            <b-form-input
              id="Reader_ID"
              :value="item.reader_id"
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-2" label="Description" label-for="input-2">
            <b-form-input
              id="Description"
              :value="item.description"
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-3" label=fetchLoc_id label-for="input-3">
            <b-form-input
              id="input-2"
              :value="coordinates.lat"
            ></b-form-input>
          </b-form-group>

          <b-button type="submit" variant="primary">Submit</b-button>
          <b-button type="button" variant="primary" @click="$router.go(-1)">Cancel</b-button>
          
        </b-form>
      </b-form-group>
      <b-button type="button" variant="primary" @click.prevent="fetchLoc_id">test</b-button>
    </b-card>

  </div>
</template>

<script>
  export default {
    async created() {
      var self=this
      let { reader_data } = this.$axios.get('/api/etag/reader_location/?reader_id=' + this.item.reader_id + '&format=json',{
        headers: {Authorization: this.$auth.$storage._state['_token.local']}
      }).then(function (reader_data, vm){
        let { location_data } = self.$axios.get('/api/etag/locations/?location_id=' + reader_data.data.results[0].location_id + '&format=json'
          ).then(function (location_data) {
            this.coordinates.lat = location_data.data.results[0].latitude;
            this.coordinates.lon = location_data.data.results[0].longitude;
      })
      });
    },
    computed: {
      item() {
        return this.$store.state.readers.activeItem
      },
      form: {
          Reader_ID: '',
          Description: '',
      },
      coordinates: {
        lat: '',
        lon: '',
      }
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
      },
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

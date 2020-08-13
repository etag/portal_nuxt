<template>
  <div>
    <b-card bg-variant="light">
      <b-form-group>
        <b-form @submit.prevent="saveChanges" @load="$fetch" v-model=form>

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

          <b-form-group id="input-group-3" label="Latitude" label-for="input-3">
            <b-form-input
              id="input-3"
              :value="coordinates.lat"
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-4" label="Longitude" label-for="input-4">
            <b-form-input
              id="input-4"
              :value="coordinates.lon"
            ></b-form-input>
          </b-form-group>

          <b-button type="submit" variant="primary">Submit</b-button>
          <b-button type="button" variant="primary" @click="$router.go(-1)">Cancel</b-button>
          
        </b-form>
      </b-form-group>
    </b-card>

  </div>
</template>

<script>
  export default {
    data () {
    return {
      coordinates: {
        lat: '',
        lon: '',
      }
    }
    },
    computed: {
      item() {
        return this.$store.state.readers.activeItem
      },
      form: {
          Reader_ID: '',
          Description: '',
      }
    },
    async fetch () {
      var self=this
      let { reader_data } = this.$axios.get('/api/etag/reader_location/?reader_id=' + this.item.reader_id + '&format=json',{
        headers: {Authorization: this.$auth.$storage._state['_token.local']}
      }).then(function (reader_data, vm){
        let { location_data } = self.$axios.get('/api/etag/locations/?location_id=' + reader_data.data.results[0].location_id + '&format=json'
          ).then(function (location_data) {
            self.coordinates.lat = location_data.data.results[0].latitude;
            self.coordinates.lon = location_data.data.results[0].longitude;
      })
      });
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
            //this.$router.push('/readerdata')
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

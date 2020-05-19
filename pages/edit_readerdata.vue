<template>
  <div>
    <b-card bg-variant="light">
      <b-form-group>
        <b-form @submit.prevent="saveChanges" @load="$fetch">
          <b-form-group id="Title" :label="'Editing User ID: ' + item.user_id"></b-form-group>

          <b-form-group id="input-group-1" label="Reader_ID" label-for="input-1">
            <b-form-input id="Reader_ID" v-model="form.Reader_ID" :placeholder="item.reader_id"></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-2" label="Description" label-for="input-2">
            <b-form-input
              id="Description"
              v-model="form.Description"
              :placeholder="item.description"
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-3" label="Latitude" label-for="input-3">
            <b-form-input id="input-3" v-model="form.cor_lat" :placeholder="coordinates.lat"></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-4" label="Longitude" label-for="input-4">
            <b-form-input id="input-4" v-model="form.cor_lon" :placeholder="coordinates.lon"></b-form-input>
          </b-form-group>

          <b-button type="submit" variant="primary">Submit</b-button>
          <b-button type="button" variant="primary" @click="$router.go(-1)">Cancel</b-button>
        </b-form>
      </b-form-group>
    </b-card>
  </div>
</template>

<script>
import Vue from "vue";
import Vuex from "vuex";

export default {
  data() {
    return {
      form: {
        Reader_ID: "",
        Description: "",
        Cord_lat: "",
        Cord_lon: ""
      },
      coordinates: {
        lat: "",
        lon: ""
      }
    };
  },
  computed: {
    item() {
      return this.$store.state.readers.activeItem;
    }
  },
  async fetch() {
    var self = this;
    let { reader_data } = this.$axios
      .get(
        "/api/etag/reader_location/?reader_id=" +
          this.item.reader_id +
          "&format=json",
        {
          headers: { Authorization: this.$auth.$storage._state["_token.local"] }
        }
      )
      .then(function(reader_data, vm) {
        let { location_data } = self.$axios
          .get(
            "/api/etag/locations/?location_id=" +
              reader_data.data.results[0].location_id +
              "&format=json"
          )
          .then(function(location_data) {
            self.coordinates.lat = location_data.data.results[0].latitude;
            self.coordinates.lon = location_data.data.results[0].longitude;
          });
      });
  },
  methods: {
    saveChanges(evt) {
      evt.preventDefault();
      this.$store.commit("update", {
        description: this.form.Description,
        reader_id: this.form.Reader_ID
      });
    }
  }
};
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  text-align: center;
}
</style>

<template>
  <div>
    <b-card bg-variant="light">
      <b-form-group>
        <b-form @submit.prevent="saveChanges" @load="$fetch">
          <b-form-group id="Title" :label="'Editing User ID: ' + item.user_id"></b-form-group>

          <b-form-group id="input-group-1" label="Reader_ID" label-for="input-1">
            <b-form-input
              id="Reader_ID"
              v-model="form.Reader_ID"
              :placeholder="item.reader_id"
              readonly
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-2" label="Description" label-for="input-2">
            <b-form-input
              id="Description"
              v-model="form.Description"
              :placeholder="item.description"
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-3" label="Start Timestamp" label-for="input-3">
            <b-form-input id="input-3" v-model="form.cor_lat" :placeholder="timestamp.start"></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-4" label="End Timestamp" label-for="input-4">
            <b-form-input id="input-4" v-model="form.cor_lon" :placeholder="timestamp.end"></b-form-input>
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
      timestamp: {
        start: "",
        end: ""
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
      .then(function(reader_data) {
        try {
          self.timestamp.start = reader_data.data.results[0].start_timestamp;
          self.timestamp.end = reader_data.data.results[0].end_timestamp;
        } catch {
          self.timestamp.start = "None";
          self.timestamp.end = "None";
        }
      });
  },
  methods: {
    saveChanges(evt) {
      evt.preventDefault();
      var self = this;
      let { result } = this.$axios
        .get(
          "https://head.ouetag.org/api/etag/reader_location/?reader_id=" +
            this.$store.state.readers.activeItem.reader_id,
          {
            headers: {
              Authorization: this.$auth.$storage._state["_token.local"]
            }
          }
        )
        .then(function(result) {
          var payload = {
            description: self.form.Description,
            reader_id: self.form.reader_id
          };
          self.$store.commit("readers/update", payload);
          console.log(result.data.results[0].location_id);
          self.$axios
            .patch("/api/etag/readers/" + result.data.results[0].reader_id, {
              url: self.$store.state.readers.activeItem.url,
              reader_id: self.form.reader_id,
              description: self.form.Description,
              user_id: self.$store.state.readers.activeItem.user_id,
              headers: {
                Authorization: self.$auth.$storage._state["_token.local"]
              }
            })
            .then(function() {
              self.$router.push("readerdata");
            });
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

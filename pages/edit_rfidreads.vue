<template>
  <div>
    <b-card bg-variant="light">
      <b-form-group>
        <b-form @submit="saveChanges">
          <b-form-group id="Title" :label="'Editing User ID: ' + item.user_id"></b-form-group>

          <b-form-group id="input-group-1" label="Tag_ID" label-for="input-1">
            <b-form-input
              id="input_tag_id"
              v-model="form.tag_id"
              :placeholder="item.tag_id"
              readonly
            ></b-form-input>
          </b-form-group>

          <b-form-group
            id="input-group-2"
            label="Tag_Read_Time (format: XXXX-XX-XXTXX:XX:XXZ)"
            label-for="input-2"
          >
            <b-form-input
              id="input_tag_read_time"
              v-model="form.tag_read_time"
              :placeholder="item.tag_read_time"
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-3" label="Reader_ID" label-for="input-3">
            <b-form-input
              id="input_reader_id"
              v-model="form.reader_id"
              :placeholder="item.reader_id"
              readonly
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
  data() {
    return {
      form: {
        tag_id: "",
        tag_read_time: "",
        reader_id: ""
      }
    };
  },
  computed: {
    item() {
      return this.$store.state.tagReads.activeItem;
    }
  },
  methods: {
    saveChanges(evt) {
      evt.preventDefault();
      var self = this;
      let { result } = this.$axios
        .get(
          "https://head.ouetag.org/api/etag/tag_reads/?url=" +
            this.$store.state.tagReads.activeItem.url,
          {
            headers: {
              Authorization: this.$auth.$storage._state["_token.local"]
            }
          }
        )
        .then(function(result) {
          if (self.form.tag_id === "") {
            self.form.tag_id = document
              .getElementById("input_tag_id")
              .getAttribute("placeholder");
          }
          if (self.form.tag_read_time === "") {
            self.form.tag_read_time = document
              .getElementById("input_tag_read_time")
              .getAttribute("placeholder");
          }
          if (self.form.reader_id === "") {
            self.form.reader_id = document
              .getElementById("input_reader_id")
              .getAttribute("placeholder");
          }

          var payload = {
            tag_read_time: self.form.tag_read_time
          };
          self.$store.commit("tagReads/update", payload);
          console.log(result);
          var url = result.data.results[0].url;
          var url_id = url.substr(url.length - 5).slice(0, -1);
          console.log(url_id);

          self.$axios
            .patch("/api/etag/tag_reads/" + url_id, {
              url: self.$store.state.tagReads.activeItem.url,
              tag_read_time: self.form.tag_read_time,
              reader_id: self.form.reader_id,
              headers: {
                Authorization: self.$auth.$storage._state["_token.local"]
              }
            })
            .then(function() {
              self.$router.push("rfidreads");
            })
            .catch(function(response) {
              //handle error
              console.log(response);
              console.log("check format");
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

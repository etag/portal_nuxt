<template>
  <div>
    <b-card bg-variant="light">
      <b-form-group>
        <b-form @submit.prevent="saveChanges">
          <b-form-group id="Title" :label="'Editing Animal ID: ' + item.animal_id"></b-form-group>

          <b-form-group id="input-group-1" label="SPECIES" label-for="input-1">
            <b-form-input id="input_Species" v-model="form.Species" text="item.species"></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-2" label="ANIMAL_CURRENTMARKER">
            <b-form-input id="input_ANIMAL_CURRENTMARKER" v-model="form.ANIMAL_CURRENTMARKER"></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-3" label="ANIMAL_IDENTIFYINGMARKERSTARTDATE">
            <b-form-input
              id="input_ANIMAL_IDENTIFYINGMARKERSTARTDATE"
              v-model="form.ANIMAL_IDENTIFYINGMARKERSTARTDATE"
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-4" label="ANIMAL_ORIGINALMARKER">
            <b-form-input id="input_ANIMAL_ORIGINALMARKER" v-model="form.ANIMAL_ORIGINALMARKER"></b-form-input>
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
  computed: {
    item() {
      return this.$store.state.animals.activeItem;
    },
  },
  data() {
    return {
      form: {
        Species: this.$store.state.animals.activeItem.species,
        ANIMAL_CURRENTMARKER: this.$store.state.animals.activeItem.field_data
          .ANIMAL_CURRENTMARKER,
        ANIMAL_IDENTIFYINGMARKERSTARTDATE: this.$store.state.animals.activeItem
          .field_data.ANIMAL_IDENTIFYINGMARKERSTARTDATE,
        ANIMAL_ORIGINALMARKER: this.$store.state.animals.activeItem.field_data
          .ANIMAL_ORIGINALMARKER,
      },
    };
  },

  methods: {
    saveChanges(evt) {
      evt.preventDefault();
      var self = this;
      let { result } = this.$axios
        .get(
          "https://head.ouetag.org/api/etag/animals/?animal_id=" +
            this.$store.state.animals.activeItem.animal_id,
          {
            headers: {
              Authorization: this.$auth.$storage._state["_token.local"],
            },
          }
        )
        .then(function (result) {
          console.log(self.form.Species);
          if (self.form.Species === "") {
            self.form.Species = document
              .getElementById("input_Species")
              .getAttribute("v-model");
          }
          console.log(self.form.Species);
          console.log(self.form.ANIMAL_IDENTIFYINGMARKERSTARTDATE);
          if (self.form.ANIMAL_IDENTIFYINGMARKERSTARTDATE === "") {
            self.form.ANIMAL_IDENTIFYINGMARKERSTARTDATE = document
              .getElementById("input_ANIMAL_IDENTIFYINGMARKERSTARTDATE")
              .getAttribute("v-model");
          }
          console.log(self.form.ANIMAL_IDENTIFYINGMARKERSTARTDATE);
          if (self.form.ANIMAL_ORIGINALMARKER === "") {
            self.form.ANIMAL_ORIGINALMARKER = document
              .getElementById("input_ANIMAL_ORIGINALMARKER")
              .getAttribute("v-model");
          }
          if (self.form.ANIMAL_CURRENTMARKER === "") {
            self.form.ANIMAL_CURRENTMARKER = document
              .getElementById("input_ANIMAL_CURRENTMARKER")
              .getAttribute("v-model");

            var payload = {
              species: self.form.Species,
              field_data: {
                ANIMAL_IDENTIFYINGMARKERSTARTDATE:
                  self.form.ANIMAL_IDENTIFYINGMARKERSTARTDATE,
                ANIMAL_ORIGINALMARKER: self.form.ANIMAL_ORIGINALMARKER,
                ANIMAL_CURRENTMARKER: self.form.ANIMAL_CURRENTMARKER,
              },
            };
            self.$store.commit("animals/update", payload);

            var data = {
              ANIMAL_IDENTIFYINGMARKERSTARTDATE:
                self.form.ANIMAL_IDENTIFYINGMARKERSTARTDATE,
              ANIMAL_ORIGINALMARKER: self.form.ANIMAL_ORIGINALMARKER,
              ANIMAL_CURRENTMARKER: self.form.ANIMAL_CURRENTMARKER,
            };

            var f_data = JSON.stringify(data);

            console.log(f_data);

            self.$axios
              .patch("/api/etag/animals/" + result.data.results[0].animal_id, {
                url: self.$store.state.animals.activeItem.url,
                species: self.form.Species,
                field_data: f_data,
                headers: {
                  Authorization: self.$auth.$storage._state["_token.local"],
                },
              })
              .then(function () {
                self.$router.push("taggeddata");
              });
          } else {
            var payload = {
              species: self.form.Species,
              field_data: {
                ANIMAL_IDENTIFYINGMARKERSTARTDATE:
                  self.form.ANIMAL_IDENTIFYINGMARKERSTARTDATE,
                ANIMAL_ORIGINALMARKER: self.form.ANIMAL_ORIGINALMARKER,
              },
            };
            self.$store.commit("animals/update", payload);

            var data = {
              ANIMAL_IDENTIFYINGMARKERSTARTDATE:
                self.form.ANIMAL_IDENTIFYINGMARKERSTARTDATE,
              ANIMAL_ORIGINALMARKER: self.form.ANIMAL_ORIGINALMARKER,
              ANIMAL_CURRENTMARKER: self.form.ANIMAL_CURRENTMARKER,
            };

            var f_data = JSON.stringify(data);

            console.log(f_data);

            self.$axios
              .patch("/api/etag/animals/" + result.data.results[0].animal_id, {
                url: self.$store.state.animals.activeItem.url,
                species: self.form.Species,
                field_data: f_data,
                headers: {
                  Authorization: self.$auth.$storage._state["_token.local"],
                },
              })
              .then(function () {
                self.$router.push("taggeddata");
              });
          }
        });
    },
  },
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

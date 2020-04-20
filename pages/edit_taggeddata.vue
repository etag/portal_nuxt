<template>
  <div>
    <b-card bg-variant="light">
      <b-form-group>
        <b-form @submit="saveChanges" v-model=form>

          <b-form-group id="Title" :label="'Editing Animal ID: ' + item.animal_id"></b-form-group>
          
          <b-form-group id="input-group-1" label=SPECIES label-for="input-1">
            <b-form-input
              id="input-1"
              :value="item.species"
            ></b-form-input>
          </b-form-group>
          
          <div v-for="(value, name) in item.field_data">
            <b-form-group id="input-group-3" :label="`${name}`" label-for="input-3">
              <b-form-input
                id="input-3"
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
    data() {
      return {
        item: this.$store.state.animals.activeItem,
        form: {
          SPECIES: '',
          ANIMAL_CURRENTMARKER: '',
          ANIMAL_IDENTIFYINGMARKERSTARTDATE: '',
          ANIMAL_ORIGINALMARKER: ''
        }
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
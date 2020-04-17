<template>
  <div id="outter">
    <div id="viz">
      <!-- This is a place holder for the antenna visualization -->
    </div>
    <div id="listruns">
      <!-- This is a place holder to select results of previous runs -->
    </div>
    <div id="input">
      <b-form @submit.prevent="submitAntenna">
        <b-form-group id="ra-group" label="Width" label-for="ra-input">
          <b-form-input id="ra-input" v-model="ra" required/>
        </b-form-group>
        <b-form-group id="ri-group" label="Length" label-for="ri-input">
          <b-form-input id="ri-input" v-model="ri" required/>
        </b-form-group>
        <b-form-group id="phi-group" label="Pitch" label-for="phi-input">
          <b-form-input id="phi-input" v-model="phi" required/>
        </b-form-group>
        <b-form-group id="n-group" label="Number of turns along Z axis" label-for="n-input">
          <b-form-input id="n-input" v-model="n" required/>
        </b-form-group>
        <b-form-group id="o-group" label="Orientation" label-for="o-input">
          <b-form-input id="o-input" v-model="o" required/>
        </b-form-group>
        <b-form-group id="wt-group" label="Thickness of wire" label-for="wt-input">
          <b-form-input id="wt-input" v-model="wt" required/>
        </b-form-group>
        <b-form-group id="h-group" label="Height of multi-coiled antenna" label-for="h-input">
          <b-form-input id="h-input" v-model="h" disabled/>
        </b-form-group>
        <b-form-group id="nxy-group" label="Number of turns on XY plane" label-for="nxy-input">
          <b-form-input id="nxy-input" v-model="nxy" required/>
        </b-form-group>
      <b-button type="submit">Submit</b-button>
      </b-form>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        // The following store user inputs for submission to antenna visualization api
        ra: 0.3, // [m] radius_a (think of it as the "width" if it was a rect)
        ri: 0.3, // [m] radius_i (think of it as the "length" if it was a rect)
        phi: 2,  // [deg] sets the "pitch"
        n: 2,    // number of turns going along the z-direction
        o: 1,    // orientable (clock-wise or counter clock-wise)
        wt: 0.1, // [m] wire thickness
        nxy: 1,   // number of turns along the xy-plane

      }
    },
    computed: {
      // This is a calculated value based off of the user inputs
      h () {
        return ((1.1) * (2 * this.wt * this.n)) // height of the multi-coiled wire antenna
      },
    },
    methods: {
      async submitAntenna() {
        // TODO: get result to load data for visualization
        try {
          await this.$axios({
            url: '/api/queue/run/etagq.tasks.antenna.process_to_file/?format=json',
            method: 'POST',
            headers: {Authorization: this.$auth.$storage._state['_token.local']},
            data: {
              function: "etagq.tasks.antenna.process_to_file",
              queue: "celery",
              kwargs: {
                ra:  this.ra,
                ri:  this.ri,
                phi: this.phi,
                n:   this.n,
                o:   this.o,
                wt:  this.wt,
                h:   this.h,
                nxy: this.nxy,
              }
            }
          })
        } catch (err) {
          console.log(err)
        }
      }
    }
  }
</script>

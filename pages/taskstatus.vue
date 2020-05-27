<template>
  <div>
    <b-card>
      <p v-if="$fetchState.pending">Fetching task details...</p>
      <p v-else-if="$fetchState.error">Error while fetching task: {{ $fetchState.error.message }}</p>
      <ul v-else>
        <vue-json-pretty
          :data="status"
        />
      </ul>
    </b-card>
    <b-button type="button" variant="primary" @click="$fetch">Refresh</b-button>
    <b-button type="button" variant="primary" @click="$router.go(-1)">OK</b-button>
  </div>
</template>

<script>
  import VueJsonPretty from 'vue-json-pretty'
  export default {
    components: {
      VueJsonPretty
    },
    async fetch () {
      let { data } = await this.$axios.get(this.task.result.replace(this.baseUrl, "") + '?format=json');
      console.log(data);
      this.status = data;
    },
    data() {
      return {
        status: {},
        baseUrl: process.env.baseUrl
      }
    },
    computed: {
      task() {
        return this.$store.state.task.activeItem;
      },
    }
  }

</script>

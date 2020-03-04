<template>
  <div>
    <b-table
      show-empty
      small
      stacked="md"
      :items="items"
      :fields="fields"
    >

    </b-table>
    page: {{ page }}
    pagesize: {{ pageSize }}
    next: {{ nextUrl }}
  </div>
  <div>
    <dropzone
      id="el"
      :options="dzoptions"
      v-on:vdropzone-error="failEvent"
      v-on:vdropzone-sending="sendingEvent"
      v-on:vdropzone-success="successEvent"
    />
  </div>
</template>

<script>


export default {
  async fetch ({ store, params, app: {$axios}}) {
    let { data } = await $axios.get('/api/etag/tags/' +
      '?page=' + store.state.tags.page +
      '&page_size=' + store.state.tags.pageSize +
      '&format=json'
    )
    store.commit('tags/setList', data.results)
    store.commit('tags/setCount', data.count)
    store.commit('tags/setPrev', data.prev)
    store.commit('tags/setNext', data.next)
  },
  components: {
    Dropzone
  },
  data() {
    return {
      api_callback: 'etagq.tasks.tasks.etagDataUpload',  // This is the full name of the upload task in cyberCommons
      dzoptions: {
        dictDefaultMessage: 'Drop file here or click to upload.',
        acceptedFiles: '.csv',
        withCredentials: true,
        // headers: {'X-CSRFToken': this.getCookie('csrftoken')},
        url: "/api/etag/file-upload/"
      }
    }
  },
  computed: {
    items () {
      return this.$store.state.tags.list
    },
    fields () {
      return ['tag_id', 'description']
    },
    totalCount () {
      return this.$store.state.tags.count
    },
    page () {
      return this.$store.state.tags.page
    },
    pageSize () {
      return this.$store.state.tags.pageSize
    },
    prevUrl () {
      return this.$store.state.tags.prev
    },
    nextUrl () {
      return this.$store.state.tags.next
    },
  },
  mounted () {
    const instance = this.$refs.el.dropzone
  },
  methods: {
    downloadTemplate() {
      location.href = 'api/etag/file-template/?filetype=animals'
    },
    downloadData() {
      location.href = 'api/etag/file-download/?format=csv&filetype=animals'
    },
    failEvent(file, message, xhr) {
      console.log(file)
      console.log(message)
      console.log(xhr)
      // TODO: add failure handling
      // See for available events: https://rowanwins.github.io/vue-dropzone/docs/dist/#/events
    },
    sendingEvent(file, xhr, formData) {
      formData.append('callback', this.api_callback)
      formData.append('filetype', this.filetype)
    },
    successEvent(file, response) {
      console.log(file)
      console.log(response)
      // TODO: check status code returned in response. Success here does not mean callback was successfull
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

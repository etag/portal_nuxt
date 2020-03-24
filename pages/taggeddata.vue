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

    <dropzone id="dzfile" ref="el" :options="options" :destroyDropzone="true"></dropzone>
    <b-button type="button" @click="downloadTemplate()"><font-awesome-icon icon="file-csv" /><span>Download Template</span></b-button>
    <b-button type="button" @click="downloadData()"><font-awesome-icon icon="cloud-download-alt" /><span>Download Data</span></b-button>

  </div>
  <!--<div>
    <dropzone
      id="el"
      :options="dzoptions"
      v-on:vdropzone-error="failEvent"
      v-on:vdropzone-sending="sendingEvent"
      v-on:vdropzone-success="successEvent"
    />
  </div>-->
</template>

<script>
import Dropzone from 'nuxt-dropzone'
import 'nuxt-dropzone/dropzone.css'

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
      options: {
        dictDefaultMessage: 'Drop file here or click to upload.',
        acceptedFiles: '.csv',
        // withCredentials: true,
        // headers: {'X-CSRFToken': this.getCookie('csrftoken')},
        headers: {
          'X-CSRFToken': this.$auth.$storage.getCookie('csrftoken'),
          'Authorization': this.$auth.$storage._state['_token.local']
        },
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
    console.log(this.$auth.$storage.getCookie('csrftoken'))
  },
  methods: {
    downloadFile(url,filename) {
      this.$axios({
        url: url,
        method: 'GET',
        responseType: 'blob',
        headers: {Authorization: this.$auth.$storage._state['_token.local']}
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
      })
    },
    downloadTemplate() {
      this.downloadFile('api/etag/file-template/?filetype=animals', 'taggeddata_template.csv')
      //location.href = 'api/etag/file-template/?filetype=animals'
    },
    downloadData() {
      this.downloadFile('api/etag/file-download/?format=csv&filetype=animals', 'taggeddata.csv')
      //location.href = 'api/etag/file-download/?format=csv&filetype=animals'
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

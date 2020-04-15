<template>
  <div>
    <b-table
      show-empty
      small
      striped
      borderless
      stacked="md"
      :items="items"
      :fields="fields"
    >
      <!--<template v-slot="actions" slot-scope="row">-->
      <template v-slot:cell(actions)="row">
        <!-- We use @click.stop here to prevent a 'row-clicked' event from also happening -->
        <b-button size="sm" @click.stop="editRecord(row)" class="mr-1" variant="primary">
          <font-awesome-icon icon="edit" />
        </b-button>
        <b-button size="sm" @click.stop="deleteRecord(row)" class="mr-1" variant="danger">
          <font-awesome-icon icon="trash" />
        </b-button>
      </template>
    </b-table>
    <b-button @click="fetchPrev" :disabled="!prevUrl"><font-awesome-icon icon="angle-left" /></b-button>
    page {{ page }} of {{ totalPages }}
    <b-button @click="fetchNext" :disabled="!nextUrl"><font-awesome-icon icon="angle-right" /></b-button>

    <dropzone id="dzfile" ref="el"
      :options="options"
      :destroyDropzone="true"
      :duplicateCheck="true"
      @vdropzone-sending="sendingEvent"
      @vdropzone-success="successEvent"
    />

    <b-button type="button" @click="downloadTemplate"><font-awesome-icon icon="file-csv" /><span> Download Template </span></b-button>
    <b-button type="button" @click="downloadData"><font-awesome-icon icon="cloud-download-alt" /><span> Download Data </span></b-button>

  </div>
</template>

<script>
import Dropzone from 'nuxt-dropzone'
import 'nuxt-dropzone/dropzone.css'

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export default {
  async fetch ({ store, params, app: {$axios}}) {
    let { data } = await $axios.get('/api/etag/animals/' +
      '?page=' + store.state.animals.page +
      '&page_size=' + store.state.animals.pageSize +
      '&format=json'
    )
    store.commit('animals/setList', data.results)
    store.commit('animals/setCount', data.count)
    store.commit('animals/setPrev', data.previous)
    store.commit('animals/setNext', data.next)
  },
  components: {
    Dropzone
  },
  data() {
    return {
      filetype: 'animals',  // This is used by the backend for processing file upload
      api_callback: 'etagq.tasks.tasks.etagDataUpload',  // This is the full name of the upload task in cyberCommons
      baseUrl: process.env.baseUrl,
      options: {
        dictDefaultMessage: 'Drop file here or click to upload.',
        acceptedFiles: '.csv',
        headers: {
          'X-CSRFToken': getCookie('csrftoken'),
          'Authorization': this.$auth.$storage._state['_token.local']
        },
        url: "/api/etag/file-upload/"
      }
    }
  },
  computed: {
    items () {
      return this.$store.state.animals.list
    },
    fields () {
      return ['actions', 'animal_id', 'species', 'field_data']
    },
    totalCount () {
      return this.$store.state.animals.count
    },
    page () {
      return this.$store.state.animals.page
    },
    pageSize () {
      return this.$store.state.animals.pageSize
    },
    totalPages () {
      return Math.ceil(this.totalCount / this.pageSize)
    },
    prevUrl () {
      return this.$store.state.animals.prev
    },
    nextUrl () {
      return this.$store.state.animals.next
    },
  },
  methods: {
    async fetchPage(url) {
      let { data } = await this.$axios.get(url.replace(this.baseUrl, ""))
      this.$store.commit('animals/setList', data.results)
      this.$store.commit('animals/setPage', parseInt(url.match(/(?<=page=)[0-9]+/g)))  // extract page number from url
      // this.$store.commit('animals/setCount', data.count)
      this.$store.commit('animals/setPrev', data.previous)
      this.$store.commit('animals/setNext', data.next)
    },
    fetchNext() {
      this.fetchPage(this.nextUrl)
    },
    fetchPrev() {
      this.fetchPage(this.prevUrl)
    },
    editRecord(row) {
      this.$store.commit('animals/setActiveItem', row.item)
      this.$router.push('edit_taggeddata')
    },
    deleteRecord(row) {
      // TODO: confirm removal and remove record
      console.log(row.item.url)
    },
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
      let taskid = response[0].callback.response.task_id
      this.$axios.get("/api/queue/task/" + taskid)
        .then(response => {
          console.log(response.data.result)
        })
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

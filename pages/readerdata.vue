<template>
  <div>
    <!-- begin description section -->
    <template>
      <b-card>
                Please upload data on this page before uploading RFID Reads.  If you have already uploaded both Tagged Data and Reader Data, you can go directly to <a href="https://head.ouetag.org/rfidreads" target="_blank">RFID Reads</a>.  To view templates and example data, visit the <a href="https://github.com/etag/user_documentation/blob/master/User_Guide_for_ETAG.md#quick-start-guide-how-do-i-use-the-etag-website" target="_blank">User Guide, step 4.</a>
      </b-card>
    </template>
    <!-- end description section -->

    <!-- begin upload data section -->
    <b-card>
      <template v-if="processing">
        Processing upload...
      </template>

      <dropzone id="dzfile" ref="el"
                :options="options"
                :destroyDropzone="true"
                :duplicateCheck="true"
                @vdropzone-sending="sendingEvent"
                @vdropzone-success="successEvent"
      />
    </b-card>
    <!-- end upload data section -->

    <b-card>
      <!-- begin pagination tools -->
      <b-container fluid="sm">
        <b-button @click="fetchFirst"><font-awesome-icon icon="backward" /></b-button>
        <b-button @click="fetchPrev" :disabled="!prevUrl"><font-awesome-icon icon="angle-left" /></b-button>
        page {{ page }} of {{ totalPages }}
        <b-button @click="fetchNext" :disabled="!nextUrl"><font-awesome-icon icon="angle-right" /></b-button>
        <b-button @click="fetchLast"><font-awesome-icon icon="forward" /></b-button>
        <input v-model="gotoPage" placeholder="page #" style="max-width: 70px"><b-button @click="fetchPageByNumber">Go</b-button>

        <b-button type="button" @click="downloadTemplate"><font-awesome-icon icon="file-csv" /><span> Download Template </span></b-button>
        <b-button type="button" @click="downloadData"><font-awesome-icon icon="cloud-download-alt" /><span> Download Data </span></b-button>
      </b-container>
      <!-- end pagination tools -->

      <!-- begin data table section -->
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
    <!-- end data table section -->

    <!-- begin pagination tools -->
    <b-container fluid="sm">
      <b-button @click="fetchFirst"><font-awesome-icon icon="backward" /></b-button>
      <b-button @click="fetchPrev" :disabled="!prevUrl"><font-awesome-icon icon="angle-left" /></b-button>
      page {{ page }} of {{ totalPages }}
      <b-button @click="fetchNext" :disabled="!nextUrl"><font-awesome-icon icon="angle-right" /></b-button>
      <b-button @click="fetchLast"><font-awesome-icon icon="forward" /></b-button>
      <input v-model="gotoPage" placeholder="page #" style="max-width: 70px"><b-button @click="fetchPageByNumber">Go</b-button>

      <b-button type="button" @click="downloadTemplate"><font-awesome-icon icon="file-csv" /><span> Download Template </span></b-button>
      <b-button type="button" @click="downloadData"><font-awesome-icon icon="cloud-download-alt" /><span> Download Data </span></b-button>
    </b-container>
    <!-- end pagination tools -->
    </b-card>
  </div>
</template>

<script>
  import Dropzone from 'nuxt-dropzone'
  import 'nuxt-dropzone/dropzone.css'
  import * as R from 'ramda'

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

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
      let { data } = await $axios.get('/api/etag/readers/' +
      '?page=' + store.state.readers.page +
      '&page_size=' + store.state.readers.pageSize +
      '&format=json'
      )
      store.commit('readers/setList', data.results)
      store.commit('readers/setCount', data.count)
      store.commit('readers/setPrev', data.prev)
      store.commit('readers/setNext', data.next)
    },
    components: {
      Dropzone
    },
    data() {
      return {
        filetype: 'locations',  // This is used by the backend for processing file upload
        api_callback: 'etagq.tasks.tasks.etagDataUpload',  // This is the full name of the upload task in cyberCommons
        baseUrl: process.env.baseUrl,
        gotoPage: null,  // This holds the user supplied page number to directly goto for pagination
        options: {
          dictDefaultMessage: 'Drop file here or click to upload.',
          acceptedFiles: '.csv',
          headers: {
            'X-CSRFToken': getCookie('csrftoken'),
            'Authorization': this.$auth.$storage._state['_token.local']
          },
          url: "/api/etag/file-upload/"
        }
        ,
        processing: false  // flag to display processing upload message to user
      }
    },
    computed: {
      items () {
        return this.$store.state.readers.list
      },
      fields () {
        return [
          'actions',
          'reader_id',
          'description',
        ]
      },
      totalCount () {
        return this.$store.state.readers.count
      },
      page () {
        return this.$store.state.readers.page
      },
      pageSize () {
        return this.$store.state.readers.pageSize
      },
      totalPages () {
        let pages = Math.ceil(this.totalCount / this.pageSize);
        return pages > 0 ? pages : 1;
      },
      prevUrl () {
        return this.$store.state.readers.prev
      },
      nextUrl () {
        return this.$store.state.readers.next
      },
    },
    methods: {
      async fetchPage(url) {
        let { data } = await this.$axios.get(url.replace(this.baseUrl, ""));
        this.$store.commit('readers/setList', data.results);
        // regex lookbehind is not supported in several browsers - https://caniuse.com/#feat=js-regexp-lookbehind
        // this.$store.commit('readers/setPage', parseInt(url.match(/(?<=page=)[0-9]+/g)))  // extract page number from url
        this.$store.commit('readers/setPage', parseInt(url.match(/page=[0-9]+/g)[0].replace('page=','')));
        this.$store.commit('readers/setPrev', data.previous);
        this.$store.commit('readers/setNext', data.next);
      },
      fetchFirst() {
        this.gotoPage = 1;
        this.fetchPageByNumber();
      },
      fetchLast() {
        this.gotoPage = this.totalPages;
        this.fetchPageByNumber();
      },
      fetchNext() {
        this.fetchPage(this.nextUrl);
      },
      fetchPrev() {
        this.fetchPage(this.prevUrl);
      },
      async fetchPageByNumber() {
        let { data } = await this.$axios.get('/api/etag/readers/' +
          '?page=' + this.gotoPage +
          '&page_size=' + this.$store.state.readers.pageSize +
          '&format=json'
        );
        this.$store.commit('readers/setList', data.results);
        this.$store.commit('readers/setCount', data.count);
        this.$store.commit('readers/setPage', this.gotoPage);
        this.$store.commit('readers/setPrev', data.previous);
        this.$store.commit('readers/setNext', data.next);
        this.gotoPage = null;  // clear
      },
      editRecord(row) {
        this.$store.commit('readers/setActiveItem', row.item);
        this.$router.push('/edit_readerdata');
      },
      deleteRecord(row) {
        this.$store.commit('readers/setActiveItem', row.item);
        this.$router.push('/delete_readerdata');
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
        this.downloadFile('api/etag/file-template/?filetype=locations', 'readers_template.csv');
      },
      downloadData() {
        this.downloadFile('api/etag/file-download/?format=csv&filetype=locations', 'readers.csv');
      },
      failEvent(file, message, xhr) {
        alert("Failed to upload data. Please contact the site admin.");
        // TODO: add failure handling
        // See for available events: https://rowanwins.github.io/vue-dropzone/docs/dist/#/events
      },
      sendingEvent(file, xhr, formData) {
        formData.append('callback', this.api_callback);
        formData.append('filetype', this.filetype);
      },
      async successEvent(file, response) {
        this.processing = true;
        let taskid = response[0].callback.response.task_id;
        let result = await this.$axios.get("/api/queue/task/" + taskid);
        let status = result.data.result.status.toString();
        let counter = 0;
        while (status === "PENDING") {
          counter++;
          if (counter === 15) {
            break;
          }
          await sleep(1000);
          result = await this.$axios.get("/api/queue/task/" + taskid);
          status = result.data.result.status.toString();
        }
        switch(status) {
          case "SUCCESS":
            if (result.data.result.result[2].success) {
              let processed = result.data.result.result[2];
              const newFilter = R.pathOr("0",['new']);
              const updatedFilter = R.pathOr("0",['updated']);
              const deletedFilter = R.pathOr("0",['deleted']);
              let newCount = R.filter(newFilter, processed).new;
              let updatedCount = R.filter(updatedFilter, processed).updated;
              let deletedCount = R.filter(deletedFilter, processed).deleted;
              alert("new: " + newCount + ", updated: " + updatedCount + ", deleted: " + deletedCount);
              this.fetchFirst();
            } else {
              alert(result.data.result.result[2].error);
            }
            break;
          case "FAILURE":
            alert("Failed to load data. Please contact site admin with the following task id: " + result.data.task_id);
            break;
          case "PENDING":
            alert("Processing is taking longer than expected. Please check back in a few minutes.");
            break;
        }
        this.processing = false;
      }
    },
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

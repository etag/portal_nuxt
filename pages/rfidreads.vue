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
  </div>
</template>

<script>

  export default {
    async fetch ({ store, params, app: {$axios}}) {
      let { data } = await $axios.get('/api/etag/tag_reads/?page_size=10&format=json')
      store.commit('tagReads/setList', data.results)
      store.commit('tagReads/setCount', data.count)
      store.commit('tagReads/setPrev', data.prev)
      store.commit('tagReads/setNext', data.next)
    },
    computed: {
      items () {
        return this.$store.state.tagReads.list
      },
      fields () {
        return [
          'reader_id',
          'tag_id',
          'tag_read_time',
          'public',
          'accessory_data'
        ]
      },
      totalCount () {
        return this.$store.state.tagReads.count
      },
      prevUrl () {
        return this.$store.state.tagReads.prev
      },
      nextUrl () {
        return this.$store.state.tagReads.next
      },
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
        this.downloadFile('api/etag/file-template/?filetype=tagss', 'rfidreads_template.csv')
        //location.href = 'api/etag/file-template/?filetype=tags'
      },
      downloadData() {
        this.downloadFile('api/etag/file-download/?format=csv&filetype=tags', 'rfidreads.csv')
        //location.href = 'api/etag/file-download/?format=csv&filetype=tags'
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

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

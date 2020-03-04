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
      let { data } = await $axios.get('/api/etag/readers/?page_size=10&format=json')
      store.commit('readers/setList', data.results)
      store.commit('readers/setCount', data.count)
      store.commit('readers/setPrev', data.prev)
      store.commit('readers/setNext', data.next)
    },
    computed: {
      items () {
        return this.$store.state.readers.list
      },
      fields () {
        return [
          'reader_id',
          'description',
        ]
      },
      totalCount () {
        return this.$store.state.readers.count
      },
      prevUrl () {
        return this.$store.state.readers.prev
      },
      nextUrl () {
        return this.$store.state.readers.next
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

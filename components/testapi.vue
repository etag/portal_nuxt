<template>
  <div class="etag_readers">
    testing...
    <ul>
      <li v-for="tag in tags">
        {{ tag.tag_id }}: {{ tag.description }}
      </li>
    </ul>
  </div>
</template>
<script>
  import { mapMutations } from 'vuex'

  export default {
    name: 'TestApi',
    computed: {
      tags () {
        return this.$store.state.tags.list
      }
    }
  }
</script>

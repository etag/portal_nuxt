<template>
  <div>
    <!-- begin data table section -->
    <p v-if="$fetchState.pending">Fetching tasks...</p>
    <p v-else-if="$fetchState.error">Error while fetching tasks: {{ $fetchState.error.message }}</p>
    <b-card v-else>
    <b-table
      show-empty
      small
      striped
      borderless
      stacked="md"
      :items="tasks"
      :fields="fields"
    >
      <template v-slot:cell(task_name)="row">
        <b-link @click.stop="viewTask(row)">{{ row.item.task_name }}</b-link>
      </template>
    </b-table>
    <!-- end data table section -->

    <!-- begin pagination tools -->
    <b-container fluid="sm">
      <b-button @click="fetchFirst"><font-awesome-icon icon="backward" /></b-button>
      <b-button @click="fetchPrev" :disabled="!previousPage"><font-awesome-icon icon="angle-left" /></b-button>
      page {{ page }} of {{ totalPages }}
      <b-button @click="fetchNext" :disabled="!nextPage"><font-awesome-icon icon="angle-right" /></b-button>
      <b-button @click="fetchLast"><font-awesome-icon icon="forward" /></b-button>
      <input v-model="gotoPage" placeholder="page #" style="max-width: 70px"><b-button @click="fetchPageByNumber">Go</b-button>
    </b-container>
    <!-- end pagination tools -->
    </b-card>
  </div>
</template>

<script>
  export default {
    async fetch () {
      let { data } = await this.$axios.get('/api/queue/usertasks/' +
        '?page=' + this.$store.state.task.page +
        '&page_size=' + this.pageSize +
        '&format=json'
      );
      this.tasks = data.results;
      this.tasksCount = data.count;
      this.previousPage = data.previous;
      this.nextPage = data.next;
    },
    data() {
      return {
        tasks: [],
        tasksCount: 0,
        pageSize: 20,
        previousPage: null,
        nextPage: null,
        gotoPage: null,  // This holds the user supplied page number to directly goto for pagination
        baseUrl: process.env.baseUrl,
        fields: ['task_name', 'timestamp']  // fields to display on page
      }
    },
    computed: {
      totalPages () {
        let pages = Math.ceil(this.tasksCount / this.pageSize);
        return pages > 0 ? pages : 1;
      },
      page () {
        return this.$store.state.task.page;
      },
    },
    methods: {
      async fetchPage(url) {
        let { data } = await this.$axios.get(url.replace(this.baseUrl, ""));
        this.tasks = data.results;
        this.tasksCount = data.count;
        this.previousPage = data.previous;
        this.nextPage = data.next;
        this.$store.commit('task/setPage', parseInt(url.match(/page=[0-9]+/g)[0].replace('page=','')));
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
        this.fetchPage(this.nextPage);
      },
      fetchPrev() {
        this.fetchPage(this.previousPage);
      },
      async fetchPageByNumber() {
        let { data } = await this.$axios.get('/api/queue/usertasks/' +
          '?page=' + this.gotoPage +
          '&page_size=' + this.pageSize +
          '&format=json'
        );
        this.tasks = data.results;
        this.tasksCount = data.count;
        this.previousPage = data.previous;
        this.nextPage = data.next;
        this.$store.commit('task/setPage', this.gotoPage);
        this.gotoPage = null;
      },
      viewTask(row) {
        this.$store.commit('task/setActiveItem', row.item);
        this.$router.push('/taskstatus');
      },
    }
  }

</script>

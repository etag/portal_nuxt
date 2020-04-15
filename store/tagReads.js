export const state = () => ({
  list: [],     // list of records for current page
  count: 0,     // total number of records
  page: 1,      // track current page
  pageSize: 10, // number of items to show per page
  activeItem: null, // object of active item used for editing
  prev: null,   // url to previous page of content
  next: null,   // url to next page of content
})

export const mutations = {
  add (state, tag_read) {
    state.list.push(tag_read)
  },
  appendList(state, tag_reads) {
    state.list = [].concat.apply(state.list, tag_reads)
  },
  setList(state, tag_reads) {
    state.list = tag_reads
  },
  setActiveItem(state, item) {
    state.activeItem = item
  },
  setPage(state, page) {
    state.page = page
  },
  setPageSize(state, pageSize) {
    state.pageSize = pageSize
  },
  setCount(state, count) {
    state.count = count
  },
  setPrev(state, prev) {
    state.prev = prev
  },
  setNext(state, next) {
    state.next = next
  },
  remove (state, { tag_read }) {
    state.list.splice(state.list.indexOf(tag_read), 1)
  }
}

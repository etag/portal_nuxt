export const state = () => ({
  list: [],     // list of records for current page
  count: 0,     // total number of records
  page: 1,      // track current page
  pageSize: 10, // number of items to show per page
  prev: null,   // url to previous page of content
  next: null,   // url to next page of content
})

export const mutations = {
  add (state, tag) {
    state.list.push(tag)
  },
  appendList(state, tags) {
    state.list = [].concat.apply(state.list, tags)
  },
  setList(state, tags) {
    state.list = tags
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
  remove (state, { tag }) {
    state.list.splice(state.list.indexOf(tag), 1)
  }
}

export const state = () => ({
  list: [],     // list of records for current page
  count: 0,     // total number of records
  page: 1,      // track current page
  pageSize: 10, // number of items to show per page
  prev: null,   // url to previous page of content
  next: null,   // url to next page of content
})

export const mutations = {
  add (state, animal) {
    state.list.push(animal)
  },
  appendList(state, animals) {
    state.list = [].concat.apply(state.list, animals)
  },
  setList(state, animals) {
    state.list = animals
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
  remove (state, { animal }) {
    state.list.splice(state.list.indexOf(animal), 1)
  }
}

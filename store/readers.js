export const state = () => ({
  list: [],   // list of records for current page
  count: 0,   // total number of records
  prev: null, // url to previous page of content
  next: null, // url to next page of content
})

export const mutations = {
  add (state, reader) {
    state.list.push(reader)
  },
  appendList(state, readers) {
    state.list = [].concat.apply(state.list, readers)
  },
  setList(state, readers) {
    state.list = readers
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
  remove (state, { reader }) {
    state.list.splice(state.list.indexOf(reader), 1)
  }
}

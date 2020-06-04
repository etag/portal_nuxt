export const state = () => ({
  list: [], // list of records for current page
  count: 0, // total number of records
  page: 1, // track current page
  pageSize: 20, // number of items to show per page
  activeItem: null, // object of active item used for editing
  prev: null, // url to previous page of content
  next: null // url to next page of content
});

export const mutations = {
  update(state, payload) {
    state.activeItem.description = payload.description;
    state.activeItem.reader_id = payload.reader_id;
  },
  add(state, reader) {
    state.list.push(reader);
  },
  appendList(state, readers) {
    state.list = [].concat.apply(state.list, readers);
  },
  setList(state, readers) {
    state.list = readers;
  },
  setActiveItem(state, item) {
    state.activeItem = item;
  },
  setPage(state, page) {
    state.page = page;
  },
  setPageSize(state, pageSize) {
    state.pageSize = pageSize;
  },
  setCount(state, count) {
    state.count = count;
  },
  setPrev(state, prev) {
    state.prev = prev;
  },
  setNext(state, next) {
    state.next = next;
  },
  remove(state, { reader }) {
    state.list.splice(state.list.indexOf(reader), 1);
  }
};

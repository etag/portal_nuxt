export const state = () => ({
  activeItem: null, // object of active item used for editing
  page: 1      // track current page
})

export const mutations = {
  setActiveItem(state, item) {
    state.activeItem = item
  },
  setPage(state, page) {
    state.page = page
  },
}

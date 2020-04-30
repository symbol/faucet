export const state = () => ({
  mosaicList: [],
  filterMosaics: []
})

export const getters = {
  getMosaicList: state => state.mosaicList,
  getFilterMosaics: state => state.filterMosaics
}

export const mutations = {
  setMosaicList: (state, mosaicList) => { state.mosaicList = mosaicList },
  setFilterMosaics: (state, filterMosaics) => { state.filterMosaics = filterMosaics },
}

export const actions = {
  nuxtServerInit: ({ dispatch, commit }) => {
    console.debug('nuxtServerInit')
  },

  test: () => {
    console.debug('test')
  }
}

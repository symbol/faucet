export const state = () => ({
  mosaicList: [],
  blackList: []
})

export const getters = {
  getMosaicList: state => state.mosaicList,
  getBlackList: state => state.blackList
}

export const mutations = {
  setMosaicList: (state, mosaicList) => { state.mosaicList = mosaicList },
}

export const actions = {
  nuxtServerInit: ({ dispatch, commit }) => {
    console.debug('nuxtServerInit')
  }
}

export default {
  namespaced: true,

  state: {
    event_detail: {},
    likedQuestions: []
  },

  mutations: {

    setEventDetail: (state, value) => {
      state.event_detail = value
    },

    setLikedQuestions: (state, value) => {
        state.likedQuestions.push(value)
    },

    setClear: state => {
      Object.assign(state, {
        event_detail: {},
        likedQuestions: []
      })
    }

  },

  actions: {

    doSetEventDetail: ({ commit }, value) => {
      commit('setEventDetail', value)
    },

    doSetLikedQuestions: ({ commit }, value) => {
      commit('setLikedQuestions', value)
    },

    doSetClear: ({ commit }, value) => {
      commit('setClear', value)
    }
    
  },

  getters: {
    dataEventDetail: state => state.event_detail,
    dataLikedQuestions: state => state.likedQuestions
  },
}
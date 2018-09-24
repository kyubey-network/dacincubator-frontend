import Vue from 'vue';
import Vuex from 'vuex';
import Eos from 'eosjs';
import { networks } from './config';

const network = networks.kylin;

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    scatter: null,
    identity: null,
    eos: null,
  },
  getters: {
    account: ({ scatter }) => {
      if (!scatter) { return null }
      const { identity } = scatter
      return identity ? identity.accounts.find(({ blockchain }) => blockchain === 'eos') : null
    },
  },
  mutations: {
    setScatter(state, scatter) {
      state.scatter = scatter;
      state.eos = scatter.eos(network, Eos, {});
      state.identity = scatter.identity;
    },
    setIdentity(state, identity) {
      state.identity = identity;
    },
  },
  actions: {
    initScatter({ commit }, scatter) {
      commit('setScatter', scatter);
    },
  },
});

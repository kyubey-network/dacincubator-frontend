import Vue from 'vue';
import Vuex from 'vuex';
import Eos from 'eosjs';
import { getTokenPrice, getMyBalancesByContract } from './blockchain';
import { networks } from './config';

const network = networks.eosasia;

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    scatter: null,
    identity: null,
    eos: null,
    balance: {
      eos: '0.0000 EOS',
      kbyy: '0.0000 KBYY',
    },
    tokenPrice: '0.0000',
  },
  getters: {
    account: ({ scatter }) => {
      if (!scatter) { return null; }
      const { identity } = scatter;
      return identity ? identity.accounts.find(({ blockchain }) => blockchain === 'eos') : null;
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
    setTokenPrice(state, price) {
      state.tokenPrice = `${price} EOS`;
    },
    setBalance(state, { name, balance }) {
      state.balance[name] = balance;
    },
  },
  actions: {
    initScatter({ commit }, scatter) {
      commit('setScatter', scatter);
      getTokenPrice().then((price) => { commit('setTokenPrice', price); });
      getMyBalancesByContract({ symbol: 'eos' })
        .then((price) => { commit('setBalance', { name: 'eos', balance: price[0] }); });
      getMyBalancesByContract({ symbol: 'kbyy', tokenContract: 'dacincubator' })
        .then((price) => { commit('setBalance', { name: 'kbyy', balance: price[0] }); });
    },
    updatePrice({ commit }) {
      getTokenPrice().then((price) => { commit('setTokenPrice', price); });
    },
    setIdentity({ commit }, identity) {
      commit('setIdentity', identity);
    },
  },
});
